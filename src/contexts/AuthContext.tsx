import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authStorage, type AuthorInfo } from '@/auth/storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  author: AuthorInfo | null;
  setAuth: (token: string, author: AuthorInfo, userId?: string | null) => void;
  logout: () => void;
  userId: string | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authStorage.isAuthenticated);
  const [author, setAuthor] = useState<AuthorInfo | null>(() => authStorage.getAuthor());

  const setAuth = useCallback((token: string, a: AuthorInfo, uid?: string | null) => {
    authStorage.setAuth(token, a, uid ?? null);
    setIsAuthenticated(true);
    setAuthor(a);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setIsAuthenticated(false);
    setAuthor(null);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setIsAuthenticated(authStorage.isAuthenticated());
      setAuthor(authStorage.getAuthor());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const userId = authStorage.getUserId();
  const isAdmin = authStorage.isAdmin();

  return (
    <AuthContext.Provider value={{ isAuthenticated, author, setAuth, logout, userId, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
