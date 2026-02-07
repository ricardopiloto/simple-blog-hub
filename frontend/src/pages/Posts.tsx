import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PostCard } from '@/components/blog/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '@/api/client';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 350;

export default function Posts() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', 'page', page, debouncedSearch],
    queryFn: () => fetchPostsPage(page, PAGE_SIZE, debouncedSearch.trim() || undefined),
  });

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
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquisar por título, autor ou data..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
                aria-label="Pesquisar artigos"
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
