import React from 'react';
import './Home.css';

interface HomeProps {
    mazzi: any[];
    onApriMazzo: (mazzo: any) => void;
    onToggleLike: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ mazzi, onApriMazzo, onToggleLike }) => {
    // 1. Ordiniamo per Like (dal più alto al più basso) e prendiamo i primi 5
    const topMazzi = [...mazzi]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 4);

    // 2. Ordiniamo per ID (dal più grande/recente al più piccolo/vecchio) e prendiamo i primi 10
    const mazziRecenti = [...mazzi]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);

    // Funzione di supporto per renderizzare le card (per non ripetere il codice due volte)
    const renderCard = (mazzo: any) => (
        <div key={mazzo.id} className="home-mazzo-card" onClick={() => onApriMazzo(mazzo)}>
            <div>
                <h3>{mazzo.nome}</h3>
                <p>{mazzo.carte ? mazzo.carte.length : 0} carte</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>{mazzo.filtro || 'Generale'}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleLike(mazzo.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'transform 0.2s' }}
                    title={mazzo.isLiked ? 'Rimuovi mi piace' : 'Metti mi piace'}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={mazzo.isLiked ? "#ff4d4f" : "none"} stroke={mazzo.isLiked ? "#ff4d4f" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span style={{ fontSize: '1.1rem', color: '#555', fontWeight: 'bold' }}>{mazzo.likes || 0}</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="home-container">
            {/* SEZIONE 1: TOP 5 */}
            <div className="home-section">
                <h2 className="home-section-title">🔥 Top 5 Mazzi Più Apprezzati</h2>
                <div className="home-mazzi-grid">
                    {topMazzi.length > 0 ? topMazzi.map(renderCard) : <p>Nessun mazzo disponibile.</p>}
                </div>
            </div>

            {/* SEZIONE 2: PIÙ RECENTI */}
            <div className="home-section">
                <h2 className="home-section-title">🆕 Ultimi 10 Mazzi Creati</h2>
                <div className="home-mazzi-grid">
                    {mazziRecenti.length > 0 ? mazziRecenti.map(renderCard) : <p>Nessun mazzo disponibile.</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;