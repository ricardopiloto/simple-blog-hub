import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllPostsForAuthorArea, deletePost } from '@/api/client';
import type { Post } from '@/api/types';
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
  const { author, logout, isAdmin } = useAuth();
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

  const [filterQuery, setFilterQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const q = filterQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post: Post) => {
      const titleMatch = post.title.toLowerCase().includes(q);
      const authorMatch = post.author?.name?.toLowerCase().includes(q);
      const dateStr = post.published_at
        ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';
      const isoDate = post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : '';
      const dateMatch = dateStr.includes(q) || isoDate.includes(q);
      return titleMatch || authorMatch || dateMatch;
    });
  }, [posts, filterQuery]);

  const showScroll = filteredPosts.length > 10;

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
            <>
              <div className="mb-4">
                <Input
                  type="search"
                  placeholder="Pesquisar por autor, título ou data"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="max-w-md"
                  aria-label="Pesquisar por autor, título ou data"
                />
              </div>
              <div
                className={showScroll ? 'overflow-y-auto max-h-[32rem] rounded-lg border bg-muted/30' : ''}
              >
                <ul className="space-y-3 p-1">
                  {filteredPosts.map((post) => (
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
                      {post.scheduled_publish_at && (
                        <>
                          {' · '}
                          Agendado para{' '}
                          {new Date(post.scheduled_publish_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </>
                      )}
                      {typeof post.view_count === 'number' && ` · ${post.view_count} visualizações`}
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
              </div>
              {filterQuery.trim() && filteredPosts.length === 0 && (
                <p className="text-muted-foreground mt-2">Nenhum post corresponde à pesquisa.</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">
              Nenhum post no blog.
            </p>
          )}

        </div>
      </section>
    </Layout>
  );
}
