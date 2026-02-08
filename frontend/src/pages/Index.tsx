import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { PostCard } from '@/components/blog/PostCard';
import { usePublishedPosts } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const { data: posts, isLoading, error } = usePublishedPosts();

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 7);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
              Contos & aventuras
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Um espaço para publicar aventuras e contos relacionados ao universo de RPG aonde os jogos do nosso grupo se passam. Os contos e aventuras são alimentados todos os finais de semana, conforme eles ocorrem :)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {error ? (
        <section className="py-16">
          <div className="container-wide text-center">
            <p className="text-muted-foreground">
              Não foi possível carregar os artigos. Verifique se o BFF está rodando (ex.: <code className="text-sm bg-muted px-1 rounded">backend/bff</code>).
            </p>
          </div>
        </section>
      ) : isLoading ? (
        <section className="py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-[4/3] rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </section>
      ) : featuredPost ? (
        <section className="py-16">
          <div className="container-wide">
            <FeaturedPost post={featuredPost} />
          </div>
        </section>
      ) : null}

      {/* Recent Posts */}
      <section className="py-16 bg-secondary/20">
        <div className="container-wide">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl font-bold mb-12"
          >
            Artigos Recentes
          </motion.h2>

          {isLoading ? (
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
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                Nenhum artigo publicado ainda.
              </p>
              <p className="text-muted-foreground mt-2">
                Os artigos aparecerão aqui assim que forem publicados.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section - hidden until add-newsletter-subscribe-and-notify is implemented */}
      {false && (
        <section className="py-20">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="font-serif text-3xl font-bold mb-4">
                Fique por dentro
              </h2>
              <p className="text-muted-foreground mb-8">
                Acompanhe as novidades e não perca nenhum artigo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Inscrever
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </Layout>
  );
}
