import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
    useLocation,
    useNavigate,
    useSearchParams
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';
import Settings from './Settings';

import './Navbar.css';


function HomeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10.5V20h14v-9.5" />
            <path d="M9 20v-6h6v6" />
        </svg>
    );
}


function CatalogIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3 8 4-8 4-8-4 8-4Z" />
            <path d="m4 12 8 4 8-4" />
            <path d="m4 17 8 4 8-4" />
        </svg>
    );
}


function UserIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}


function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}


function SettingsIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />

            <path
                d="
                    M19.4 15
                    a1.7 1.7 0 0 0 .3 1.9
                    l-1.8 1.8
                    a1.7 1.7 0 0 0-1.9-.3
                    1.7 1.7 0 0 0-1 .6
                    1.7 1.7 0 0 0-.4 1.1
                    V21
                    h-3.2
                    v-.9
                    a1.7 1.7 0 0 0-.4-1.1
                    1.7 1.7 0 0 0-1-.6
                    1.7 1.7 0 0 0-1.9.3
                    l-1.8-1.8
                    a1.7 1.7 0 0 0 .3-1.9
                    1.7 1.7 0 0 0-.6-1
                    1.7 1.7 0 0 0-1.1-.4
                    H3
                    v-3.2
                    h.9
                    A1.7 1.7 0 0 0 5 10
                    a1.7 1.7 0 0 0 .6-1
                    1.7 1.7 0 0 0-.3-1.9
                    l1.8-1.8
                    A1.7 1.7 0 0 0 9 5.6
                    a1.7 1.7 0 0 0 1-.6
                    1.7 1.7 0 0 0 .4-1.1
                    V3
                    h3.2
                    v.9
                    A1.7 1.7 0 0 0 15 5
                    a1.7 1.7 0 0 0 1 .6
                    1.7 1.7 0 0 0 1.9-.3
                    l1.8 1.8
                    a1.7 1.7 0 0 0-.3 1.9
                    1.7 1.7 0 0 0 .6 1
                    1.7 1.7 0 0 0 1.1.4
                    H21
                    v3.2
                    h-.9
                    A1.7 1.7 0 0 0 19 14
                    a1.7 1.7 0 0 0 .4 1Z
                "
            />
        </svg>
    );
}


export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const {
        isLoggedIn,
        username
    } = useAuth();

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState(
            searchParams.get('q') ?? ''
        );


    useEffect(() => {
        if (location.pathname === '/search') {
            setSearchQuery(
                searchParams.get('q') ?? ''
            );
        }
    }, [
        location.pathname,
        searchParams
    ]);


    const handleSearch = (
        event: FormEvent
    ) => {
        event.preventDefault();

        const query =
            searchQuery.trim();

        if (!query) {
            navigate('/');
            return;
        }

        navigate(
            `/search?q=${encodeURIComponent(query)}`
        );
    };


    const openRegistration = () => {
        window.location.href =
            'http://localhost:8080/register';
    };


    const openCatalog = () => {
        window.location.href =
            'http://localhost:8080/catalogo';
    };


    const homeActive =
        location.pathname === '/';

    const profileActive =
        location.pathname === '/profile';


    return (
        <>
            <header className="navbar-wrapper">

                <nav className="navbar">

                    {/* LOGO */}
                    <div
                        className="navbar-logo"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="/favicon.ico"
                            alt="Logo Memo"
                            className="navbar-logo-image"
                        />

                        <span className="navbar-logo-name">
                            Memo
                        </span>
                    </div>


                    {/* CENTRO */}
                    <div className="navbar-center">

                        <div className="navbar-links">

                            <button
                                className={
                                    `nav-link ${
                                        homeActive
                                            ? 'active'
                                            : ''
                                    }`
                                }
                                onClick={() =>
                                    navigate('/')
                                }
                            >
                                <span className="nav-icon">
                                    <HomeIcon />
                                </span>

                                <span>
                                    Home
                                </span>
                            </button>


                            <button
                                className="nav-link"
                                onClick={openCatalog}
                            >
                                <span className="nav-icon">
                                    <CatalogIcon />
                                </span>

                                <span>
                                    Catalogo
                                </span>
                            </button>


                            {isLoggedIn && (
                                <button
                                    className={
                                        `nav-link ${
                                            profileActive
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={() =>
                                        navigate('/profile')
                                    }
                                >
                                    <span className="nav-icon">
                                        <UserIcon />
                                    </span>

                                    <span>
                                        Profilo
                                    </span>
                                </button>
                            )}

                        </div>


                        {/* RICERCA */}
                        <form
                            className="navbar-search"
                            onSubmit={handleSearch}
                        >
                            <input
                                type="text"
                                placeholder="Cerca mazzi..."
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                className="search-submit"
                                type="submit"
                                title="Cerca"
                                aria-label="Cerca"
                            >
                                <SearchIcon />
                            </button>
                        </form>

                    </div>


                    {/* DESTRA */}
                    <div className="navbar-actions">

                        {isLoggedIn ? (
                            <>
                                <div className="navbar-user">

                                    <span className="user-icon">
                                        <UserIcon />
                                    </span>

                                    <span className="navbar-username">
                                        {username}
                                    </span>

                                </div>


                                <button
                                    className="settings-button"
                                    title="Impostazioni"
                                    aria-label="Impostazioni"
                                    onClick={() =>
                                        setIsModalOpen(true)
                                    }
                                >
                                    <SettingsIcon />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="login-button"
                                    onClick={() =>
                                        navigate('/login')
                                    }
                                >
                                    <span className="login-icon">
                                        <UserIcon />
                                    </span>

                                    <span>
                                        Accedi
                                    </span>
                                </button>


                                <button
                                    className="signup-button"
                                    onClick={openRegistration}
                                >
                                    <span>
                                        Registrati
                                    </span>

                                    <span className="signup-arrow">
                                        →
                                    </span>
                                </button>
                            </>
                        )}

                    </div>

                </nav>

            </header>


            {isModalOpen && (
                <Settings
                    onClose={() =>
                        setIsModalOpen(false)
                    }
                />
            )}
        </>
    );
}