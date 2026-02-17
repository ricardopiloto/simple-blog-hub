import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DEFAULT_POST_COVER_IMAGE } from '@/lib/constants';
import type { Post } from '@/api/types';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formattedDate = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: ptBR })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/post/${post.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4">
          <img
            src={post.cover_image || DEFAULT_POST_COVER_IMAGE}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {formattedDate && <span>{formattedDate}</span>}
            {post.author?.name && (
              <>
                <span>•</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
