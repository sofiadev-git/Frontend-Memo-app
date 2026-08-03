import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profilo from './components/Profilo';
import Seguiti from './components/Seguiti';
import CreazioneMazzo from './components/CreazioneMazzo';
import VisualizzaMazzo from './components/VisualizzaMazzo';
import RipassoMazzo from './components/RipassoMazzo';
import ProfiloPubblico from './components/ProfiloPubblico';
import RisultatiRicerca from './components/RisultatiRicerca';

export type PageType = 'home' | 'profilo' | 'creazione-mazzo' | 'visualizza-mazzo' | 'modifica-mazzo' | 'ripasso-mazzo' | 'seguiti' | 'profilo-pubblico' | 'ricerca';

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const [descrizione, setDescrizione] = useState('Ciao! Sono nuovo su questa app.');
    const [autoreSelezionato, setAutoreSelezionato] = useState<string>('');
    const [utentiSeguiti, setUtentiSeguiti] = useState<string[]>([]);

    // STATO PER LA RICERCA
    const [searchQuery, setSearchQuery] = useState('');

    // STATO PER I MAZZI SALVATI (Spostato qui in alto, dove deve stare!)
    const [mazziSalvatiIds, setMazziSalvatiIds] = useState<number[]>([]);

    const [mazzi, setMazzi] = useState<any[]>([
        {
            id: 2,
            nome: 'Storia Romana',
            filtro: 'Storia',
            likes: 45,
            isLiked: false,
            autore: 'Marco99',
            carte: [
                { id: 201, fronte: 'Primo Re di Roma', retro: 'Romolo' },
            ]
        },
        {
            id: 1,
            nome: 'Inglese - Base',
            filtro: 'Lingue',
            likes: 12,
            isLiked: false,
            autore: 'StudenteFlash',
            carte: [
                { id: 101, fronte: 'Hello', pronunciaFronte: '/həˈloʊ/', retro: 'Ciao' },
                { id: 102, fronte: 'Apple', pronunciaFronte: '/ˈæp.əl/', retro: 'Mela' }
            ]
        }
    ]);

    const [mazzoSelezionato, setMazzoSelezionato] = useState<any>(null);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setUsername('StudenteFlash');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setCurrentPage('home');
    };

    const handleNavigate = (page: PageType) => {
        if (page !== 'ricerca') {
            setSearchQuery('');
        }
        setCurrentPage(page);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            setCurrentPage('ricerca');
        } else if (currentPage === 'ricerca') {
            setCurrentPage('home');
        }
    };

    const handleToggleFollow = (autore: string) => {
        if (!isLoggedIn) {
            alert("Devi effettuare il login per seguire un utente!");
            return;
        }

        if (utentiSeguiti.includes(autore)) {
            setUtentiSeguiti(utentiSeguiti.filter(u => u !== autore));
        } else {
            setUtentiSeguiti([...utentiSeguiti, autore]);
        }
    };

    // FUNZIONE PER SALVARE I MAZZI (Spostata qui fuori)
    const handleToggleSave = (idMazzo: number) => {
        if (!isLoggedIn) {
            alert("Devi effettuare il login per salvare un mazzo!");
            return;
        }

        if (mazziSalvatiIds.includes(idMazzo)) {
            setMazziSalvatiIds(mazziSalvatiIds.filter(id => id !== idMazzo));
        } else {
            setMazziSalvatiIds([...mazziSalvatiIds, idMazzo]);
        }
    };

    const toggleLike = (idMazzo: number) => {
        if (!isLoggedIn) {
            alert("Devi effettuare il login per mettere like!");
            return;
        }

        const mazziAggiornati = mazzi.map(m => {
            if (m.id === idMazzo) {
                const nuovoStatoLike = !m.isLiked;
                return {
                    ...m,
                    isLiked: nuovoStatoLike,
                    likes: nuovoStatoLike ? (m.likes || 0) + 1 : (m.likes || 0) - 1
                };
            }
            return m;
        });
        setMazzi(mazziAggiornati);

        if (mazzoSelezionato?.id === idMazzo) {
            const nuovoStatoLike = !mazzoSelezionato.isLiked;
            setMazzoSelezionato({
                ...mazzoSelezionato,
                isLiked: nuovoStatoLike,
                likes: nuovoStatoLike ? (mazzoSelezionato.likes || 0) + 1 : (mazzoSelezionato.likes || 0) - 1
            });
        }
    };

    const aggiungiNuovoMazzo = (nuovoMazzo: any) => {
        setMazzi([...mazzi, { ...nuovoMazzo, likes: 0, isLiked: false, autore: username || 'Anonimo' }]);
    };

    const aggiornaMazzoEsistente = (mazzoAggiornato: any) => {
        setMazzi(mazzi.map(m => {
            if (m.id === mazzoAggiornato.id) {
                return { ...mazzoAggiornato, likes: m.likes, isLiked: m.isLiked, autore: m.autore };
            }
            return m;
        }));
        setMazzoSelezionato((prev: any) => ({ ...mazzoAggiornato, likes: prev.likes, isLiked: prev.isLiked, autore: prev.autore }));
    };

    const apriMazzo = (mazzo: any) => {
        setMazzoSelezionato(mazzo);
        handleNavigate('visualizza-mazzo');
    };

    const eliminaMazzo = (idDaEliminare: number) => {
        setMazzi(mazzi.filter(m => m.id !== idDaEliminare));
        setMazzoSelezionato(null);
        handleNavigate('profilo');
    };

    return (
        <div>
            {currentPage !== 'ripasso-mazzo' && currentPage !== 'profilo-pubblico' && (
                <Navbar
                    currentPage={currentPage as any}
                    onNavigate={handleNavigate as any}
                    isLoggedIn={isLoggedIn}
                    username={username}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    numeroMazzi={mazzi.filter(m => m.autore === username).length}
                    descrizione={descrizione}
                    onSalvaDescrizione={setDescrizione}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                />
            )}

            <main>
                {currentPage === 'home' && (
                    <Home
                        mazzi={mazzi}
                        onApriMazzo={apriMazzo}
                        onToggleLike={toggleLike}
                    />
                )}

                {currentPage === 'profilo' && (
                    <Profilo
                        onNavigate={handleNavigate as any}
                        mazziCreati={mazzi.filter(m => m.autore === username)}
                        mazziSalvati={mazzi.filter(m => mazziSalvatiIds.includes(m.id))}
                        onApriMazzo={apriMazzo}
                        onToggleLike={toggleLike}
                    />
                )}

                {currentPage === 'ricerca' && (
                    <RisultatiRicerca
                        searchQuery={searchQuery}
                        mazzi={mazzi}
                        currentUsername={username}
                        utentiSeguiti={utentiSeguiti}
                        onApriMazzo={apriMazzo}
                        onToggleLike={toggleLike}
                    />
                )}

                {currentPage === 'seguiti' && (
                    <Seguiti
                        utentiSeguiti={utentiSeguiti}
                        onApriProfiloAutore={(autore) => {
                            setAutoreSelezionato(autore);
                            handleNavigate('profilo-pubblico');
                        }}
                    />
                )}

                {currentPage === 'creazione-mazzo' && (
                    <CreazioneMazzo
                        key="creazione"
                        onNavigate={handleNavigate as any}
                        onSalvaMazzo={aggiungiNuovoMazzo}
                    />
                )}

                {currentPage === 'modifica-mazzo' && (
                    <CreazioneMazzo
                        key={`modifica-${mazzoSelezionato?.id}`}
                        onNavigate={handleNavigate as any}
                        onSalvaMazzo={aggiornaMazzoEsistente}
                        mazzoIniziale={mazzoSelezionato}
                    />
                )}

                {currentPage === 'visualizza-mazzo' && (
                    <VisualizzaMazzo
                        mazzo={mazzoSelezionato}
                        currentUsername={username}

                        isSaved={mazziSalvatiIds.includes(mazzoSelezionato?.id)}
                        onToggleSave={handleToggleSave}

                        onNavigate={handleNavigate as any}
                        onModifica={() => handleNavigate('modifica-mazzo')}
                        onElimina={eliminaMazzo}
                        onToggleLike={toggleLike}
                        onAvviaRipasso={() => handleNavigate('ripasso-mazzo')}
                        onApriProfiloAutore={(autore) => {
                            setAutoreSelezionato(autore);
                            handleNavigate('profilo-pubblico');
                        }}
                    />
                )}

                {currentPage === 'profilo-pubblico' && (
                    <ProfiloPubblico
                        autore={autoreSelezionato}
                        currentUsername={username}
                        descrizioneUtente={descrizione}
                        mazziAutore={mazzi.filter(m => m.autore === autoreSelezionato)}
                        isFollowing={utentiSeguiti.includes(autoreSelezionato)}
                        onToggleFollow={handleToggleFollow}
                        onIndietro={() => handleNavigate('visualizza-mazzo')}
                        onApriMazzo={apriMazzo}
                        onToggleLike={toggleLike}
                    />
                )}

                {currentPage === 'ripasso-mazzo' && (
                    <RipassoMazzo
                        mazzo={mazzoSelezionato}
                        onConcludi={() => handleNavigate('visualizza-mazzo')}
                    />
                )}
            </main>
        </div>
    );
}

export default App;