import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Deck } from '../types';

import { useAuth } from '../auth/AuthContext';

import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';

import './CreazioneMazzo.css';
import './DeckPage.css';


/* =========================================
   ICONE
   ========================================= */

function BackIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}


function DeleteIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
        </svg>
    );
}


function EditIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20h9" />

            <path
                d="
                    M16.5 3.5
                    a2.1 2.1 0 0 1 3 3
                    L7 19
                    l-4 1
                    1-4
                    Z
                "
            />
        </svg>
    );
}


function PlayIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M8 5v14l11-7Z" />
        </svg>
    );
}


function CategoryIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path
                d="
                    M20 13
                    11 22
                    l-9-9
                    V3
                    h10
                    l8 8
                    a2 2 0 0 1 0 2
                    Z
                "
            />

            <circle
                cx="7"
                cy="8"
                r="1.5"
            />
        </svg>
    );
}


/* =========================================
   PAGINA
   ========================================= */

export default function DeckPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        isLoggedIn,
        username,
        role
    } = useAuth();


    const [deck, setDeck] =
        useState<Deck | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');


    const deckId = Number(id);


    /* =========================================
       CARICAMENTO MAZZO
       ========================================= */

    useEffect(() => {

        let active = true;


        if (!Number.isFinite(deckId)) {

            setError(
                'Mazzo non valido.'
            );

            setLoading(false);


            return () => {
                active = false;
            };
        }


        deckService
            .get(deckId)

            .then((data) => {

                if (active) {
                    setDeck(data);
                }

            })

            .catch((requestError) => {

                if (active) {

                    setError(
                        getErrorMessage(
                            requestError
                        )
                    );

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

    }, [deckId]);


    /* =========================================
       LOADING / ERRORI
       ========================================= */

    if (loading) {

        return (
            <div className="page-message">
                Caricamento mazzo...
            </div>
        );

    }


    if (error || !deck) {

        return (
            <div className="page-message page-error">
                {
                    error ||
                    'Mazzo non trovato.'
                }
            </div>
        );

    }


    /* =========================================
       PROPRIETARIO DEL MAZZO
       ========================================= */

    const isOwner =
        isLoggedIn &&
        deck.authorUsername === username;

    const isAdmin =
        isLoggedIn &&
        role === 'ADMIN';


    /* =========================================
       CONTROLLO LOGIN
       ========================================= */

    const requireLogin = () => {

        if (!isLoggedIn) {

            navigate('/login');

            return false;
        }


        return true;
    };


    /* =========================================
       LIKE
       ========================================= */

    const handleLike = async () => {

        if (
            !requireLogin() ||
            deck.id == null
        ) {
            return;
        }


        try {

            const updatedDeck =
                await deckService.toggleLike(
                    deck.id
                );


            setDeck(updatedDeck);

        } catch (requestError) {

            window.alert(
                getErrorMessage(
                    requestError
                )
            );

        }

    };


    /* =========================================
       BOOKMARK
       ========================================= */

    const handleBookmark = async () => {

        if (
            !requireLogin() ||
            deck.id == null
        ) {
            return;
        }


        try {

            const updatedDeck =
                await deckService.toggleBookmark(
                    deck.id
                );


            setDeck(updatedDeck);

        } catch (requestError) {

            window.alert(
                getErrorMessage(
                    requestError
                )
            );

        }

    };


    /* =========================================
       ELIMINAZIONE
       ========================================= */

    const handleDelete = async () => {

        if (deck.id == null) {
            return;
        }


        const confirmed =
            window.confirm(
                `Sei sicuro di voler eliminare il mazzo "${deck.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deckService.remove(
                deck.id
            );


            navigate(isOwner ? '/profile' : '/');

        } catch (requestError) {

            window.alert(
                getErrorMessage(
                    requestError
                )
            );

        }

    };


    /* =========================================
       RENDER
       ========================================= */

    return (

        <div className="creazione-container">


            {/* =================================
                PULSANTI SUPERIORI
                ================================= */}

            <div className="azioni-header deck-actions-header">


                <button
                    className="btn-indietro"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    <BackIcon />

                    Torna indietro

                </button>


                <div className="deck-actions-group">


                    {/* ELIMINAZIONE: proprietario oppure amministratore */}

                    {(isOwner || isAdmin) && (
                        <button
                            className="btn-delete-deck"
                            onClick={handleDelete}
                        >

                            <DeleteIcon />

                            Elimina Mazzo

                        </button>
                    )}


                    {/* MODIFICA: soltanto il proprietario */}

                    {isOwner && (
                        <button
                            className="btn-indietro"
                            onClick={() =>
                                navigate(
                                    `/deck/${deck.id}/edit`
                                )
                            }
                        >

                            <EditIcon />

                            Modifica

                        </button>
                    )}


                    {/* RIPASSO */}

                    {isLoggedIn && (

                        <button
                            className="btn-salva"
                            onClick={() =>
                                navigate(
                                    `/deck/${deck.id}/review`
                                )
                            }
                        >

                            <PlayIcon />

                            Avvia Ripasso

                        </button>

                    )}

                </div>

            </div>



            {/* =================================
                INFORMAZIONI MAZZO
                ================================= */}

            <div className="info-mazzo-bubble deck-info-bubble">


                {/* PARTE SINISTRA */}

                <div className="deck-info-text">


                    {/* AUTORE */}

                    <div className="deck-author">

                        👤 Creato da:&nbsp;

                        {deck.authorUsername ?? 'Anonimo'}

                    </div>


                    {/* TITOLO */}

                    <h1>
                        {deck.name}
                    </h1>


                    {/* CATEGORIA */}

                    <span className="deck-category">

                        <span className="deck-category-icon">
                            <CategoryIcon />
                        </span>

                        {deck.category || 'Generale'}

                    </span>


                    {/* NUMERO CARTE */}

                    <p>
                        Questo mazzo contiene{' '}
                        {deck.flashcards.length}{' '}
                        {
                            deck.flashcards.length === 1
                                ? 'carta'
                                : 'carte'
                        }.
                    </p>


                    {/* DATA */}

                    {deck.createdAt && (

                        <p className="deck-created-at">

                            Creato il{' '}

                            {
                                new Date(
                                    deck.createdAt
                                )
                                    .toLocaleDateString(
                                        'it-IT'
                                    )
                            }

                        </p>

                    )}

                </div>



                {/* =================================
                    LIKE E SALVATAGGIO
                    ================================= */}

                <div className="deck-social-actions">


                    {/* LIKE */}

                    <div className="deck-social-item">

                        <button
                            onClick={handleLike}
                            className="icon-action-button"
                            title={
                                deck.liked
                                    ? 'Rimuovi mi piace'
                                    : 'Metti mi piace'
                            }
                        >

                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"

                                fill={
                                    deck.liked
                                        ? '#ff4d4f'
                                        : 'none'
                                }

                                stroke={
                                    deck.liked
                                        ? '#ff4d4f'
                                        : '#5f82d8'
                                }

                                strokeWidth="2"

                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >

                                <path
                                    d="
                                        M20.84 4.61
                                        a5.5 5.5 0 0 0-7.78 0
                                        L12 5.67
                                        l-1.06-1.06
                                        a5.5 5.5 0 0 0-7.78 7.78
                                        l1.06 1.06
                                        L12 21.23
                                        l7.78-7.78
                                        1.06-1.06
                                        a5.5 5.5 0 0 0 0-7.78
                                        z
                                    "
                                />

                            </svg>

                        </button>


                        <div className="social-count">
                            {deck.likes}
                        </div>

                    </div>



                    {/* SALVATAGGIO
                        Non viene mostrato
                        al proprietario del mazzo.
                    */}

                    {!isOwner && (

                        <div className="deck-social-item">

                            <button
                                onClick={handleBookmark}
                                className="icon-action-button"
                                title={
                                    deck.bookmarked
                                        ? 'Rimuovi dai salvati'
                                        : 'Salva mazzo'
                                }
                            >

                                <svg
                                    width="35"
                                    height="40"

                                    viewBox="0 0 24 24"

                                    fill={
                                        deck.bookmarked
                                            ? '#ff4d4f'
                                            : 'none'
                                    }

                                    stroke={
                                        deck.bookmarked
                                            ? '#ff4d4f'
                                            : '#5f82d8'
                                    }

                                    strokeWidth="2"

                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >

                                    <path
                                        d="
                                            M19 21
                                            l-7-5
                                            -7 5
                                            V5
                                            a2 2 0 0 1 2-2
                                            h10
                                            a2 2 0 0 1 2 2
                                            z
                                        "
                                    />

                                </svg>

                            </button>


                            <div
                                className={
                                    `bookmark-label ${
                                        deck.bookmarked
                                            ? 'active'
                                            : ''
                                    }`
                                }
                            >

                                {
                                    deck.bookmarked
                                        ? 'Salvato'
                                        : 'Salva'
                                }

                            </div>

                        </div>

                    )}

                </div>

            </div>



            {/* =================================
                FLASHCARD
                ================================= */}

            <div className="lista-carte">


                {/* MAZZO VUOTO */}

                {deck.flashcards.length === 0 && (

                    <div className="page-message">

                        Questo mazzo non contiene
                        ancora flashcard.

                    </div>

                )}



                {/* ELENCO FLASHCARD */}

                {deck.flashcards.map(
                    (card, index) => (

                        <div
                            key={
                                card.id ??
                                index
                            }
                            className="carta-block"
                        >


                            {/* HEADER */}

                            <div className="carta-header">

                                Carta {index + 1}

                            </div>



                            {/* CORPO */}

                            <div className="carta-corpo">


                                {/* FRONTE */}

                                <div className="carta-lato">

                                    <label>
                                        Fronte
                                    </label>


                                    <div className="readonly-card-side">

                                        <span>
                                            {card.frontText}
                                        </span>


                                        {card.frontDescription && (

                                            <small>
                                                {
                                                    card.frontDescription
                                                }
                                            </small>

                                        )}

                                    </div>

                                </div>



                                {/* RETRO */}

                                <div className="carta-lato">

                                    <label>
                                        Retro
                                    </label>


                                    <div className="readonly-card-side">

                                        <span>
                                            {card.backText}
                                        </span>


                                        {card.backDescription && (

                                            <small>
                                                {
                                                    card.backDescription
                                                }
                                            </small>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}