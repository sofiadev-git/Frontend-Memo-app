import React, { useState } from 'react';
import './RipassoMazzo.css';

interface Carta {
    id: number;
    fronte: string;
    retro: string;
    pronunciaFronte?: string;
    pronunciaRetro?: string;
}

interface RipassoMazzoProps {
    mazzo: { nome: string; carte: Carta[] } | null;
    onConcludi: () => void;
}

const RipassoMazzo: React.FC<RipassoMazzoProps> = ({ mazzo, onConcludi }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!mazzo || !mazzo.carte || mazzo.carte.length === 0) {
        return (
            <div className="ripasso-container">
                <h2>Ops! Questo mazzo non ha ancora carte da ripassare.</h2>
                <button className="btn-concludi" onClick={onConcludi}>Torna indietro</button>
            </div>
        );
    }

    const carte = mazzo.carte;
    const cartaCorrente = carte[currentIndex];

    const vaiAvanti = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < carte.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex + 1), 150);
        }
    };

    const vaiIndietro = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex - 1), 150);
        }
    };

    const giraCarta = () => setIsFlipped(!isFlipped);

    return (
        <div className="ripasso-container">
            <h2 style={{ color: '#555', marginBottom: '2rem' }}>
                Ripasso: {mazzo.nome} ({currentIndex + 1} / {carte.length})
            </h2>

            <div className="ripasso-main">
                <button className="nav-arrow" onClick={vaiIndietro} disabled={currentIndex === 0}>
                    &lt;
                </button>

                <div className="flashcard-wrapper" onClick={giraCarta}>
                    <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>

                        {/* FACCIA FRONTALE */}
                        <div className="flashcard-front">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span>{cartaCorrente.fronte}</span>
                                {cartaCorrente.pronunciaFronte && (
                                    <span style={{ fontSize: '1rem', color: '#999', marginTop: '1rem', fontWeight: 'normal' }}>
                                        {cartaCorrente.pronunciaFronte}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* FACCIA POSTERIORE */}
                        <div className="flashcard-back">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span>{cartaCorrente.retro}</span>
                                {cartaCorrente.pronunciaRetro && (
                                    <span style={{ fontSize: '1rem', color: '#9A83F0', opacity: 0.7, marginTop: '1rem', fontWeight: 'normal' }}>
                                        {cartaCorrente.pronunciaRetro}
                                    </span>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <button className="nav-arrow" onClick={vaiAvanti} disabled={currentIndex === carte.length - 1}>
                    &gt;
                </button>
            </div>

            <button className="btn-concludi" onClick={onConcludi}>
                Concludi Ripasso
            </button>
        </div>
    );
};

export default RipassoMazzo;