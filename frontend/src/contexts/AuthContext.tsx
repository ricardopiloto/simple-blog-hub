import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStorage, type AuthorInfo } from '@/auth/storage';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type AuthContextValue = {
  isAuthenticated: boolean;
  author: AuthorInfo | null;
  setAuth: (token: string, author: AuthorInfo, userId?: string | null, mustChangePassword?: boolean) => void;
  logout: () => void;
  userId: string | null;
  isAdmin: boolean;
  mustChangePassword: boolean;
  setMustChangePassword: (value: boolean) => void;
  sessionExpiredOpen: boolean;
  setSessionExpiredOpen: (open: boolean) => void;
  openSessionExpiredModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authStorage.isAuthenticated);
  const [author, setAuthor] = useState<AuthorInfo | null>(() => authStorage.getAuthor());
  const [mustChangePassword, setMustChangePasswordState] = useState(() => authStorage.getMustChangePassword());
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const openSessionExpiredModal = useCallback(() => setSessionExpiredOpen(true), []);

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
    <AuthContext.Provider value={{ isAuthenticated, author, setAuth, logout, userId, isAdmin, mustChangePassword, setMustChangePassword, sessionExpiredOpen, setSessionExpiredOpen, openSessionExpiredModal }}>
      <SessionExpiredModal />
      {children}
    </AuthContext.Provider>
  );
}

function SessionExpiredModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionExpiredOpen, setSessionExpiredOpen } = useAuth();

  const handleClose = useCallback(() => {
    setSessionExpiredOpen(false);
    if (location.pathname.startsWith('/area-autor')) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate, setSessionExpiredOpen]);

  return (
    <AlertDialog open={sessionExpiredOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sessão expirada</AlertDialogTitle>
          <AlertDialogDescription>
            A sua sessão expirou. Por favor, autentique-se novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleClose}>Entendido</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
