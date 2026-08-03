import React, { useState } from 'react';
import './RisultatiRicerca.css';

interface RisultatiRicercaProps {
    searchQuery: string;
    mazzi: any[];
    currentUsername: string;
    utentiSeguiti: string[];
    onApriMazzo: (mazzo: any) => void;
    onToggleLike: (id: number) => void;
}

const RisultatiRicerca: React.FC<RisultatiRicercaProps> = ({
                                                               searchQuery, mazzi, currentUsername, utentiSeguiti, onApriMazzo, onToggleLike
                                                           }) => {
    // AGGIUNTO: 'autore' ai tipi di ricerca possibili
    const [tipoRicerca, setTipoRicerca] = useState<'nome' | 'categoria' | 'autore'>('nome');

    // Chi vogliamo cercare?
    const [filtroProprieta, setFiltroProprieta] = useState<'tutti' | 'miei' | 'seguiti'>('tutti');

    // Doppio Filtro: Prima per testo, poi per proprietà (chi l'ha creato)
    const mazziFiltrati = mazzi.filter(mazzo => {
        const termine = searchQuery.toLowerCase().trim();

        // 1. Filtro Testo (Nome, Categoria o Autore)
        let corrispondeAlTesto = false;
        if (tipoRicerca === 'nome') {
            corrispondeAlTesto = mazzo.nome.toLowerCase().includes(termine);
        } else if (tipoRicerca === 'categoria') {
            corrispondeAlTesto = (mazzo.filtro || 'Generale').toLowerCase().includes(termine);
        } else if (tipoRicerca === 'autore') {
            corrispondeAlTesto = (mazzo.autore || 'Anonimo').toLowerCase().includes(termine);
        }

        // 2. Filtro Proprietà (Tutti, Miei, Seguiti)
        let corrispondeAllAutore = true;
        if (filtroProprieta === 'miei') {
            corrispondeAllAutore = mazzo.autore === currentUsername;
        } else if (filtroProprieta === 'seguiti') {
            corrispondeAllAutore = utentiSeguiti.includes(mazzo.autore);
        }

        return corrispondeAlTesto && corrispondeAllAutore;
    });

    return (
        <div className="ricerca-container">
            <div className="ricerca-header">
                <div>
                    <h2 style={{ color: '#333', margin: 0 }}>
                        Risultati per: <span style={{ color: '#9A83F0' }}>"{searchQuery}"</span>
                    </h2>
                    <p style={{ color: '#888', margin: '0.5rem 0 0 0' }}>{mazziFiltrati.length} mazzi trovati</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>

                    {/* TASTI TESTO: Nome / Categoria / Autore */}
                    <div className="ricerca-toggles">
                        <button className={`btn-toggle-ricerca ${tipoRicerca === 'nome' ? 'active' : ''}`} onClick={() => setTipoRicerca('nome')}>
                            Filtra per Nome
                        </button>
                        <button className={`btn-toggle-ricerca ${tipoRicerca === 'categoria' ? 'active' : ''}`} onClick={() => setTipoRicerca('categoria')}>
                            Filtra per Categoria
                        </button>
                        {/* NUOVO TASTO PER AUTORE */}
                        <button className={`btn-toggle-ricerca ${tipoRicerca === 'autore' ? 'active' : ''}`} onClick={() => setTipoRicerca('autore')}>
                            Filtra per Autore
                        </button>
                    </div>

                    {/* TASTI PROPRIETÀ: Tutti / Miei / Seguiti */}
                    <div className="ricerca-toggles" style={{ transform: 'scale(0.9)', transformOrigin: 'right center' }}>
                        <button className={`btn-toggle-ricerca ${filtroProprieta === 'tutti' ? 'active' : ''}`} onClick={() => setFiltroProprieta('tutti')}>
                            🌐 Tutti
                        </button>
                        <button className={`btn-toggle-ricerca ${filtroProprieta === 'miei' ? 'active' : ''}`} onClick={() => setFiltroProprieta('miei')}>
                            👤 I Miei Mazzi
                        </button>
                        <button className={`btn-toggle-ricerca ${filtroProprieta === 'seguiti' ? 'active' : ''}`} onClick={() => setFiltroProprieta('seguiti')}>
                            👥 Seguiti
                        </button>
                    </div>
                </div>
            </div>

            <div className="ricerca-grid">
                {mazziFiltrati.length > 0 ? (
                    mazziFiltrati.map((mazzo) => (
                        <div key={mazzo.id} className="home-mazzo-card" onClick={() => onApriMazzo(mazzo)}>
                            <div>
                                <h3>{mazzo.nome}</h3>
                                <p>{mazzo.carte ? mazzo.carte.length : 0} carte</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>{mazzo.filtro || 'Generale'}</span>
                                <span style={{ fontSize: '0.85rem', color: '#9A83F0', fontWeight: 'bold' }}>@{mazzo.autore}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888', fontStyle: 'italic', backgroundColor: '#f9f9f9', borderRadius: '16px' }}>
                        Nessun mazzo trovato con questi filtri. Prova a cambiare i parametri di ricerca!
                    </div>
                )}
            </div>
        </div>
    );
};

export default RisultatiRicerca;