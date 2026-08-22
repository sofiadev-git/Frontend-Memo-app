import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Deck } from '../types';
import { useAuth } from '../auth/AuthContext';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import '../pages/Home.css';

interface DeckCardProps {
  deck: Deck;
  onChange?: (deck: Deck) => void;
  showLike?: boolean;
}

export default function DeckCard({ deck, onChange, showLike = true }: DeckCardProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const openDeck = () => {
    if (deck.id != null) {
      navigate(`/deck/${deck.id}`);
    }
  };

  const toggleLike = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (deck.id == null) return;

    try {
      const updated = await deckService.toggleLike(deck.id);
      onChange?.(updated);
    } catch (error) {
      window.alert(getErrorMessage(error));
    }
  };

  return (
    <div className="home-mazzo-card" onClick={openDeck}>
      <div>
        <h3>{deck.name}</h3>
        <p>{deck.flashcards?.length ?? 0} carte</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          di {deck.authorUsername ?? 'Anonimo'}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem'
        }}
      >
        <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>
          {deck.category || 'Generale'}
        </span>

        {showLike && (
          <button
            onClick={toggleLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'transform 0.2s'
            }}
            title={deck.liked ? 'Rimuovi mi piace' : 'Metti mi piace'}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={deck.liked ? '#ff4d4f' : 'none'}
              stroke={deck.liked ? '#ff4d4f' : '#aaa'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span style={{ fontSize: '1.1rem', color: '#555', fontWeight: 'bold' }}>
              {deck.likes}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
