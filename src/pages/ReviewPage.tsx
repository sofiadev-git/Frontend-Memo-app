import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Deck } from '../types';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import './RipassoMazzo.css';

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState('');

  const deckId = Number(id);

  useEffect(() => {
    if (!Number.isFinite(deckId)) {
      setError('Mazzo non valido.');
      return;
    }

    deckService
      .get(deckId)
      .then(setDeck)
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [deckId]);

  if (error) {
    return (
      <div className="ripasso-container">
        <h2>{error}</h2>
        <button className="btn-concludi" onClick={() => navigate(-1)}>
          Torna indietro
        </button>
      </div>
    );
  }

  if (!deck) {
    return <div className="ripasso-container">Caricamento...</div>;
  }

  if (deck.flashcards.length === 0) {
    return (
      <div className="ripasso-container">
        <h2>Ops! Questo mazzo non ha ancora carte da ripassare.</h2>
        <button className="btn-concludi" onClick={() => navigate(`/deck/${deck.id}`)}>
          Torna indietro
        </button>
      </div>
    );
  }

  const card = deck.flashcards[currentIndex];

  const previous = (event: MouseEvent) => {
    event.stopPropagation();
    if (currentIndex === 0) return;
    setFlipped(false);
    setCurrentIndex((index) => index - 1);
  };

  const next = (event: MouseEvent) => {
    event.stopPropagation();
    if (currentIndex >= deck.flashcards.length - 1) return;
    setFlipped(false);
    setCurrentIndex((index) => index + 1);
  };

  return (
    <div className="ripasso-container">
      <h2 style={{ color: '#555', marginBottom: '2rem' }}>
        Ripasso: {deck.name} ({currentIndex + 1} / {deck.flashcards.length})
      </h2>

      <div className="ripasso-main">
        <button className="nav-arrow" onClick={previous} disabled={currentIndex === 0}>
          &lt;
        </button>

        <div className="flashcard-wrapper" onClick={() => setFlipped((value) => !value)}>
          <div className={`flashcard-inner ${flipped ? 'is-flipped' : ''}`}>
            <div className="flashcard-front">
              <div className="review-side-content">
                <span>{card.frontText}</span>
                {card.frontDescription && <small>{card.frontDescription}</small>}
              </div>
            </div>

            <div className="flashcard-back">
              <div className="review-side-content">
                <span>{card.backText}</span>
                {card.backDescription && <small>{card.backDescription}</small>}
              </div>
            </div>
          </div>
        </div>

        <button
          className="nav-arrow"
          onClick={next}
          disabled={currentIndex === deck.flashcards.length - 1}
        >
          &gt;
        </button>
      </div>

      <button className="btn-concludi" onClick={() => navigate(`/deck/${deck.id}`)}>
        Concludi Ripasso
      </button>
    </div>
  );
}
