import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeaturedPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    published_at: string | null;
    profiles?: {
      full_name: string | null;
    } | null;
  };
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const formattedDate = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Link to={`/post/${post.slug}`} className="block">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {post.cover_image && (
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full uppercase tracking-wider">
              Destaque
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground group-hover:text-accent transition-colors">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {formattedDate && <span>{formattedDate}</span>}
              {post.profiles?.full_name && (
                <>
                  <span>•</span>
                  <span>{post.profiles.full_name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
