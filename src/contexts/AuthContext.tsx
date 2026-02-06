import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authStorage, type AuthorInfo } from '@/auth/storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  author: AuthorInfo | null;
  setAuth: (token: string, author: AuthorInfo, userId?: string | null, mustChangePassword?: boolean) => void;
  logout: () => void;
  userId: string | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
  setMustChangePassword: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authStorage.isAuthenticated);
  const [author, setAuthor] = useState<AuthorInfo | null>(() => authStorage.getAuthor());
  const [mustChangePassword, setMustChangePasswordState] = useState(() => authStorage.getMustChangePassword());

  const setAuth = useCallback((token: string, a: AuthorInfo, uid?: string | null, mustChange?: boolean) => {
    const must = mustChange ?? false;
    authStorage.setAuth(token, a, uid ?? null, must);
    setIsAuthenticated(true);
    setAuthor(a);
    setMustChangePasswordState(must);
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
      setMustChangePasswordState(authStorage.getMustChangePassword());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const userId = authStorage.getUserId();
  const isAdmin = authStorage.isAdmin();

  const setMustChangePassword = useCallback((value: boolean) => {
    authStorage.setMustChangePassword(value);
    setMustChangePasswordState(value);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, author, setAuth, logout, userId, isAdmin, mustChangePassword, setMustChangePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
