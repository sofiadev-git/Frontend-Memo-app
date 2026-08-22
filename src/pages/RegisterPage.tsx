import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Inserisci username e password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        username: username.trim(),
        password
      });
      window.alert('Registrazione completata. Ora puoi effettuare il login.');
      navigate('/login');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Crea un account</h1>
        <p>Registrati per creare, salvare e studiare i tuoi mazzi.</p>

        {error && <div className="form-error">{error}</div>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label>
          Conferma password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>

        <button className="auth-primary" type="submit" disabled={loading}>
          {loading ? 'Registrazione...' : 'Registrati'}
        </button>

        <button className="auth-link" type="button" onClick={() => navigate('/login')}>
          Hai già un account? Log In
        </button>
      </form>
    </div>
  );
}
