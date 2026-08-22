import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Deck } from '../types';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import DeckCard from '../components/DeckCard';
import './risultatiRicerca.css';

type SearchFilter = 'all' | 'name' | 'category';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const filterParam = searchParams.get('filter');
  const filter: SearchFilter =
      filterParam === 'name' || filterParam === 'category' ? filterParam : 'all';

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!query) {
      setDecks([]);
      setError('');
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError('');

    deckService
        .search(query, filter)
        .then((results) => {
          if (active) setDecks(results);
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
  }, [query, filter]);

  const changeFilter = (newFilter: SearchFilter) => {
    const params: Record<string, string> = { q: query };
    if (newFilter !== 'all') {
      params.filter = newFilter;
    }
    setSearchParams(params);
  };

  const updateDeck = (updated: Deck) => {
    setDecks((current) =>
        current.map((deck) => (deck.id === updated.id ? updated : deck))
    );
  };

  return (
      <div className="ricerca-container">
        <div className="ricerca-header">
          <div>
            <h2 style={{ color: '#333', margin: 0 }}>
              Risultati per:{' '}
              <span style={{ color: '#9A83F0' }}>&quot;{query}&quot;</span>
            </h2>
            <p style={{ color: '#888', margin: '0.5rem 0 0 0' }}>
              {loading ? 'Ricerca in corso...' : `${decks.length} mazzi trovati`}
            </p>
          </div>

          <div className="ricerca-toggles" aria-label="Filtra risultati ricerca">
            <button
                type="button"
                className={`btn-toggle-ricerca ${filter === 'all' ? 'active' : ''}`}
                onClick={() => changeFilter('all')}
            >
              Tutti
            </button>
            <button
                type="button"
                className={`btn-toggle-ricerca ${filter === 'name' ? 'active' : ''}`}
                onClick={() => changeFilter('name')}
            >
              Solo nome mazzo
            </button>
            <button
                type="button"
                className={`btn-toggle-ricerca ${filter === 'category' ? 'active' : ''}`}
                onClick={() => changeFilter('category')}
            >
              Solo categoria
            </button>
          </div>
        </div>

        {error && <div className="page-message page-error">{error}</div>}

        {!error && !loading && (
            <div className="ricerca-grid">
              {decks.length > 0 ? (
                  decks.map((deck) => (
                      <DeckCard key={deck.id} deck={deck} onChange={updateDeck} />
                  ))
              ) : (
                  <div className="empty-result">
                    Nessun mazzo trovato con il filtro selezionato.
                  </div>
              )}
            </div>
        )}
      </div>
  );
}
