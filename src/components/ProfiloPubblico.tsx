import React from 'react';
import './ProfiloPubblico.css';

interface ProfiloPubblicoProps {
    autore: string;
    currentUsername: string;
    descrizioneUtente: string; // <--- AGGIUNTO: Riceviamo la tua vera bio
    mazziAutore: any[];
    isFollowing: boolean;
    onToggleFollow: (autore: string) => void;
    onIndietro: () => void;
    onApriMazzo: (mazzo: any) => void;
    onToggleLike: (id: number) => void;
}

const ProfiloPubblico: React.FC<ProfiloPubblicoProps> = ({
                                                             autore, currentUsername, descrizioneUtente, mazziAutore, isFollowing, onToggleFollow, onIndietro, onApriMazzo, onToggleLike
                                                         }) => {
    const initial = autore ? autore.charAt(0).toUpperCase() : '?';
    const isMyProfile = autore === currentUsername;

    // LOGICA BIO: Se sono io mostro la VERA descrizione, altrimenti una inventata.
    const bioDaMostrare = isMyProfile
        ? descrizioneUtente
        : (autore === 'Marco99'
            ? "Appassionato di Storia Antica e archeologia. Condivido i miei mazzi per aiutare chi studia per gli esami universitari!"
            : "Studente appassionato. Creo mazzi per imparare più velocemente e memorizzare a lungo termine.");

    return (
        <div className="profilo-pubblico-overlay">
            <div className="profilo-pubblico-container">

                <div className="profilo-pubblico-header">
                    <button className="btn-chiudi-pubblico" onClick={onIndietro}>
                        ← Torna indietro
                    </button>
                </div>

                <div className="profilo-pubblico-info">
                    <div className="avatar-grande">
                        <span>{initial}</span>
                    </div>
                    <h1 className="nome-autore">{autore}</h1>

                    {/* --- QUI MOSTRIAMO LA BIO DINAMICA --- */}
                    <p className="bio-autore">{bioDaMostrare}</p>

                    {isMyProfile ? (
                        <div style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#f4f4f9',
                            color: '#888',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            border: '1px solid #ddd',
                            display: 'inline-block'
                        }}>
                            👤 Il tuo profilo
                        </div>
                    ) : (
                        <button
                            className="btn-segui"
                            onClick={() => onToggleFollow(autore)}
                            style={{
                                backgroundColor: isFollowing ? '#f0f0f0' : '#9A83F0',
                                color: isFollowing ? '#555' : 'white',
                                border: isFollowing ? '1px solid #ccc' : 'none',
                            }}
                        >
                            {isFollowing ? '✓ Non seguire' : '+ Segui Utente'}
                        </button>
                    )}
                </div>

                <hr className="divisore" />

                <div className="profilo-pubblico-mazzi">
                    <h2>I mazzi di {autore} ({mazziAutore.length})</h2>
                    <div className="mazzi-grid-pubblico">
                        {mazziAutore.length > 0 ? (
                            mazziAutore.map((mazzo) => (
                                <div key={mazzo.id} className="mazzo-card-pubblico" onClick={() => onApriMazzo(mazzo)}>
                                    <div>
                                        <h3>{mazzo.nome}</h3>
                                        <p>{mazzo.carte ? mazzo.carte.length : 0} carte</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                        <span className="badge-filtro">{mazzo.filtro || 'Generale'}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleLike(mazzo.id); }}
                                            className="btn-like-pubblico"
                                            title={mazzo.isLiked ? 'Rimuovi mi piace' : 'Metti mi piace'}
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill={mazzo.isLiked ? "#ff4d4f" : "none"} stroke={mazzo.isLiked ? "#ff4d4f" : "#aaa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                            <span>{mazzo.likes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#888' }}>Questo utente non ha ancora pubblicato mazzi.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfiloPubblico;