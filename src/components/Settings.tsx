import React, { useState } from 'react';
import './Settings.css';

interface SettingsProps {
    username: string;
    numeroMazzi: number;
    descrizione: string;
    onSalvaDescrizione: (nuovaDesc: string) => void;
    onClose: () => void;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ username, numeroMazzi, descrizione, onSalvaDescrizione, onClose, onLogout }) => {
    const initial = username ? username.charAt(0).toUpperCase() : '?';

    // Stato per la modalità di modifica della descrizione
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [tempDesc, setTempDesc] = useState(descrizione);

    const handleSalvaDesc = () => {
        onSalvaDescrizione(tempDesc);
        setIsEditingDesc(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <div className="avatar-wrapper">
                        <div className="avatar-circle"><span>{initial}</span></div>
                    </div>
                    <h2 className="username">{username}</h2>
                </div>

                {/* --- SEZIONE DESCRIZIONE --- */}
                <div className="modal-description" style={{ margin: '1rem 0', textAlign: 'center' }}>
                    {isEditingDesc ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <textarea
                                value={tempDesc}
                                onChange={(e) => setTempDesc(e.target.value)}
                                style={{ width: '100%', borderRadius: '8px', padding: '0.5rem', border: '1px solid #ccc', resize: 'none', height: '60px' }}
                            />
                            <button onClick={handleSalvaDesc} style={{ background: '#9A83F0', color: 'white', border: 'none', padding: '0.3rem 1rem', borderRadius: '12px', cursor: 'pointer' }}>Salva</button>
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: '#555', fontStyle: 'italic', margin: '0 0 0.5rem 0' }}>
                                "{descrizione || "Nessuna descrizione inserita."}"
                            </p>
                            <button onClick={() => setIsEditingDesc(true)} style={{ background: 'none', border: 'none', color: '#9A83F0', cursor: 'pointer', fontSize: '0.9rem' }}>
                                ✏️ Modifica Bio
                            </button>
                        </div>
                    )}
                </div>

                <div className="modal-stats">
                    <div className="stat-item">
                        <span className="stat-number">{numeroMazzi}</span>
                        <span className="stat-label">Mazzi</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Seguaci</span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-logout" onClick={onLogout}>Logout</button>
                    <button className="btn-delete-account" onClick={() => alert('Sei sicuro?')}>Elimina account</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;