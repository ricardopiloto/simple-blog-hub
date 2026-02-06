import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '@/auth/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects to /login if the user is not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
