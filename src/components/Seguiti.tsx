import React from 'react';

interface SeguitiProps {
    utentiSeguiti: string[];
    onApriProfiloAutore: (autore: string) => void;
}

const Seguiti: React.FC<SeguitiProps> = ({ utentiSeguiti, onApriProfiloAutore }) => {
    return (
        <div style={{ padding: '2rem 4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#333', marginBottom: '2rem' }}>Utenti che segui</h1>

            {utentiSeguiti.length === 0 ? (
                <div style={{ padding: '3rem', backgroundColor: '#f9f9f9', borderRadius: '16px', color: '#888' }}>
                    <span style={{ fontSize: '3rem' }}>👥</span>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Non segui ancora nessun utente.</p>
                    <p>Esplora la Home per trovare mazzi interessanti e seguire i loro creatori!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
                    {utentiSeguiti.map((utente) => (
                        <div
                            key={utente}
                            onClick={() => onApriProfiloAutore(utente)}
                            style={{
                                padding: '1.5rem',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{
                                width: '70px', height: '70px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #9A83F0 0%, #7B5EE4 100%)',
                                color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'
                            }}>
                                {utente.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ margin: 0, color: '#333' }}>{utente}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Seguiti;