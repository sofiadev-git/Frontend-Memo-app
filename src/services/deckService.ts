import type { Deck, DeckSummary } from '../types';
import api from './api.ts';

const deckService = {
  async top(): Promise<DeckSummary[]> {
    const response = await api.get<DeckSummary[]>('/decks/top');
    return response.data;
  },

  async recent(): Promise<DeckSummary[]> {
    const response = await api.get<DeckSummary[]>('/decks/recent');
    return response.data;
  },

  async search(
      query: string,
      filter: 'all' | 'name' | 'category' = 'all'
  ): Promise<DeckSummary[]> {
    const response = await api.get<DeckSummary[]>('/decks/search', {
      params: {
        q: query,
        filter
      }
    });

    return response.data;
  },

  async get(id: number): Promise<Deck> {
    const response = await api.get<Deck>(`/decks/${id}`);
    return response.data;
  },

  async mine(): Promise<DeckSummary[]> {
    const response = await api.get<DeckSummary[]>('/decks/mine');
    return response.data;
  },

  async bookmarks(): Promise<DeckSummary[]> {
    const response = await api.get<DeckSummary[]>('/decks/bookmarks');
    return response.data;
  },

  async create(deck: Deck): Promise<Deck> {
    const response = await api.post<Deck>('/decks', deck);
    return response.data;
  },

  async update(id: number, deck: Deck): Promise<Deck> {
    const response = await api.put<Deck>(`/decks/${id}`, deck);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/decks/${id}`);
  },

  async toggleLike(id: number): Promise<DeckSummary> {
    const response = await api.post<DeckSummary>(`/decks/${id}/like`);
    return response.data;
  },

  async toggleBookmark(id: number): Promise<Deck> {
    const response = await api.post<Deck>(`/decks/${id}/bookmark`);
    return response.data;
  }
};

export default deckService;
