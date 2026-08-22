import type { Deck } from '../types';
import api from './api.ts';

const deckService = {
  async top(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/top');
    return response.data;
  },

  async recent(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/recent');
    return response.data;
  },

  async search(
      query: string,
      filter: 'all' | 'name' | 'category' = 'all'
  ): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/search', {
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

  async mine(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/mine');
    return response.data;
  },

  async bookmarks(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/bookmarks');
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

  async toggleLike(id: number): Promise<Deck> {
    const response = await api.post<Deck>(`/decks/${id}/like`);
    return response.data;
  },

  async toggleBookmark(id: number): Promise<Deck> {
    const response = await api.post<Deck>(`/decks/${id}/bookmark`);
    return response.data;
  }
};

export default deckService;
