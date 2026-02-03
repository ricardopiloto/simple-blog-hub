import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, BookOpen, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { usePostsStore, Post } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function StoryIndex() {
  const { posts, updatePostOrder } = usePostsStore();
  const [items, setItems] = useState<Post[]>(posts);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleReorder = (newOrder: Post[]) => {
    setItems(newOrder);
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePostOrder(items);
    setHasChanges(false);
    toast({
      title: 'Ordem salva!',
      description: 'A ordem da história foi atualizada com sucesso.',
    });
  };

  const handleReset = () => {
    setItems(posts);
    setHasChanges(false);
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Índice da História
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Arraste os capítulos para reorganizar a ordem da narrativa.
              A ordem aqui define como a história será contada, independente da data de publicação.
            </p>
          </motion.div>

          {/* Action buttons */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex gap-3"
            >
              <Button onClick={handleSave}>
                Salvar Ordem
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
            </motion.div>
          )}

          {/* Reorderable list */}
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {items.map((post, index) => (
              <Reorder.Item
                key={post.id}
                value={post}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group flex items-center gap-4 p-4 bg-card border rounded-xl hover:border-accent/50 transition-colors"
                >
                  {/* Drag handle */}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <GripVertical className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="font-mono text-sm font-medium w-8">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Cover image thumbnail */}
                  {post.cover_image && (
                    <div className="hidden sm:block w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.cover_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-semibold text-foreground truncate">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground truncate">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Link to post */}
                  <Link
                    to={`/post/${post.slug}`}
                    className="hidden sm:flex items-center gap-1 text-sm text-accent hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ler
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Nenhum capítulo publicado ainda.
              </p>
            </motion.div>
          )}

          {/* Reading order hint */}
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 p-6 bg-secondary/30 rounded-xl text-center"
            >
              <p className="text-muted-foreground">
                💡 <strong>Dica:</strong> Comece pelo capítulo 01 e siga a ordem para uma experiência completa da história.
              </p>
              <Link
                to={`/post/${items[0]?.slug}`}
                className="inline-flex items-center gap-2 mt-4 text-accent hover:underline font-medium"
              >
                Começar a leitura
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
