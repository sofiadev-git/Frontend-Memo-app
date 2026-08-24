export interface Flashcard {
  id: number | null;
  position: number;
  frontText: string;
  frontDescription: string | null;
  backText: string;
  backDescription: string | null;
}

export interface Deck {
  id: number | null;
  name: string;
  category: string;
  likes: number;
  createdAt: string | null;
  authorUsername: string | null;
  flashcards: Flashcard[];
  liked: boolean;
  bookmarked: boolean;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}
