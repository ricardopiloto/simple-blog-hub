import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/client';
import type { CreateUserPayload, UpdateUserPayload } from '@/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AreaContas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout, userId: currentUserId } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUserId(null);
      setEditEmail('');
      setEditPassword('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (error && error instanceof Error && error.message === 'Unauthorized') {
    logout();
    navigate('/login', { replace: true });
    return null;
  }

  function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('new-email') as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem('new-password') as HTMLInputElement)?.value;
    const authorName = (form.elements.namedItem('new-author-name') as HTMLInputElement)?.value?.trim();
    if (email && password && authorName) createMutation.mutate({ email, password, author_name: authorName });
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUserId) return;
    const payload: UpdateUserPayload = {};
    if (editEmail.trim()) payload.email = editEmail.trim();
    if (editPassword.trim()) payload.password = editPassword.trim();
    if (Object.keys(payload).length > 0) updateMutation.mutate({ id: editUserId, payload });
    else setEditUserId(null);
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/area-autor">← Voltar à área do autor</Link>
              </Button>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                Gestão de contas
              </h1>
              <p className="text-muted-foreground mt-1">
                Apenas o Admin pode criar, alterar e excluir contas.
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>Nova conta</Button>
          </div>

          {error && (
            <p className="text-destructive mb-4">
              Não foi possível carregar as contas. Faça login novamente se necessário.
            </p>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-4"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-foreground block">{u.email}</span>
                    <span className="text-sm text-muted-foreground">{u.author_name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => { setEditUserId(u.id); setEditEmail(u.email); setEditPassword(''); }}>
                      Editar
                    </Button>
                    {u.id !== currentUserId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir esta conta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O usuário não poderá mais fazer login. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteMutation.mutate(u.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhuma conta cadastrada.</p>
          )}
        </div>
      </section>

      {/* Dialog: Nova conta */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova conta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">E-mail</Label>
              <Input id="new-email" name="new-email" type="email" required placeholder="autor@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Senha</Label>
              <Input id="new-password" name="new-password" type="password" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-author-name">Nome do autor</Label>
              <Input id="new-author-name" name="new-author-name" required placeholder="Nome do autor" />
            </div>
            {createMutation.error && (
              <p className="text-sm text-destructive">{createMutation.error instanceof Error ? createMutation.error.message : 'Erro ao criar.'}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Criando…' : 'Criar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar usuário */}
      <Dialog open={!!editUserId} onOpenChange={(open) => { if (!open) { setEditUserId(null); setEditEmail(''); setEditPassword(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar conta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input id="edit-email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" placeholder="autor@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Nova senha (deixe em branco para não alterar)</Label>
              <Input id="edit-password" type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {updateMutation.error && (
              <p className="text-sm text-destructive">{updateMutation.error instanceof Error ? updateMutation.error.message : 'Erro ao atualizar.'}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditUserId(null)}>Cancelar</Button>
              <Button type="submit" disabled={updateMutation.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
