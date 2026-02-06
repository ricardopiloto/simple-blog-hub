import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser } from '@/api/client';
import { PASSWORD_CRITERIA_HELP, isValidPassword } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Blocking modal shown when user must change password (e.g. after first login with default password or after admin reset).
 * Cannot be dismissed until password is changed successfully.
 */
export function ForceChangePasswordModal() {
  const { userId, setMustChangePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const mutation = useMutation({
    mutationFn: (password: string) => updateUser(userId ?? '', { password }),
    onSuccess: () => {
      setMustChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newPassword.trim() || newPassword !== confirmPassword || !userId) return;
    mutation.mutate(newPassword.trim());
  }

  const canSubmit =
    userId &&
    newPassword.trim().length > 0 &&
    newPassword === confirmPassword &&
    isValidPassword(newPassword) &&
    !mutation.isPending;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Trocar senha obrigatoriamente</DialogTitle>
          <DialogDescription>
            Sua senha é temporária. Defina uma nova senha para continuar usando a área do autor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">{PASSWORD_CRITERIA_HELP}</p>
          <div className="space-y-2">
            <Label htmlFor="force-new-password">Nova senha</Label>
            <Input
              id="force-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={mutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="force-confirm-password">Confirmar nova senha</Label>
            <Input
              id="force-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={mutation.isPending}
            />
          </div>
          {mutation.error && (
            <p className="text-sm text-destructive">
              {mutation.error instanceof Error ? mutation.error.message : 'Erro ao alterar senha.'}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">Senha alterada com sucesso. Você já pode usar a área do autor.</p>
          )}
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {mutation.isPending ? 'Salvando…' : 'Alterar senha'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
