import axios from 'axios';

const api = axios.create({
  baseURL:
      import.meta.env.VITE_API_URL
      ?? 'http://localhost:8080/api',

  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {

  const token =
      localStorage.getItem('token');

  if (token) {
    config.headers.Authorization =
        `Bearer ${token}`;
  }

  return config;
});

export function getErrorMessage(
    error: unknown
): string {

  if (!axios.isAxiosError(error)) {

    if (
        error instanceof Error
        && error.message
    ) {
      return error.message;
    }

    return 'Si è verificato un errore inatteso.';
  }

  const data = error.response?.data;

  if (
      typeof data === 'string'
      && data.trim()
  ) {
    return data;
  }

  if (
      data
      && typeof data === 'object'
  ) {

    if (
        'error' in data
        && typeof data.error === 'string'
    ) {
      return data.error;
    }

    const firstValue =
        Object.values(data)
            .find(
                value =>
                    typeof value === 'string'
            );

    if (typeof firstValue === 'string') {
      return firstValue;
    }
  }

  if (error.response?.status === 401) {
    return 'Devi effettuare il login.';
  }

  if (error.response?.status === 403) {
    return 'Operazione non consentita.';
  }

  if (error.response?.status === 404) {
    return 'Risorsa non trovata.';
  }

  return 'Errore di comunicazione con il server.';
}

export default api;