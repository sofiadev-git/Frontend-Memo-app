import type { Flashcard } from '../types';
import api from './api.ts';

const flashcardService = {
  async create(deckId: number, card: Flashcard): Promise<Flashcard> {
    const response = await api.post<Flashcard>(
      `/decks/${deckId}/flashcards`,
      card
    );
    return response.data;
  },

  async update(deckId: number, cardId: number, card: Flashcard): Promise<Flashcard> {
    const response = await api.put<Flashcard>(
      `/decks/${deckId}/flashcards/${cardId}`,
      card
    );
    return response.data;
  },

  async remove(deckId: number, cardId: number): Promise<void> {
    await api.delete(`/decks/${deckId}/flashcards/${cardId}`);
  }
};

export default flashcardService;
