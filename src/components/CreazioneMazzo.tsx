import React, { useState } from 'react';
import './CreazioneMazzo.css';

interface Carta {
    id: number;
    fronte: string;
    retro: string;
    pronunciaFronte?: string; // <--- NUOVO CAMPO OPZIONALE
    pronunciaRetro?: string;  // <--- NUOVO CAMPO OPZIONALE
}

interface CreazioneMazzoProps {
    onNavigate: (page: string) => void;
    onSalvaMazzo: (nuovoMazzo: any) => void;
    mazzoIniziale?: any;
}

const CreazioneMazzo: React.FC<CreazioneMazzoProps> = ({ onNavigate, onSalvaMazzo, mazzoIniziale }) => {
    const [nomeMazzo, setNomeMazzo] = useState(mazzoIniziale?.nome || '');
    const [filtro, setFiltro] = useState(mazzoIniziale?.filtro || '');

    const [carte, setCarte] = useState<Carta[]>(
        mazzoIniziale?.carte || [
            { id: 1, fronte: '', retro: '', pronunciaFronte: '', pronunciaRetro: '' },
            { id: 2, fronte: '', retro: '', pronunciaFronte: '', pronunciaRetro: '' },
            { id: 3, fronte: '', retro: '', pronunciaFronte: '', pronunciaRetro: '' }
        ]
    );

    const aggiungiCarta = () => {
        setCarte([...carte, { id: Date.now(), fronte: '', retro: '', pronunciaFronte: '', pronunciaRetro: '' }]);
    };

    // Usiamo "keyof Carta" così accetta sia fronte/retro che le pronunce
    const aggiornaCarta = (id: number, campo: keyof Carta, valore: string) => {
        setCarte(carte.map(carta =>
            carta.id === id ? { ...carta, [campo]: valore } : carta
        ));
    };

    const rimuoviCarta = (id: number) => {
        setCarte(carte.filter(carta => carta.id !== id));
    };

    const handleSalva = () => {
        const mazzoDaSalvare = {
            id: mazzoIniziale ? mazzoIniziale.id : Date.now(),
            nome: nomeMazzo || 'Mazzo Senza Nome',
            filtro: filtro || 'Generale',
            // Salviamo solo se c'è ALMENO fronte o retro compilato
            carte: carte.filter(c => c.fronte !== '' || c.retro !== '')
        };

        onSalvaMazzo(mazzoDaSalvare);
        alert(mazzoIniziale ? 'Modifiche salvate!' : 'Mazzo creato con successo!');
        onNavigate('profilo');
    };

    return (
        <div className="creazione-container">
            <div className="azioni-header">
                <button className="btn-indietro" onClick={() => onNavigate('profilo')}>Annulla e Indietro</button>
                <button className="btn-salva" onClick={handleSalva}>
                    {mazzoIniziale ? 'Salva Modifiche' : 'Salva Mazzo'}
                </button>
            </div>

            <div className="info-mazzo-bubble">
                <div className="input-group">
                    <label>Nome del Mazzo</label>
                    <input type="text" placeholder="Es. Verbi Spagnoli..." value={nomeMazzo} onChange={(e) => setNomeMazzo(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Categoria / Filtro</label>
                    <input type="text" placeholder="Es. Lingue, Storia..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
                </div>
            </div>

            <div className="lista-carte">
                {carte.map((carta, index) => (
                    <div key={carta.id} className="carta-block">
                        <div className="carta-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Carta {index + 1}</span>
                            <button onClick={() => rimuoviCarta(carta.id)} className="btn-elimina-singola" title="Elimina questa carta">
                                🗑️ Elimina
                            </button>
                        </div>

                        <div className="carta-corpo">
                            <div className="carta-lato">
                                <label>Fronte</label>
                                <textarea
                                    placeholder="Testo principale..."
                                    value={carta.fronte}
                                    onChange={(e) => aggiornaCarta(carta.id, 'fronte', e.target.value)}
                                />
                                {/* NUOVO CAMPO OPZIONALE */}
                                <input
                                    type="text"
                                    placeholder="Pronuncia o descrizione (opzionale)"
                                    value={carta.pronunciaFronte || ''}
                                    onChange={(e) => aggiornaCarta(carta.id, 'pronunciaFronte', e.target.value)}
                                    style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                            <div className="carta-lato">
                                <label>Retro</label>
                                <textarea
                                    placeholder="Testo principale..."
                                    value={carta.retro}
                                    onChange={(e) => aggiornaCarta(carta.id, 'retro', e.target.value)}
                                />
                                {/* NUOVO CAMPO OPZIONALE */}
                                <input
                                    type="text"
                                    placeholder="Pronuncia o descrizione (opzionale)"
                                    value={carta.pronunciaRetro || ''}
                                    onChange={(e) => aggiornaCarta(carta.id, 'pronunciaRetro', e.target.value)}
                                    style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn-aggiungi-carta" onClick={aggiungiCarta}>
                + Aggiungi carta
            </button>
        </div>
    );
};

export default CreazioneMazzo;