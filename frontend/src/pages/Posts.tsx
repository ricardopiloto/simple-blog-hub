import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PostCard } from '@/components/blog/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '@/api/client';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 6;
const SUGGESTIONS_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;
const MAX_SUGGESTIONS = 10;

function buildSuggestions(items: { title?: string | null; author?: { name?: string | null } | null }[], q: string): string[] {
  const lower = q.trim().toLowerCase();
  if (!lower) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of items) {
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

export default function Posts() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const handleDateChange = (from: string | undefined, to: string | undefined) => {
    setFromDate(from ?? null);
    setToDate(to ?? null);
    setPage(1);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', 'page', page, debouncedSearch, fromDate, toDate],
    queryFn: () =>
      fetchPostsPage(
        page,
        PAGE_SIZE,
        debouncedSearch.trim() || undefined,
        fromDate ?? undefined,
        toDate ?? undefined
      ),
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ['posts', 'suggestions', debouncedSearch, fromDate, toDate],
    queryFn: () =>
      fetchPostsPage(
        1,
        SUGGESTIONS_PAGE_SIZE,
        debouncedSearch.trim() || undefined,
        fromDate ?? undefined,
        toDate ?? undefined
      ),
    enabled: debouncedSearch.trim().length >= 1,
  });

  const suggestions = buildSuggestions(suggestionsData?.items ?? [], debouncedSearch);
  const showSuggestions = searchFocused && searchInput.trim().length >= 1 && suggestions.length > 0;

  const handleSuggestionSelect = (value: string) => {
    setSearchInput(value);
    setDebouncedSearch(value);
    setSearchFocused(false);
    setSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && suggestionIndex >= 0 && suggestions[suggestionIndex]) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[suggestionIndex]);
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
      setSuggestionIndex(-1);
    }
  };

  useEffect(() => {
    setSuggestionIndex(-1);
  }, [suggestions.length]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Todos os Artigos
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Explore nossa coleção de artigos e histórias.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div ref={searchWrapperRef} className="relative max-w-md flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="search"
                  placeholder="Pesquisar por título, autor ou data..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-9"
                  aria-label="Pesquisar artigos"
                  aria-autocomplete="list"
                  aria-expanded={showSuggestions}
                  aria-controls="posts-search-suggestions"
                  aria-activedescendant={suggestionIndex >= 0 && suggestions[suggestionIndex] ? `suggestion-${suggestionIndex}` : undefined}
                />
                {showSuggestions && (
                  <ul
                    id="posts-search-suggestions"
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md z-50 max-h-60 overflow-auto py-1"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={`${s}-${i}`}
                        id={`suggestion-${i}`}
                        role="option"
                        aria-selected={i === suggestionIndex}
                        className={`cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${i === suggestionIndex ? 'bg-accent text-accent-foreground' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionSelect(s);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <DateRangePicker
                fromDate={fromDate}
                toDate={toDate}
                onChange={handleDateChange}
                placeholder="Filtrar por data"
              />
            </div>
          </motion.div>

          {error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Não foi possível carregar os artigos. Verifique se o BFF está rodando.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/9] rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((post, index) => (
                  <PostCard key={post.id} post={post} index={(page - 1) * PAGE_SIZE + index} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav
                  className="mt-12 flex flex-wrap items-center justify-center gap-4"
                  aria-label="Paginação"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {page} de {totalPages}
                    {total > 0 && ` (${total} ${total === 1 ? 'artigo' : 'artigos'})`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNext}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Próxima página"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">
                {debouncedSearch.trim()
                  ? 'Nenhum artigo encontrado para essa pesquisa.'
                  : 'Nenhum artigo publicado ainda.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
