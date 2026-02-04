import { Navigate, useLocation } from 'react-router-dom';
import { authStorage } from '@/auth/storage';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects to /login if not authenticated, or to /area-autor if not admin.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!authStorage.isAdmin()) {
    return <Navigate to="/area-autor" replace />;
  }
  return <>{children}</>;
}
