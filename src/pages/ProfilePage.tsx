import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DeckSummary } from '../types';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import DeckCard from '../components/DeckCard';
import './Profilo.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'mine' | 'bookmarks'>('mine');
  const [mine, setMine] = useState<DeckSummary[]>([]);
  const [bookmarks, setBookmarks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([deckService.mine(), deckService.bookmarks()])
        .then(([myDecks, savedDecks]) => {
          if (active) {
            setMine(myDecks);
            setBookmarks(savedDecks);
          }
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
  }, []);

  const updateDeck = (updated: DeckSummary) => {
    setMine((current) =>
        current.map((deck) => (deck.id === updated.id ? updated : deck))
    );
    setBookmarks((current) =>
        current.map((deck) => (deck.id === updated.id ? updated : deck))
    );
  };

  if (loading) {
    return <div className="page-message">Caricamento profilo...</div>;
  }

  return (
      <div className="profilo-container">
        <div className="profile-tabs">
          <button
              className={`profile-tab profile-tab-mine ${tab === 'mine' ? 'active' : ''}`}
              onClick={() => setTab('mine')}
          >
            I Tuoi Mazzi
          </button>
          <button
              className={`profile-tab profile-tab-saved ${tab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setTab('bookmarks')}
          >
            🔖 Salvati ({bookmarks.length})
          </button>
        </div>

        {error && <div className="page-message page-error">{error}</div>}

        {!error && (
            <div className="mazzi-grid">
              {tab === 'mine' && (
                  <div className="mazzo-card mazzo-card-nuovo" onClick={() => navigate('/deck/new')}>
                    <div className="icona-piu">+</div>
                    <div>Crea nuovo mazzo</div>
                  </div>
              )}

              {(tab === 'mine' ? mine : bookmarks).map((deck) => (
                  <DeckCard
                      key={deck.id}
                      deck={deck}
                      onChange={updateDeck}
                  />
              ))}
            </div>
        )}

        {!error && tab === 'bookmarks' && bookmarks.length === 0 && (
            <div className="profile-empty">Non hai ancora salvato nessun mazzo.</div>
        )}
      </div>
  );
}
