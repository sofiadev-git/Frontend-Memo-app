import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse } from '../types';

interface AuthContextValue {
  token: string | null;
  username: string;
  role: string;
  isLoggedIn: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('username') ?? '');
  const [role, setRole] = useState(() => localStorage.getItem('role') ?? '');

  const login = (auth: AuthResponse) => {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('username', auth.username);
    localStorage.setItem('role', auth.role);

    setToken(auth.token);
    setUsername(auth.username);
    setRole(auth.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    setToken(null);
    setUsername('');
    setRole('');
  };

  const value = useMemo(
    () => ({
      token,
      username,
      role,
      isLoggedIn: Boolean(token),
      login,
      logout
    }),
    [token, username, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider');
  }

  return context;
}
