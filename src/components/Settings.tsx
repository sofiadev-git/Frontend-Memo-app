import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import authService from '../services/authService';
import deckService from '../services/deckService';
import { getErrorMessage } from '../services/api';
import './Settings.css';

interface SettingsProps {
    onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
    const navigate = useNavigate();
    const { username, logout } = useAuth();
    const [myDecks, setMyDecks] = useState(0);
    const [bookmarks, setBookmarks] = useState(0);
    const [deleting, setDeleting] = useState(false);

    const initial = username ? username.charAt(0).toUpperCase() : '?';

    useEffect(() => {
        let active = true;

        Promise.all([deckService.mine(), deckService.bookmarks()])
            .then(([mine, saved]) => {
                if (active) {
                    setMyDecks(mine.length);
                    setBookmarks(saved.length);
                }
            })
            .catch(() => {
                // Le statistiche non sono indispensabili al funzionamento del modal.
            });

        return () => {
            active = false;
        };
    }, []);

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Sei sicuro di voler eliminare definitivamente il tuo account?'
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            await authService.deleteAccount();
            logout();
            onClose();
            navigate('/');
        } catch (error) {
            window.alert(getErrorMessage(error));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <div className="modal-header">
                    <div className="avatar-wrapper">
                        <div className="avatar-circle">
                            <span>{initial}</span>
                        </div>
                    </div>
                    <h2 className="username">{username}</h2>
                </div>

                <div className="modal-stats">
                    <div className="stat-item">
                        <span className="stat-number">{myDecks}</span>
                        <span className="stat-label">Mazzi</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{bookmarks}</span>
                        <span className="stat-label">Salvati</span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                    <button
                        className="btn-delete-account"
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                    >
                        {deleting ? 'Eliminazione...' : 'Elimina account'}
                    </button>
                </div>
            </div>
        </div>
    );
}
