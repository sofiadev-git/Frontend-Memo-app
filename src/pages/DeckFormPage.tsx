import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Deck, Flashcard } from '../types';
import deckService from '../services/deckService';
import flashcardService from '../services/flashcardService';
import { getErrorMessage } from '../services/api';
import './CreazioneMazzo.css';

interface FormCard extends Flashcard {
  clientKey: string;
}

function PlusIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
  );
}

function ArrowUpIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 15 6-6 6 6" />
      </svg>
  );
}

function ArrowDownIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
  );
}

function TrashIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
  );
}

function emptyCard(key: string, position = 0): FormCard {
  return {
    clientKey: key,
    id: null,
    position,
    frontText: '',
    frontDescription: '',
    backText: '',
    backDescription: ''
  };
}

function normalizePositions(cards: FormCard[]): FormCard[] {
  return cards.map((card, index) => ({
    ...card,
    position: index
  }));
}

function toDeckPayload(name: string, category: string, id: number | null = null): Deck {
  return {
    id,
    name,
    category,
    likes: 0,
    createdAt: null,
    authorUsername: null,
    flashcards: [],
    liked: false,
    bookmarked: false
  };
}

export default function DeckFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sequence = useRef(0);
  const isEdit = Boolean(id);
  const deckId = id ? Number(id) : null;

  const nextKey = () => {
    sequence.current += 1;
    return `card-${Date.now()}-${sequence.current}`;
  };

  const initialCards = useMemo(
      () => [
        emptyCard('initial-1', 0),
        emptyCard('initial-2', 1),
        emptyCard('initial-3', 2)
      ],
      []
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState<FormCard[]>(initialCards);
  const [originalCardIds, setOriginalCardIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit || deckId == null || !Number.isFinite(deckId)) return;

    let active = true;

    deckService
        .get(deckId)
        .then((deck) => {
          if (!active) return;

          setName(deck.name);
          setCategory(deck.category);

          const loadedCards: FormCard[] = deck.flashcards.map((card, index) => ({
            ...card,
            position: index,
            clientKey: `server-${card.id}`
          }));

          setCards(
              loadedCards.length > 0
                  ? loadedCards
                  : [emptyCard(nextKey(), 0)]
          );

          setOriginalCardIds(
              deck.flashcards
                  .map((card) => card.id)
                  .filter((cardId): cardId is number => cardId != null)
          );
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
  }, [deckId, isEdit]);

  const addCard = () => {
    setCards((current) =>
        normalizePositions([
          ...current,
          emptyCard(nextKey(), current.length)
        ])
    );
  };

  const addCardAfter = (index: number) => {
    setCards((current) => {
      const updated = [...current];
      updated.splice(index + 1, 0, emptyCard(nextKey(), index + 1));
      return normalizePositions(updated);
    });
  };

  const moveCardUp = (index: number) => {
    if (index <= 0) return;

    setCards((current) => {
      const updated = [...current];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return normalizePositions(updated);
    });
  };

  const moveCardDown = (index: number) => {
    setCards((current) => {
      if (index >= current.length - 1) return current;

      const updated = [...current];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return normalizePositions(updated);
    });
  };

  const updateCard = (
      clientKey: string,
      field: 'frontText' | 'frontDescription' | 'backText' | 'backDescription',
      value: string
  ) => {
    setCards((current) =>
        current.map((card) =>
            card.clientKey === clientKey ? { ...card, [field]: value } : card
        )
    );
  };

  const removeCard = (clientKey: string) => {
    setCards((current) =>
        normalizePositions(
            current.filter((card) => card.clientKey !== clientKey)
        )
    );
  };

  const cardsToSave = cards.filter((card) => {
    return Boolean(
        card.frontText.trim() ||
        card.backText.trim() ||
        card.frontDescription?.trim() ||
        card.backDescription?.trim()
    );
  });

  const validate = (): string | null => {
    if (!name.trim()) return 'Inserisci il nome del mazzo.';
    if (!category.trim()) return 'Inserisci la categoria del mazzo.';

    const incomplete = cardsToSave.find(
        (card) => !card.frontText.trim() || !card.backText.trim()
    );

    if (incomplete) {
      return 'Ogni flashcard compilata deve avere sia il fronte sia il retro.';
    }

    return null;
  };

  const cardPayload = (card: FormCard, position: number): Flashcard => ({
    id: card.id,
    position,
    frontText: card.frontText.trim(),
    frontDescription: card.frontDescription?.trim() || null,
    backText: card.backText.trim(),
    backDescription: card.backDescription?.trim() || null
  });

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        if (deckId == null || !Number.isFinite(deckId)) {
          throw new Error('Identificativo mazzo non valido.');
        }

        await deckService.update(
            deckId,
            toDeckPayload(name.trim(), category.trim(), deckId)
        );

        const currentExistingIds = cardsToSave
            .map((card) => card.id)
            .filter((cardId): cardId is number => cardId != null);

        const removedIds = originalCardIds.filter(
            (originalId) => !currentExistingIds.includes(originalId)
        );

        for (const removedId of removedIds) {
          await flashcardService.remove(deckId, removedId);
        }

        for (let position = 0; position < cardsToSave.length; position += 1) {
          const card = cardsToSave[position];
          const payload = cardPayload(card, position);

          if (card.id == null) {
            await flashcardService.create(deckId, payload);
          } else {
            await flashcardService.update(deckId, card.id, payload);
          }
        }

        navigate(`/deck/${deckId}`);
        return;
      }

      const createdDeck = await deckService.create(
          toDeckPayload(name.trim(), category.trim())
      );

      if (createdDeck.id == null) {
        throw new Error('Il backend non ha restituito l’ID del nuovo mazzo.');
      }

      try {
        for (let position = 0; position < cardsToSave.length; position += 1) {
          const card = cardsToSave[position];

          await flashcardService.create(
              createdDeck.id,
              cardPayload(card, position)
          );
        }
      } catch (cardError) {
        // Se la creazione delle carte fallisce, proviamo a non lasciare un mazzo parziale.
        try {
          await deckService.remove(createdDeck.id);
        } catch {
          // Se anche il rollback fallisce, mostriamo comunque l'errore originale.
        }
        throw cardError;
      }

      navigate(`/deck/${createdDeck.id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-message">Caricamento mazzo...</div>;
  }

  return (
      <div className="creazione-container">
        <div className="azioni-header">
          <button className="btn-indietro" onClick={() => navigate(-1)} disabled={saving}>
            Annulla e Indietro
          </button>
          <button className="btn-salva" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Salva Mazzo'}
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="info-mazzo-bubble">
          <div className="input-group">
            <label>Nome del Mazzo</label>
            <input
                type="text"
                placeholder="Es. Verbi Spagnoli..."
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Categoria / Filtro</label>
            <input
                type="text"
                placeholder="Es. Lingue, Storia..."
                value={category}
                onChange={(event) => setCategory(event.target.value)}
            />
          </div>
        </div>

        <div className="lista-carte">
          {cards.map((card, index) => (
              <div key={card.clientKey} className="carta-block">
                <div className="carta-header card-form-header">
                  <span>Carta {index + 1}</span>

                  <div className="card-header-actions">
                    <button
                        type="button"
                        className="card-icon-button"
                        onClick={() => addCardAfter(index)}
                        title="Inserisci una carta dopo questa"
                        aria-label={`Inserisci una carta dopo Carta ${index + 1}`}
                        disabled={saving}
                    >
                      <PlusIcon />
                    </button>

                    <button
                        type="button"
                        className="card-icon-button"
                        onClick={() => moveCardUp(index)}
                        title="Sposta la carta verso l'alto"
                        aria-label={`Sposta Carta ${index + 1} verso l'alto`}
                        disabled={saving || index === 0}
                    >
                      <ArrowUpIcon />
                    </button>

                    <button
                        type="button"
                        className="card-icon-button"
                        onClick={() => moveCardDown(index)}
                        title="Sposta la carta verso il basso"
                        aria-label={`Sposta Carta ${index + 1} verso il basso`}
                        disabled={saving || index === cards.length - 1}
                    >
                      <ArrowDownIcon />
                    </button>

                    <button
                        type="button"
                        onClick={() => removeCard(card.clientKey)}
                        className="card-icon-button card-delete-button"
                        title="Elimina questa carta"
                        aria-label={`Elimina Carta ${index + 1}`}
                        disabled={saving}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <div className="carta-corpo">
                  <div className="carta-lato">
                    <label>Fronte</label>
                    <textarea
                        placeholder="Testo principale..."
                        maxLength={2000}
                        value={card.frontText}
                        onChange={(event) =>
                            updateCard(card.clientKey, 'frontText', event.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Pronuncia o descrizione (opzionale)"
                        maxLength={1000}
                        value={card.frontDescription ?? ''}
                        onChange={(event) =>
                            updateCard(card.clientKey, 'frontDescription', event.target.value)
                        }
                        className="card-description-input"
                    />
                  </div>

                  <div className="carta-lato">
                    <label>Retro</label>
                    <textarea
                        placeholder="Testo principale..."
                        maxLength={2000}
                        value={card.backText}
                        onChange={(event) =>
                            updateCard(card.clientKey, 'backText', event.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Pronuncia o descrizione (opzionale)"
                        maxLength={1000}
                        value={card.backDescription ?? ''}
                        onChange={(event) =>
                            updateCard(card.clientKey, 'backDescription', event.target.value)
                        }
                        className="card-description-input"
                    />
                  </div>
                </div>
              </div>
          ))}
        </div>

        <button className="btn-aggiungi-carta" onClick={addCard} type="button" disabled={saving}>
          + Aggiungi carta
        </button>
      </div>
  );
}
