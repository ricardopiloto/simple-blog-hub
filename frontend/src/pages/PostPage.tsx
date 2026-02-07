import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { DEFAULT_POST_COVER_IMAGE } from '@/lib/constants';
import { usePost, usePostsByStoryOrder } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug || '');
  const { data: storyOrderedPosts = [] } = usePostsByStoryOrder();

  if (isLoading) {
    return (
      <Layout>
        <article className="py-16">
          <div className="container-blog">
            <Skeleton className="h-6 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="aspect-[16/9] rounded-xl mb-12" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">
            Artigo não encontrado
          </h1>
          <p className="text-muted-foreground mb-8">
            O artigo que você procura não existe ou foi removido.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })
    : null;

  const currentIndex = storyOrderedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? storyOrderedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < storyOrderedPosts.length - 1
      ? storyOrderedPosts[currentIndex + 1]
      : null;
  const showPrevNextNav = currentIndex >= 0 && (prevPost != null || nextPost != null);

  return (
    <Layout>
      <article className="py-16">
        <div className="container-blog">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para artigos
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name || 'Author'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {post.author.name?.[0] || 'A'}
                      </span>
                    </div>
                  )}
                  <span className="font-medium text-foreground">
                    {post.author.name || 'Autor'}
                  </span>
                </div>
              )}
              {formattedDate && (
                <>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </>
              )}
              {typeof post.view_count === 'number' && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5" title="visualizações">
                    <Eye className="h-4 w-4" />
                    <span>{post.view_count}</span>
                  </span>
                </>
              )}
            </div>
          </motion.header>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <img
              src={post.cover_image || DEFAULT_POST_COVER_IMAGE}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          {post.author?.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 pt-8 border-t"
            >
              <div className="flex items-start gap-4">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name || 'Author'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-xl font-medium">
                      {post.author.name?.[0] || 'A'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {post.author.name || 'Autor'}
                  </h3>
                  <p className="text-muted-foreground">{post.author.bio}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Prev/Next navigation (story order) */}
          {showPrevNextNav && (
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-6"
              aria-label="Navegação entre artigos"
            >
              {prevPost ? (
                <Link
                  to={`/post/${prevPost.slug}`}
                  className="inline-flex flex-col gap-1 text-left max-w-[min(100%,16rem)] text-muted-foreground hover:text-foreground transition-colors min-w-0"
                >
                  <span className="text-sm font-medium">Post anterior</span>
                  <span className="inline-flex items-center gap-2 font-serif text-lg min-w-0">
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    <span className="truncate" title={prevPost.title}>
                      {prevPost.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link
                  to={`/post/${nextPost.slug}`}
                  className="inline-flex flex-col gap-1 text-right max-w-[min(100%,16rem)] ml-auto text-muted-foreground hover:text-foreground transition-colors min-w-0"
                >
                  <span className="text-sm font-medium">Próximo post</span>
                  <span className="inline-flex items-center gap-2 font-serif text-lg min-w-0 justify-end">
                    <span className="truncate" title={nextPost.title}>
                      {nextPost.title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </Link>
              ) : null}
            </motion.nav>
          )}
        </div>
      </article>
    </Layout>
  );
}
