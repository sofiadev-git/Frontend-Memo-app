import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Deck } from '../types';
import { useAuth } from '../auth/AuthContext';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import './DeckPage.css';
import './CreazioneMazzo.css';

export default function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deckId = Number(id);

  useEffect(() => {
    let active = true;

    if (!Number.isFinite(deckId)) {
      setError('Mazzo non valido.');
      setLoading(false);
      return () => {
        active = false;
      };
    }

    deckService
      .get(deckId)
      .then((data) => {
        if (active) setDeck(data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [deckId]);

  if (loading) {
    return <div className="page-message">Caricamento mazzo...</div>;
  }

  if (error || !deck) {
    return <div className="page-message page-error">{error || 'Mazzo non trovato.'}</div>;
  }

  const isOwner = isLoggedIn && deck.authorUsername === username;

  const requireLogin = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireLogin() || deck.id == null) return;

    try {
      setDeck(await deckService.toggleLike(deck.id));
    } catch (requestError) {
      window.alert(getErrorMessage(requestError));
    }
  };

  const handleBookmark = async () => {
    if (!requireLogin() || deck.id == null) return;

    try {
      setDeck(await deckService.toggleBookmark(deck.id));
    } catch (requestError) {
      window.alert(getErrorMessage(requestError));
    }
  };

  const handleDelete = async () => {
    if (deck.id == null) return;

    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare il mazzo "${deck.name}"?`
    );

    if (!confirmed) return;

    try {
      await deckService.remove(deck.id);
      navigate('/profile');
    } catch (requestError) {
      window.alert(getErrorMessage(requestError));
    }
  };

  return (
    <div className="creazione-container">
      <div className="azioni-header deck-actions-header">
        <button className="btn-indietro" onClick={() => navigate(-1)}>
          ← Torna indietro
        </button>

        <div className="deck-actions-group">
          {isOwner && (
            <>
              <button className="btn-delete-deck" onClick={handleDelete}>
                🗑️ Elimina Mazzo
              </button>
              <button className="btn-indietro" onClick={() => navigate(`/deck/${deck.id}/edit`)}>
                ✏️ Modifica
              </button>
            </>
          )}

          {isLoggedIn && (
            <button className="btn-salva" onClick={() => navigate(`/deck/${deck.id}/review`)}>
              ▶️ Avvia Ripasso
            </button>
          )}
        </div>
      </div>

      <div className="info-mazzo-bubble deck-info-bubble">
        <div className="deck-info-text">
          <div className="deck-author">👤 Creato da: {deck.authorUsername ?? 'Anonimo'}</div>
          <h1>{deck.name}</h1>
          <span className="deck-category">Categoria: {deck.category}</span>
          <p>Questo mazzo contiene {deck.flashcards.length} carte.</p>
          {deck.createdAt && (
            <p className="deck-created-at">
              Creato il {new Date(deck.createdAt).toLocaleDateString('it-IT')}
            </p>
          )}
        </div>

        <div className="deck-social-actions">
          <div className="deck-social-item">
            <button
              onClick={handleLike}
              className="icon-action-button"
              title={deck.liked ? 'Rimuovi mi piace' : 'Metti mi piace'}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill={deck.liked ? '#ff4d4f' : 'none'}
                stroke={deck.liked ? '#ff4d4f' : '#ccc'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <div className="social-count">{deck.likes}</div>
          </div>

          {!isOwner && (
            <div className="deck-social-item">
              <button
                onClick={handleBookmark}
                className="icon-action-button"
                title={deck.bookmarked ? 'Rimuovi dai salvati' : 'Salva mazzo'}
              >
                <svg
                  width="35"
                  height="40"
                  viewBox="0 0 24 24"
                  fill={deck.bookmarked ? '#ff4d4f' : 'none'}
                  stroke={deck.bookmarked ? '#ff4d4f' : '#ccc'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <div className={`bookmark-label ${deck.bookmarked ? 'active' : ''}`}>
                Salva
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lista-carte">
        {deck.flashcards.length === 0 && (
          <div className="page-message">Questo mazzo non contiene ancora flashcard.</div>
        )}

        {deck.flashcards.map((card, index) => (
          <div key={card.id ?? index} className="carta-block">
            <div className="carta-header">Carta {index + 1}</div>
            <div className="carta-corpo">
              <div className="carta-lato">
                <label>Fronte</label>
                <div className="readonly-card-side">
                  <span>{card.frontText}</span>
                  {card.frontDescription && <small>{card.frontDescription}</small>}
                </div>
              </div>

              <div className="carta-lato">
                <label>Retro</label>
                <div className="readonly-card-side">
                  <span>{card.backText}</span>
                  {card.backDescription && <small>{card.backDescription}</small>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
