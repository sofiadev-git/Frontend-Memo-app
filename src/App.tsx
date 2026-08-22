import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import DeckPage from './pages/DeckPage';
import DeckFormPage from './pages/DeckFormPage';
import ReviewPage from './pages/ReviewPage';
import LoginPage from './pages/LoginPage';
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/deck/:id" element={<DeckPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/deck/new" element={<DeckFormPage />} />
                            <Route path="/deck/:id/edit" element={<DeckFormPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>

                    <Route element={<PrivateRoute />}>
                        <Route path="/deck/:id/review" element={<ReviewPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}