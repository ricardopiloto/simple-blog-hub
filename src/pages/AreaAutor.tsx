import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEditablePosts, deletePost } from '@/api/client';
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
  const { author, logout } = useAuth();
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', 'editable'],
    queryFn: () => fetchEditablePosts(),
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
      queryClient.invalidateQueries({ queryKey: ['posts', 'editable'] });
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        logout();
        navigate('/login', { replace: true });
      }
    }
  }

  const isOwner = (post: { author_id?: string }) =>
    author && post.author_id && post.author_id === author.id;

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
            <Button asChild>
              <Link to="/area-autor/posts/novo">Novo post</Link>
            </Button>
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
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/area-autor/posts/${post.id}/editar`}>
                        Editar
                      </Link>
                    </Button>
                    {isOwner(post) ? (
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
              Você ainda não tem posts. Crie um novo para começar.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
