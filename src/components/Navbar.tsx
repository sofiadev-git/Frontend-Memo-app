import React, { useState } from 'react';
import './Navbar.css';
import SettingsModal from './Settings';

interface NavbarProps {
    currentPage: 'home' | 'profilo' | 'seguiti' | 'ricerca'; // <-- AGGIUNTO 'ricerca'
    onNavigate: (page: 'home' | 'profilo' | 'seguiti' | 'ricerca') => void; // <-- AGGIUNTO 'ricerca'
    isLoggedIn: boolean;
    username: string;
    onLogin: () => void;
    onLogout: () => void;
    numeroMazzi: number;
    descrizione: string;
    onSalvaDescrizione: (desc: string) => void;
    searchQuery: string; // <-- RICEVE IL TESTO CERCATO
    onSearchChange: (query: string) => void; // <-- FUNZIONE PER AGGIORNARE IL TESTO
}

const Navbar: React.FC<NavbarProps> = ({
                                           currentPage,
                                           onNavigate,
                                           isLoggedIn,
                                           username,
                                           onLogin,
                                           onLogout,
                                           numeroMazzi,
                                           descrizione,
                                           onSalvaDescrizione,
                                           searchQuery,
                                           onSearchChange
                                       }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-top">
                    <div className="navbar-logo">
                        <h2>Memo</h2>
                    </div>

                    <div className="navbar-actions">
                        {isLoggedIn ? (
                            <>
                                <span className="navbar-username">{username}</span>
                                <button
                                    className="btn-settings-icon"
                                    title="Impostazioni"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    ⚙️
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline" onClick={onLogin}>Log In</button>
                                <button className="btn btn-filled">Sign Up</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="navbar-middle">
                    <div className="navbar-search">

                        {/* --- IL CAMPO INPUT COLLEGATO ALLA RICERCA --- */}
                        <input
                            type="text"
                            placeholder="Cerca mazzi..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />

                        {/* --- FUNZIONE DISEGNO LENTE --- */}
                        <svg
                            className="search-icon-svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                <div className="navbar-bottom">
                    <button
                        className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        Home
                    </button>
                    {isLoggedIn && (
                        <>
                            <button
                                className={`nav-link ${currentPage === 'profilo' ? 'active' : ''}`}
                                onClick={() => onNavigate('profilo')}
                            >
                                Profilo
                            </button>
                            <button
                                className={`nav-link ${currentPage === 'seguiti' ? 'active' : ''}`}
                                onClick={() => onNavigate('seguiti')}
                            >
                                Seguiti
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {isModalOpen && (
                <SettingsModal
                    username={username}
                    numeroMazzi={numeroMazzi}
                    descrizione={descrizione}
                    onSalvaDescrizione={onSalvaDescrizione}
                    onClose={() => setIsModalOpen(false)}
                    onLogout={() => {
                        onLogout();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default Navbar;