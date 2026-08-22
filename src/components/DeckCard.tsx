import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Deck } from '../types';
import { useAuth } from '../auth/AuthContext';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';

import './DeckCard.css';


interface DeckCardProps {
    deck: Deck;
    onChange?: (deck: Deck) => void;
    showLike?: boolean;
}


function CardsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="7"
                y="7"
                width="10"
                height="12"
                rx="2"
            />

            <path
                d="
                    M5 15
                    H4
                    a2 2 0 0 1-2-2
                    V6
                    a2 2 0 0 1 2-2
                    h7
                    a2 2 0 0 1 2 2
                    v1
                "
            />
        </svg>
    );
}


function HeartIcon({
                       filled = false
                   }: {
    filled?: boolean;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
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
    );
}


export default function DeckCard({
                                     deck,
                                     onChange,
                                     showLike = true,
                                 }: DeckCardProps) {

    const navigate = useNavigate();

    const { isLoggedIn } = useAuth();


    const openDeck = () => {
        if (deck.id != null) {
            navigate(`/deck/${deck.id}`);
        }
    };


    const toggleLike = async (
        event: MouseEvent<HTMLButtonElement>
    ) => {

        event.stopPropagation();

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (deck.id == null) {
            return;
        }

        try {

            const updated =
                await deckService.toggleLike(deck.id);

            onChange?.(updated);

        } catch (error) {

            window.alert(
                getErrorMessage(error)
            );

        }
    };


    return (
        <div
            className="home-mazzo-card"
            onClick={openDeck}
        >

            <div className="home-mazzo-card-top">

                <h3 className="home-mazzo-card-title">
                    {deck.name}
                </h3>


                <div className="home-mazzo-card-meta">

                    <div className="home-mazzo-card-info">

                        <span className="mini-icon">
                            <CardsIcon />
                        </span>

                        <span>
                            {deck.flashcards?.length ?? 0}
                            {' '}
                            carte
                        </span>

                    </div>


                </div>

            </div>


            <div className="home-mazzo-card-divider" />


            <div className="home-mazzo-card-bottom">

                <p className="home-mazzo-card-category">
                    {deck.category || 'Generale'}
                </p>


                {showLike && (

                    <button
                        className={
                            `home-mazzo-card-likes ${
                                deck.liked
                                    ? 'filled'
                                    : ''
                            }`
                        }
                        onClick={toggleLike}
                        title={
                            deck.liked
                                ? 'Rimuovi mi piace'
                                : 'Metti mi piace'
                        }
                    >

                        <span className="mini-icon heart-icon">
                            <HeartIcon
                                filled={deck.liked}
                            />
                        </span>

                        <span>
                            {deck.likes}
                        </span>

                    </button>

                )}

            </div>

        </div>
    );
}