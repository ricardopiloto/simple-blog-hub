import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCanManagePosts } from '@/hooks/useUserRole';
import { usePost, useCreatePost, useUpdatePost } from '@/hooks/usePosts';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const postSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  cover_image: z.string().url('URL inválida').optional().or(z.literal('')),
  published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { canManage, isLoading: roleLoading } = useCanManagePosts();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // For editing, we need to fetch by ID, not slug
  const [postData, setPostData] = useState<{
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image: string | null;
    published: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setPostData(data);
        });
    }
  }, [id, isNew]);

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      published: false,
    },
  });

  // Update form when post data is loaded
  useEffect(() => {
    if (postData) {
      form.reset({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || '',
        content: postData.content,
        cover_image: postData.cover_image || '',
        published: postData.published,
      });
    }
  }, [postData, form]);

  // Auto-generate slug from title
  const watchTitle = form.watch('title');
  useEffect(() => {
    if (isNew && watchTitle) {
      const currentSlug = form.getValues('slug');
      if (!currentSlug || currentSlug === generateSlug(form.getValues('title').slice(0, -1))) {
        form.setValue('slug', generateSlug(watchTitle));
      }
    }
  }, [watchTitle, isNew, form]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!canManage) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      if (isNew) {
        await createPostMutation.mutateAsync({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || undefined,
          content: data.content,
          cover_image: data.cover_image || undefined,
          published: data.published,
        });
        toast({
          title: 'Post criado!',
          description: data.published
            ? 'Seu post foi publicado com sucesso.'
            : 'Seu post foi salvo como rascunho.',
        });
      } else if (id) {
        await updatePostMutation.mutateAsync({
          id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || undefined,
          content: data.content,
          cover_image: data.cover_image || undefined,
          published: data.published,
        });
        toast({
          title: 'Post atualizado!',
          description: 'As alterações foram salvas.',
        });
      }
      navigate('/admin');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao salvar o post.';
      toast({
        title: 'Erro ao salvar',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-wide max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/admin">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="font-serif text-2xl font-bold">
                  {isNew ? 'Novo Post' : 'Editar Post'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {!isNew && postData?.published && (
                  <Button variant="outline" asChild>
                    <Link to={`/post/${postData.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Post
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-card border rounded-xl p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Digite o título do post"
                    {...form.register('title')}
                    className="text-lg"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    placeholder="url-do-post"
                    {...form.register('slug')}
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Este será o endereço do seu post: /post/{form.watch('slug') || 'slug'}
                  </p>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label htmlFor="cover_image">Imagem de Capa (URL)</Label>
                  <Input
                    id="cover_image"
                    placeholder="https://exemplo.com/imagem.jpg"
                    {...form.register('cover_image')}
                  />
                  {form.formState.errors.cover_image && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.cover_image.message}
                    </p>
                  )}
                  {form.watch('cover_image') && (
                    <div className="mt-2">
                      <img
                        src={form.watch('cover_image')}
                        alt="Preview"
                        className="w-full max-w-md h-40 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Um breve resumo do post..."
                    rows={3}
                    {...form.register('excerpt')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional. Será exibido na listagem de posts.
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva o conteúdo do seu post aqui... (suporta HTML)"
                    rows={15}
                    className="font-mono text-sm"
                    {...form.register('content')}
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Você pode usar HTML para formatar o conteúdo.
                  </p>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label htmlFor="published" className="text-base">
                      Publicar post
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Posts publicados ficam visíveis para todos.
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={form.watch('published')}
                    onCheckedChange={(checked) => form.setValue('published', checked)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
