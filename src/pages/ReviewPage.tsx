import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { Deck } from '../types';

import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';

import './RipassoMazzo.css';


function ArrowLeftIcon() {
  return (
      <svg
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


function ArrowRightIcon() {
  return (
      <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
  );
}


function CloseIcon() {
  return (
      <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
  );
}


function FlipIcon() {
  return (
      <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M20 7h-7a4 4 0 0 0-4 4v1" />
        <path d="m17 4 3 3-3 3" />

        <path d="M4 17h7a4 4 0 0 0 4-4v-1" />
        <path d="m7 20-3-3 3-3" />
      </svg>
  );
}


export default function ReviewPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [deck, setDeck] =
      useState<Deck | null>(null);

  const [currentIndex, setCurrentIndex] =
      useState(0);

  const [flipped, setFlipped] =
      useState(false);

  const [error, setError] =
      useState('');


  const deckId = Number(id);


  useEffect(() => {

    if (!Number.isFinite(deckId)) {
      setError('Mazzo non valido.');
      return;
    }


    deckService
        .get(deckId)
        .then(setDeck)
        .catch((requestError) =>
            setError(
                getErrorMessage(requestError)
            )
        );

  }, [deckId]);


  /* =========================================
     ERRORE
     ========================================= */

  if (error) {

    return (
        <div className="ripasso-container">

          <div className="review-message-card">

            <h2>
              {error}
            </h2>

            <button
                className="review-primary-button"
                onClick={() => navigate(-1)}
            >
              Torna indietro
            </button>

          </div>

        </div>
    );

  }


  /* =========================================
     CARICAMENTO
     ========================================= */

  if (!deck) {

    return (
        <div className="ripasso-container">

          <div className="review-loading">
            Caricamento mazzo...
          </div>

        </div>
    );

  }


  /* =========================================
     MAZZO VUOTO
     ========================================= */

  if (deck.flashcards.length === 0) {

    return (
        <div className="ripasso-container">

          <div className="review-message-card">

            <h2>
              Questo mazzo non contiene
              ancora flashcard.
            </h2>

            <button
                className="review-primary-button"
                onClick={() =>
                    navigate(`/deck/${deck.id}`)
                }
            >
              Torna al mazzo
            </button>

          </div>

        </div>
    );

  }


  const card =
      deck.flashcards[currentIndex];


  const totalCards =
      deck.flashcards.length;


  const progress =
      ((currentIndex + 1) / totalCards) * 100;


  /* =========================================
     NAVIGAZIONE
     ========================================= */

  const previous = (
      event: MouseEvent
  ) => {

    event.stopPropagation();


    if (currentIndex === 0) {
      return;
    }


    setFlipped(false);

    setCurrentIndex(
        (index) => index - 1
    );

  };


  const next = (
      event: MouseEvent
  ) => {

    event.stopPropagation();


    if (
        currentIndex >=
        totalCards - 1
    ) {
      return;
    }


    setFlipped(false);

    setCurrentIndex(
        (index) => index + 1
    );

  };


  return (

      <div className="ripasso-container">


        {/* =================================
                TOP BAR
                ================================= */}

        <header className="review-header">

          <div className="review-header-info">

                    <span className="review-eyebrow">
                        RIPASSO
                    </span>

            <h1>
              {deck.name}
            </h1>

          </div>


          <button
              className="review-close-button"
              onClick={() =>
                  navigate(`/deck/${deck.id}`)
              }
              title="Concludi ripasso"
          >

            <CloseIcon />

            <span>
                        Concludi
                    </span>

          </button>

        </header>



        {/* =================================
                PROGRESSO
                ================================= */}

        <section className="review-progress-section">

          <div className="review-progress-text">

                    <span>
                        Carta {currentIndex + 1}
                    </span>

            <span>
                        {currentIndex + 1} / {totalCards}
                    </span>

          </div>


          <div className="review-progress-track">

            <div
                className="review-progress-value"
                style={{
                  width: `${progress}%`
                }}
            />

          </div>

        </section>



        {/* =================================
                AREA RIPASSO
                ================================= */}

        <main className="ripasso-main">


          {/* PRECEDENTE */}

          <button
              className="nav-arrow"
              onClick={previous}
              disabled={currentIndex === 0}
              title="Carta precedente"
              aria-label="Carta precedente"
          >

            <ArrowLeftIcon />

          </button>



          {/* FLASHCARD */}

          <div className="review-card-area">


            <div
                className="flashcard-wrapper"
                onClick={() =>
                    setFlipped(
                        (value) => !value
                    )
                }
            >

              <div
                  className={
                    `flashcard-inner ${
                        flipped
                            ? 'is-flipped'
                            : ''
                    }`
                  }
              >


                {/* FRONTE */}

                <div className="flashcard-front">

                  <div className="review-card-accent" />

                  <span className="review-side-label">
                                    FRONTE
                                </span>


                  <div className="review-side-content">

                                    <span className="review-main-text">
                                        {card.frontText}
                                    </span>


                    {card.frontDescription && (

                        <small>
                          {card.frontDescription}
                        </small>

                    )}

                  </div>

                </div>



                {/* RETRO */}

                <div className="flashcard-back">

                  <div className="review-card-accent" />

                  <span className="review-side-label">
                                    RETRO
                                </span>


                  <div className="review-side-content">

                                    <span className="review-main-text">
                                        {card.backText}
                                    </span>


                    {card.backDescription && (

                        <small>
                          {card.backDescription}
                        </small>

                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* SUGGERIMENTO */}

            <button
                type="button"
                className="review-flip-hint"
                onClick={() =>
                    setFlipped(
                        (value) => !value
                    )
                }
            >

                        <span className="review-flip-icon">
                            <FlipIcon />
                        </span>

              {
                flipped
                    ? 'Torna al fronte'
                    : 'Clicca sulla carta per girarla'
              }

            </button>

          </div>



          {/* SUCCESSIVA */}

          <button
              className="nav-arrow"
              onClick={next}
              disabled={
                  currentIndex ===
                  totalCards - 1
              }
              title="Carta successiva"
              aria-label="Carta successiva"
          >

            <ArrowRightIcon />

          </button>

        </main>



        {/* =================================
                NAVIGAZIONE INFERIORE
                ================================= */}

        <footer className="review-bottom">

          <button
              className="review-mobile-navigation"
              onClick={previous}
              disabled={currentIndex === 0}
          >
            <ArrowLeftIcon />
            Precedente
          </button>


          <span className="review-bottom-counter">
                    {currentIndex + 1} di {totalCards}
                </span>


          <button
              className="review-mobile-navigation"
              onClick={next}
              disabled={
                  currentIndex ===
                  totalCards - 1
              }
          >
            Successiva
            <ArrowRightIcon />
          </button>

        </footer>

      </div>
  );
}