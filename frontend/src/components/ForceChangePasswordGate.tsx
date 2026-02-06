import { useAuth } from '@/contexts/AuthContext';
import { ForceChangePasswordModal } from '@/components/ForceChangePasswordModal';

/**
 * When the user is authenticated and must change password, renders only the blocking modal.
 * Otherwise renders children (e.g. Routes).
 */
export function ForceChangePasswordGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, mustChangePassword } = useAuth();

  if (isAuthenticated && mustChangePassword) {
    return <ForceChangePasswordModal />;
  }

  return <>{children}</>;
}
