import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Settings from './Settings';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { isLoggedIn, username } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');

    useEffect(() => {
        if (location.pathname === '/search') {
            setSearchQuery(searchParams.get('q') ?? '');
        }
    }, [location.pathname, searchParams]);

    const handleSearch = (event: FormEvent) => {
        event.preventDefault();
        const query = searchQuery.trim();

        if (!query) {
            navigate('/');
            return;
        }

        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const homeActive = location.pathname === '/';
    const profileActive = location.pathname === '/profile';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-top">
                    <div className="navbar-logo" onClick={() => navigate('/')}>
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
                                <button className="btn btn-outline" onClick={() => navigate('/login')}>
                                    Log In
                                </button>
                                <button className="btn btn-filled" onClick={() => navigate('/register')}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="navbar-middle">
                    <form className="navbar-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Cerca mazzi per nome o categoria..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <button className="search-submit" type="submit" title="Cerca">
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
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="navbar-bottom">
                    <button
                        className={`nav-link ${homeActive ? 'active' : ''}`}
                        onClick={() => navigate('/')}
                    >
                        Home
                    </button>

                    {isLoggedIn && (
                        <button
                            className={`nav-link ${profileActive ? 'active' : ''}`}
                            onClick={() => navigate('/profile')}
                        >
                            Profilo
                        </button>
                    )}
                </div>
            </nav>

            {isModalOpen && <Settings onClose={() => setIsModalOpen(false)} />}
        </>
    );
}
