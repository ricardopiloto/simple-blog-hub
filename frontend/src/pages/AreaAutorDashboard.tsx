import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDashboardStats, fetchAllPostsForAuthorArea, deletePost } from '@/api/client';
import type { Post } from '@/api/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Send, CalendarClock, FileEdit, Eye, Users } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';

const MAX_SUGGESTIONS = 10;

function buildAuthorAreaSuggestions(
  posts: Post[],
  q: string
): string[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of posts) {
    if (p.author?.name && p.author.name.toLowerCase().includes(lower) && !seen.has(p.author.name)) {
      seen.add(p.author.name);
      out.push(p.author.name);
      if (out.length >= MAX_SUGGESTIONS) return out;
    }
    if (p.title && p.title.toLowerCase().includes(lower) && !seen.has(p.title)) {
      seen.add(p.title);
      out.push(p.title);
      if (out.length >= MAX_SUGGESTIONS) return out;
    }
  }
  return out;
}

export default function AreaAutorDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { author, logout, isAdmin } = useAuth();
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchDashboardStats(),
  });
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['posts', 'author-area'],
    queryFn: () => fetchAllPostsForAuthorArea(),
  });

  const error = statsError || postsError;
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
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  type StatusFilter = 'all' | 'published' | 'scheduled' | 'draft';
  type SortBy = 'date' | 'story_order';
  type SortDir = 'asc' | 'desc';
  type StoryTypeFilter = 'all' | 'velho_mundo' | 'idade_das_trevas';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [storyTypeFilter, setStoryTypeFilter] = useState<StoryTypeFilter>('all');
  const publicationsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToPublications = () => {
    publicationsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let list = posts;
    if (statusFilter !== 'all') {
      if (statusFilter === 'published') list = list.filter((p: Post) => p.published === true);
      else if (statusFilter === 'scheduled') list = list.filter((p: Post) => p.scheduled_publish_at != null && p.scheduled_publish_at !== '');
      else list = list.filter((p: Post) => p.published === false);
    }
    if (storyTypeFilter !== 'all') {
      list = list.filter((post: Post) => post.story_type === storyTypeFilter);
    }
    const q = filterQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((post: Post) => {
        const titleMatch = post.title.toLowerCase().includes(q);
        const authorMatch = post.author?.name?.toLowerCase().includes(q);
        const dateStr = post.published_at
          ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : '';
        const isoDate = post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : '';
        const dateMatch = dateStr.includes(q) || isoDate.includes(q);
        return titleMatch || authorMatch || dateMatch;
      });
    }
    if (fromDate || toDate) {
      list = list.filter((post: Post) => {
        const postDateStr = post.published_at
          ? new Date(post.published_at).toISOString().slice(0, 10)
          : post.created_at
            ? new Date(post.created_at).toISOString().slice(0, 10)
            : '';
        if (!postDateStr) return false;
        if (fromDate && postDateStr < fromDate) return false;
        if (toDate && postDateStr > toDate) return false;
        return true;
      });
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'date') {
        const tA = new Date(a.created_at).getTime();
        const tB = new Date(b.created_at).getTime();
        if (tA !== tB) return sortDir === 'desc' ? tB - tA : tA - tB;
      } else {
        if (a.story_order !== b.story_order) return sortDir === 'desc' ? b.story_order - a.story_order : a.story_order - b.story_order;
      }
      return a.id.localeCompare(b.id);
    });
    return sorted;
  }, [posts, filterQuery, statusFilter, storyTypeFilter, sortBy, sortDir, fromDate, toDate]);
  const showScroll = filteredPosts.length > 10;

  const authorAreaSuggestions = useMemo(
    () => buildAuthorAreaSuggestions(posts ?? [], filterQuery),
    [posts, filterQuery]
  );
  const showAuthorAreaSuggestions = searchFocused && filterQuery.trim().length >= 1 && authorAreaSuggestions.length > 0;

  const handleAuthorAreaSuggestionSelect = (value: string) => {
    setFilterQuery(value);
    setSearchFocused(false);
    setSuggestionIndex(-1);
  };

  const handleAuthorAreaSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showAuthorAreaSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex((i) => (i < authorAreaSuggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex((i) => (i <= 0 ? authorAreaSuggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && suggestionIndex >= 0 && authorAreaSuggestions[suggestionIndex]) {
      e.preventDefault();
      handleAuthorAreaSuggestionSelect(authorAreaSuggestions[suggestionIndex]);
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSuggestionIndex(-1);
    }
  };

  useEffect(() => {
    setSuggestionIndex(-1);
  }, [authorAreaSuggestions.length]);

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Área do autor
            </h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do blog.
            </p>
          </div>

          {statsError && !stats && (
            <p className="text-destructive mb-4">
              Não foi possível carregar o dashboard. Faça login novamente se necessário.
            </p>
          )}

          {statsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-10">
              <button
                type="button"
                onClick={() => { setStatusFilter('all'); scrollToPublications(); }}
                className={cn(
                  'rounded-lg border bg-card p-4 text-left w-full cursor-pointer transition-colors hover:bg-muted/50',
                  statusFilter === 'all' && 'border-2 border-yellow-500'
                )}
                aria-label="Ver todos os posts"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Total de posts</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.total_posts}</p>
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('published'); scrollToPublications(); }}
                className={cn(
                  'rounded-lg border bg-card p-4 text-left w-full cursor-pointer transition-colors hover:bg-muted/50',
                  statusFilter === 'published' && 'border-2 border-yellow-500'
                )}
                aria-label="Filtrar por publicados"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Send className="h-4 w-4" />
                  <span className="text-sm font-medium">Publicados</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.published_count}</p>
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('scheduled'); scrollToPublications(); }}
                className={cn(
                  'rounded-lg border bg-card p-4 text-left w-full cursor-pointer transition-colors hover:bg-muted/50',
                  statusFilter === 'scheduled' && 'border-2 border-yellow-500'
                )}
                aria-label="Filtrar por planejados"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-sm font-medium">Planejados</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.scheduled_count}</p>
              </button>
              <button
                type="button"
                onClick={() => { setStatusFilter('draft'); scrollToPublications(); }}
                className={cn(
                  'rounded-lg border bg-card p-4 text-left w-full cursor-pointer transition-colors hover:bg-muted/50',
                  statusFilter === 'draft' && 'border-2 border-yellow-500'
                )}
                aria-label="Filtrar por rascunhos"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileEdit className="h-4 w-4" />
                  <span className="text-sm font-medium">Rascunho</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.draft_count}</p>
              </button>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Visualizações</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.total_views}</p>
              </div>
              <Link
                to="/area-autor/contas"
                className="rounded-lg border bg-card p-4 text-left w-full cursor-pointer transition-colors hover:bg-muted/50 block no-underline"
                aria-label="Ir para Contas"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Autores</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.authors_count}</p>
              </Link>
            </div>
          ) : null}

          {/* Secção Publicações */}
          <div ref={publicationsSectionRef} className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Publicações
              </h2>
              <Button asChild>
                <Link to="/area-autor/posts/novo">Novo post</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mb-4">
              Gerencie seus artigos e colaborações.
            </p>

            {postsError && (
              <p className="text-destructive mb-4">
                Não foi possível carregar os posts. Faça login novamente se necessário.
              </p>
            )}

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4 flex-wrap">
                    <div className="space-y-2 relative">
                      <Label htmlFor="author-area-search" className="sr-only">
                        Pesquisar por autor, título ou data
                      </Label>
                      <Input
                        id="author-area-search"
                        type="search"
                        placeholder="Pesquisar por autor, título ou data"
                        value={filterQuery}
                        onChange={(e) => {
                          setFilterQuery(e.target.value);
                          setStatusFilter('all');
                        }}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                        onKeyDown={handleAuthorAreaSearchKeyDown}
                        className="min-w-[20rem] max-w-md"
                        aria-label="Pesquisar por autor, título ou data"
                        aria-autocomplete="list"
                        aria-expanded={showAuthorAreaSuggestions}
                        aria-controls="author-area-suggestions"
                        aria-activedescendant={suggestionIndex >= 0 && authorAreaSuggestions[suggestionIndex] ? `author-suggestion-${suggestionIndex}` : undefined}
                      />
                      {showAuthorAreaSuggestions && (
                        <ul
                          id="author-area-suggestions"
                          role="listbox"
                          className="absolute top-full left-0 z-50 mt-1 min-w-[20rem] max-w-md rounded-md border bg-popover text-popover-foreground shadow-md max-h-60 overflow-auto py-1"
                        >
                          {authorAreaSuggestions.map((s, i) => (
                            <li
                              key={`${s}-${i}`}
                              id={`author-suggestion-${i}`}
                              role="option"
                              aria-selected={i === suggestionIndex}
                              className={cn(
                                'cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                                i === suggestionIndex && 'bg-accent text-accent-foreground'
                              )}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleAuthorAreaSuggestionSelect(s);
                              }}
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="sr-only">Filtrar por data</Label>
                      <DateRangePicker
                        fromDate={fromDate}
                        toDate={toDate}
                        onChange={(from, to) => {
                          setFromDate(from ?? null);
                          setToDate(to ?? null);
                        }}
                        placeholder="Filtrar por data"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author-area-story-type">Linha da história</Label>
                      <Select
                        value={storyTypeFilter}
                        onValueChange={(v) => {
                          setStoryTypeFilter(v as StoryTypeFilter);
                          setStatusFilter('all');
                        }}
                      >
                        <SelectTrigger id="author-area-story-type" className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="velho_mundo">Velho Mundo</SelectItem>
                          <SelectItem value="idade_das_trevas">Idade das Trevas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author-area-sort">Ordenar por</Label>
                    <Select
                      value={`${sortBy}_${sortDir}`}
                      onValueChange={(v) => {
                        const [by, dir] = v.split('_') as [SortBy, SortDir];
                        setSortBy(by);
                        setSortDir(dir);
                        setStatusFilter('all');
                      }}
                    >
                      <SelectTrigger id="author-area-sort" className="w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date_desc">Mais recentes</SelectItem>
                        <SelectItem value="date_asc">Mais antigos</SelectItem>
                        <SelectItem value="story_order_asc">Ordem da história (crescente)</SelectItem>
                        <SelectItem value="story_order_desc">Ordem da história (decrescente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                            {post.author?.name && <span>Autor: {post.author.name}</span>}
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
                              <Link to={`/area-autor/posts/${post.id}/editar`}>Editar</Link>
                            </Button>
                          )}
                          {(isOwner(post) || isAdmin) ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">Excluir</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir este post?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
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
              <p className="text-muted-foreground">Nenhum post no blog.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
