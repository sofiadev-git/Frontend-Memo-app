import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from =
      (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');

    if (!username.trim() || !password) {
      setError('Inserisci username e password.');
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        username: username.trim(),
        password
      });

      login(response);

      navigate(from, {
        replace: true
      });

    } catch (requestError) {
      setError(
          getErrorMessage(requestError)
      );

    } finally {
      setLoading(false);
    }
  };

  const openRegistration = () => {
    window.location.href =
        'http://localhost:8080/register';
  };

  return (
      <div className="auth-page">

        <form
            className="auth-card"
            onSubmit={handleSubmit}
        >

          <h1>Accedi a Memo</h1>

          <p>
            Inserisci le tue credenziali
            per continuare.
          </p>

          {error && (
              <div className="form-error">
                {error}
              </div>
          )}

          <label>
            Username

            <input
                type="text"
                value={username}
                onChange={(event) =>
                    setUsername(event.target.value)
                }
                autoComplete="username"
            />
          </label>

          <label>
            Password

            <input
                type="password"
                value={password}
                onChange={(event) =>
                    setPassword(event.target.value)
                }
                autoComplete="current-password"
            />
          </label>

          <button
              className="auth-primary"
              type="submit"
              disabled={loading}
          >
            {loading
                ? 'Accesso...'
                : 'Log In'}
          </button>

          <button
              className="auth-link"
              type="button"
              onClick={openRegistration}
          >
            Non hai un account? Registrati
          </button>

        </form>
      </div>
  );
}