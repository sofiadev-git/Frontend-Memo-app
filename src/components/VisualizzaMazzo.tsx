import React from 'react';
import './CreazioneMazzo.css';

interface Carta {
    id: number;
    fronte: string;
    retro: string;
    pronunciaFronte?: string;
    pronunciaRetro?: string;
}

interface VisualizzaMazzoProps {
    mazzo: { id: number; nome: string; filtro: string; autore?: string; carte: Carta[]; likes?: number; isLiked?: boolean } | null;
    currentUsername: string;
    isSaved: boolean;
    onNavigate: (page: string) => void;
    onModifica: () => void;
    onElimina: (id: number) => void;
    onToggleLike: (id: number) => void;
    onToggleSave: (id: number) => void;
    onAvviaRipasso: () => void;
    onApriProfiloAutore: (autore: string) => void;
}

const VisualizzaMazzo: React.FC<VisualizzaMazzoProps> = ({
                                                             mazzo,
                                                             currentUsername,
                                                             isSaved,
                                                             onNavigate,
                                                             onModifica,
                                                             onElimina,
                                                             onToggleLike,
                                                             onToggleSave,
                                                             onAvviaRipasso,
                                                             onApriProfiloAutore
                                                         }) => {
    if (!mazzo) return <div>Mazzo non trovato</div>;

    const handleElimina = () => {
        const confermato = window.confirm(`Sei sicuro di voler eliminare il mazzo "${mazzo.nome}"?`);
        if (confermato) {
            onElimina(mazzo.id);
        }
    };

    // LOGICA: Controlliamo se l'utente che sta guardando è il vero autore
    const isAutore = mazzo.autore === currentUsername;

    return (
        <div className="creazione-container">
            <div className="azioni-header" style={{ justifyContent: 'space-between' }}>
                <button className="btn-indietro" onClick={() => onNavigate('home')}>
                    ← Torna indietro
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isAutore && (
                        <>
                            <button className="btn-indietro" style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }} onClick={handleElimina}>
                                🗑️ Elimina Mazzo
                            </button>
                            <button className="btn-indietro" onClick={onModifica}>
                                ✏️ Modifica
                            </button>
                        </>
                    )}
                    <button className="btn-salva" onClick={onAvviaRipasso}>
                        ▶️ Avvia Ripasso
                    </button>
                </div>
            </div>

            <div className="info-mazzo-bubble" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>

                    <div
                        onClick={() => onApriProfiloAutore(mazzo.autore || 'Anonimo')}
                        style={{
                            color: '#9A83F0',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            padding: '0.4rem 1rem',
                            backgroundColor: 'rgba(154, 131, 240, 0.1)',
                            borderRadius: '20px',
                            display: 'inline-block',
                            marginBottom: '0.5rem'
                        }}
                    >
                        👤 Creato da: {mazzo.autore || 'Anonimo'}
                    </div>

                    <h1 style={{ margin: 0, color: '#333' }}>{mazzo.nome}</h1>
                    <span style={{ color: '#888', fontWeight: 'bold' }}>Categoria: {mazzo.filtro}</span>
                    <p style={{ margin: 0 }}>Questo mazzo contiene {mazzo.carte.length} carte.</p>
                </div>

                <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', alignItems: 'center' }}>

                    {/* TASTO LIKE */}
                    <div>
                        <button
                            onClick={() => onToggleLike(mazzo.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                            title={mazzo.isLiked ? 'Rimuovi mi piace' : 'Metti mi piace'}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill={mazzo.isLiked ? "#ff4d4f" : "none"} stroke={mazzo.isLiked ? "#ff4d4f" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#555', marginTop: '0.2rem' }}>
                            {mazzo.likes || 0}
                        </div>
                    </div>

                    {/* MOSTRA IL SEGNALIBRO SOLO SE NON SEI L'AUTORE DEL MAZZO */}
                    {!isAutore && (
                        <div>
                            <button
                                onClick={() => onToggleSave(mazzo.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                                title={isSaved ? 'Rimuovi dai salvati' : 'Salva mazzo'}
                            >
                                <svg width="35" height="40" viewBox="0 0 24 24" fill={isSaved ? "#ff4d4f" : "none"} stroke={isSaved ? "#ff4d4f" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isSaved ? '#ff4d4f' : '#888', marginTop: '0.2rem' }}>
                                Salva
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="lista-carte">
                {mazzo.carte.map((carta, index) => (
                    <div key={carta.id} className="carta-block">
                        <div className="carta-header">Carta {index + 1}</div>
                        <div className="carta-corpo">
                            <div className="carta-lato">
                                <label>Fronte</label>
                                <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '12px', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.1rem' }}>{carta.fronte}</span>
                                    {carta.pronunciaFronte && (
                                        <span style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.4rem' }}>{carta.pronunciaFronte}</span>
                                    )}
                                </div>
                            </div>
                            <div className="carta-lato">
                                <label>Retro</label>
                                <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '12px', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.1rem' }}>{carta.retro}</span>
                                    {carta.pronunciaRetro && (
                                        <span style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.4rem' }}>{carta.pronunciaRetro}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualizzaMazzo;