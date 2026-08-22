import { useEffect, useState } from 'react';
import type { Deck } from '../types';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import DeckCard from '../components/DeckCard';
import './Home.css';

export default function HomePage() {
  const [topDecks, setTopDecks] = useState<Deck[]>([]);
  const [recentDecks, setRecentDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([deckService.top(), deckService.recent()])
      .then(([top, recent]) => {
        if (active) {
          setTopDecks(top);
          setRecentDecks(recent);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const updateDeckEverywhere = (updated: Deck) => {
    setTopDecks((current) =>
      current.map((deck) => (deck.id === updated.id ? updated : deck))
    );
    setRecentDecks((current) =>
      current.map((deck) => (deck.id === updated.id ? updated : deck))
    );
  };

  if (loading) {
    return <div className="page-message">Caricamento mazzi...</div>;
  }

  if (error) {
    return <div className="page-message page-error">{error}</div>;
  }

  return (
    <div className="home-container">
      <div className="home-section">
        <h2 className="home-section-title">🔥 Top 4 Mazzi Più Apprezzati</h2>
        <div className="home-mazzi-grid">
          {topDecks.length > 0 ? (
            topDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onChange={updateDeckEverywhere} />
            ))
          ) : (
            <p>Nessun mazzo disponibile.</p>
          )}
        </div>
      </div>

      <div className="home-section">
        <h2 className="home-section-title">🆕 Ultimi 8 Mazzi Creati</h2>
        <div className="home-mazzi-grid">
          {recentDecks.length > 0 ? (
            recentDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onChange={updateDeckEverywhere} />
            ))
          ) : (
            <p>Nessun mazzo disponibile.</p>
          )}
        </div>
      </div>
    </div>
  );
}
