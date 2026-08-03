import React, { useState } from 'react';

interface ProfiloProps {
    onNavigate: (page: string) => void;
    mazziCreati: any[];   // <--- I mazzi fatti da te
    mazziSalvati: any[];  // <--- I mazzi di altri che hai salvato
    onApriMazzo: (mazzo: any) => void;
    onToggleLike: (id: number) => void;
}

const Profilo: React.FC<ProfiloProps> = ({ onNavigate, mazziCreati, mazziSalvati, onApriMazzo, onToggleLike }) => {
    // Stato per sapere quale scheda stiamo guardando
    const [tabCorrente, setTabCorrente] = useState<'creati' | 'salvati'>('creati');

    // Scegliamo quale array mostrare in base alla scheda attiva
    const mazziDaMostrare = tabCorrente === 'creati' ? mazziCreati : mazziSalvati;

    return (
        <div style={{ padding: '2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* TASTI DI SELEZIONE SCHEDA */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button
                    onClick={() => setTabCorrente('creati')}
                    style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '20px',
                        border: '2px solid #9A83F0',
                        backgroundColor: tabCorrente === 'creati' ? '#9A83F0' : 'transparent',
                        color: tabCorrente === 'creati' ? 'white' : '#9A83F0',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    I Tuoi Mazzi
                </button>
                <button
                    onClick={() => setTabCorrente('salvati')}
                    style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '20px',
                        border: '2px solid #ff4d4f', // Rosso per richiamare il segnalibro
                        backgroundColor: tabCorrente === 'salvati' ? '#ff4d4f' : 'transparent',
                        color: tabCorrente === 'salvati' ? 'white' : '#ff4d4f',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    🔖 Salvati ({mazziSalvati.length})
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>

                {/* Il bottone per CREARE lo mostriamo SOLO nella tab "creati" */}
                {tabCorrente === 'creati' && (
                    <div
                        onClick={() => onNavigate('creazione-mazzo')}
                        style={{
                            height: '180px', borderRadius: '16px', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(154, 131, 240, 0.1)',
                            border: '2px dashed #9A83F0', cursor: 'pointer', color: '#9A83F0'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>+</div>
                        <h3 style={{ margin: 0 }}>Crea nuovo mazzo</h3>
                    </div>
                )}

                {/* LISTA DEI MAZZI (che siano creati o salvati) */}
                {mazziDaMostrare.map((mazzo) => (
                    <div
                        key={mazzo.id}
                        onClick={() => onApriMazzo(mazzo)}
                        style={{
                            height: '180px', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column',
                            justifyContent: 'space-between', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', cursor: 'pointer', boxSizing: 'border-box'
                        }}
                    >
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2a2a2a' }}>{mazzo.nome}</h3>
                            <p style={{ margin: 0, color: '#666' }}>{mazzo.carte ? mazzo.carte.length : 0} carte</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>{mazzo.filtro || 'Generale'}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleLike(mazzo.id); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill={mazzo.isLiked ? "#ff4d4f" : "none"} stroke={mazzo.isLiked ? "#ff4d4f" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span style={{ color: '#555', fontWeight: 'bold' }}>{mazzo.likes || 0}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {tabCorrente === 'salvati' && mazziDaMostrare.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#888', fontStyle: 'italic' }}>
                    Non hai ancora salvato nessun mazzo.
                </div>
            )}
        </div>
    );
};

export default Profilo;