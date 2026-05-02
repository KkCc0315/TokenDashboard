'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';
import { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      // ignore corrupt storage
    }
    setIsReady(true);
  }, []);

  const signIn = useCallback((nextToken: string, nextUser: AuthUser) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [user, token, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
