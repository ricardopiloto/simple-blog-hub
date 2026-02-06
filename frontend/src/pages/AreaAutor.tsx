import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllPostsForAuthorArea, deletePost, updateUser } from '@/api/client';
import { PASSWORD_CRITERIA_HELP, isValidPassword } from '@/lib/constants';
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

export default function AreaAutor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { author, logout, userId, isAdmin, setMustChangePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', 'author-area'],
    queryFn: () => fetchAllPostsForAuthorArea(),
  });

  useEffect(() => {
    if (error && error instanceof Error && error.message === 'Unauthorized') {
      logout();
      navigate('/login', { replace: true });
    }
  }, [error, logout, navigate]);

  async function handleDelete(id: string) {
    try {
      await deletePost(id);
      queryClient.invalidateQueries({ queryKey: ['posts', 'author-area'] });
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout();
        navigate('/login', { replace: true });
      }
    }
  }

  const isOwner = (post: { author_id?: string }) =>
    author && post.author_id && post.author_id === author.id;

  const canEdit = (post: { author_id?: string; collaborators?: { id: string; name: string }[] }) => {
    if (!author) return false;
    if (isAdmin) return true;
    if (post.author_id && post.author_id === author.id) return true;
    if (post.collaborators && post.collaborators.some((c) => c.id === author.id)) return true;
    return false;
  };

  const changePasswordMutation = useMutation({
    mutationFn: (password: string) => updateUser(userId ?? '', { password }),
    onSuccess: () => {
      setNewPassword('');
      setConfirmPassword('');
      setMustChangePassword(false);
    },
  });

  function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword.trim() && newPassword === confirmPassword && userId) {
      changePasswordMutation.mutate(newPassword.trim());
    }
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Área do autor
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus artigos e colaborações.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <Button variant="outline" asChild>
                  <Link to="/area-autor/contas">Contas</Link>
                </Button>
              )}
              <Button asChild>
                <Link to="/area-autor/posts/novo">Novo post</Link>
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-destructive mb-4">
              Não foi possível carregar os posts. Faça login novamente se necessário.
            </p>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-4"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-foreground block truncate">
                      {post.title}
                    </span>
                    <span className="text-sm text-muted-foreground block">
                      {post.author?.name && (
                        <span>Autor: {post.author.name}</span>
                      )}
                      {post.collaborators && post.collaborators.length > 0 && (
                        <>
                          {post.author?.name && ' · '}
                          <span>Colaboradores: {post.collaborators.map((c) => c.name).join(', ')}</span>
                        </>
                      )}
                      {(post.author?.name || (post.collaborators && post.collaborators.length > 0)) && (post.slug || post.published) && ' · '}
                      {post.slug}
                      {post.published ? ' · Publicado' : ' · Rascunho'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canEdit(post) && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/area-autor/posts/${post.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                    )}
                    {(isOwner(post) || isAdmin) ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir este post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(post.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Nenhum post no blog.
            </p>
          )}

          <div className="mt-12 pt-8 border-t">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Alterar minha senha</h2>
            <p className="text-sm text-muted-foreground mb-4">{PASSWORD_CRITERIA_HELP}</p>
            <form onSubmit={handleChangePassword} className="flex flex-wrap items-end gap-4 max-w-md">
              <div className="space-y-2 flex-1 min-w-[180px]">
                <Label htmlFor="new-password-area">Nova senha</Label>
                <Input
                  id="new-password-area"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={changePasswordMutation.isPending}
                />
              </div>
              <div className="space-y-2 flex-1 min-w-[180px]">
                <Label htmlFor="confirm-password-area">Confirmar senha</Label>
                <Input
                  id="confirm-password-area"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={changePasswordMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={
                  !userId ||
                  !newPassword.trim() ||
                  newPassword !== confirmPassword ||
                  !isValidPassword(newPassword) ||
                  changePasswordMutation.isPending
                }
              >
                {changePasswordMutation.isPending ? 'Salvando…' : 'Alterar senha'}
              </Button>
            </form>
            {changePasswordMutation.isSuccess && <p className="text-sm text-green-600 dark:text-green-400 mt-2">Senha alterada com sucesso.</p>}
            {changePasswordMutation.error && <p className="text-sm text-destructive mt-2">{changePasswordMutation.error instanceof Error ? changePasswordMutation.error.message : 'Erro ao alterar senha.'}</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
}
