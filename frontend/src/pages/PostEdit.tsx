import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchPostByIdForEdit,
  fetchNextStoryOrder,
  createPost,
  updatePost,
  fetchAuthors,
  addCollaborator,
  removeCollaborator,
  uploadCoverImage,
} from '@/api/client';
import type { CreateOrUpdatePostPayload } from '@/api/types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Gera slug a partir do título: minúsculo, sem acentos (á→a, é→e),
 * espaços e caracteres especiais ([]{} etc.) viram hífen, hífens nas pontas removidos.
 */
function slugify(text: string): string {
  if (!text.trim()) return '';
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')   // remove [] {} e outros especiais
    .replace(/\s+/g, '-')            // espaços → hífen
    .replace(/-+/g, '-')             // múltiplos hífens → um
    .replace(/^-|-$/g, '');
}

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { author } = useAuth();
  const isNew = !id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [storyOrder, setStoryOrder] = useState(1);
  const [includeInStoryOrder, setIncludeInStoryOrder] = useState(true);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['post', 'edit', id],
    queryFn: () => fetchPostByIdForEdit(id!),
    enabled: !isNew && Boolean(id),
  });

  const isOwner = Boolean(!isNew && post && author && post.author_id === author.id);

  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors,
    enabled: isOwner,
  });

  const { data: nextStoryOrder } = useQuery({
    queryKey: ['posts', 'next-story-order'],
    queryFn: fetchNextStoryOrder,
    enabled: true,
  });

  const addCollabMutation = useMutation({
    mutationFn: (authorId: string) => addCollaborator(id!, authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'edit', id] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'editable'] });
    },
  });

  const removeCollabMutation = useMutation({
    mutationFn: (authorId: string) => removeCollaborator(id!, authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', 'edit', id] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'editable'] });
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt ?? '');
      setContent(post.content);
      setCoverImage(post.cover_image ?? '');
      setPublished(post.published);
      setStoryOrder(post.story_order);
      setIncludeInStoryOrder(post.include_in_story_order ?? true);
    }
  }, [post]);

  useEffect(() => {
    if (isNew && nextStoryOrder != null) setStoryOrder(nextStoryOrder);
  }, [isNew, nextStoryOrder]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateOrUpdatePostPayload) => createPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'editable'] });
      navigate('/area-autor', { replace: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateOrUpdatePostPayload) => updatePost(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'editable'] });
      queryClient.invalidateQueries({ queryKey: ['post', 'edit', id] });
      navigate('/area-autor', { replace: true });
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;
  const saveError = createMutation.error ?? updateMutation.error;

  function handleTitleChange(value: string) {
    setTitle(value);
    if (isNew) setSlug(slugify(value));
  }

  const EXCERPT_LENGTH = 32;
  const STORY_ORDER_THRESHOLD = 5;
  const suggestedNext = nextStoryOrder ?? null;
  const showStoryOrderWarning =
    suggestedNext != null && storyOrder > suggestedNext + STORY_ORDER_THRESHOLD;

  function handleContentChange(value: string) {
    setContent(value);
    setExcerpt(value.slice(0, EXCERPT_LENGTH).trim());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateOrUpdatePostPayload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content,
      cover_image: coverImage.trim() || null,
      published,
      story_order: storyOrder,
      include_in_story_order: includeInStoryOrder,
    };
    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  }

  if (!isNew && id && loadingPost) {
    return (
      <Layout>
        <div className="container-wide py-16">
          <p className="text-muted-foreground">Carregando…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/area-autor">← Voltar à área do autor</Link>
            </Button>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-6">
            {isNew ? 'Novo post' : 'Editar post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="post-title">Título</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Título do artigo"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-slug">Slug (URL)</Label>
              <Input
                id="post-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="titulo-do-artigo"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-excerpt">Resumo</Label>
              <Input
                id="post-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve resumo"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Conteúdo (Markdown)</Label>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Escreva em **Markdown**..."
                rows={14}
                className="font-mono text-sm"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Suporta Markdown: **negrito**, *itálico*, # títulos, listas, links, etc.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-cover">URL da imagem de capa</Label>
              <Input
                id="post-cover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... ou envie um ficheiro abaixo"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">Ou envie um ficheiro (JPEG, PNG ou WebP; máx. 5 MB):</p>
              <Input
                id="post-cover-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={saving || uploadingCover}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploadingCover(true);
                  try {
                    const { url } = await uploadCoverImage(f);
                    setCoverImage(url);
                  } catch (err) {
                    console.error(err);
                    // Could add toast; for now leave field unchanged
                  } finally {
                    setUploadingCover(false);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="post-published"
                checked={published}
                onCheckedChange={setPublished}
                disabled={saving}
              />
              <Label htmlFor="post-published">Publicado</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-story-order">Ordem na história</Label>
              <Input
                id="post-story-order"
                type="number"
                min={0}
                value={storyOrder}
                onChange={(e) => setStoryOrder(Number(e.target.value) || 0)}
                disabled={saving}
              />
              {showStoryOrderWarning && suggestedNext != null && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Esta ordem está muito à frente da sequência atual. A próxima sugerida é {suggestedNext}.
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 space-y-0">
              <Switch
                id="post-include-in-story-order"
                checked={includeInStoryOrder}
                onCheckedChange={setIncludeInStoryOrder}
                disabled={saving}
              />
              <Label htmlFor="post-include-in-story-order" className="cursor-pointer">
                Faz parte da ordem da história
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Se desmarcado, o post não aparece no Índice da História nem nos links anterior/próximo.
            </p>
            {isOwner && post && (
              <div className="space-y-2">
                <Label>Colaboradores</Label>
                {post.collaborators && post.collaborators.length > 0 ? (
                  <ul className="space-y-1">
                    {post.collaborators.map((c) => (
                      <li
                        key={c.id}
                        className="flex items-center justify-between gap-2 rounded border bg-muted/50 px-3 py-2 text-sm"
                      >
                        <span>{c.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={removeCollabMutation.isPending}
                          onClick={() => removeCollabMutation.mutate(c.id)}
                        >
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum colaborador ainda.</p>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Select
                    value={selectedAuthorId}
                    onValueChange={setSelectedAuthorId}
                    disabled={addCollabMutation.isPending}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecionar autor…" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors
                        .filter(
                          (a) =>
                            a.id !== post.author_id &&
                            !post.collaborators?.some((c) => c.id === a.id)
                        )
                        .map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!selectedAuthorId || addCollabMutation.isPending}
                    onClick={() => {
                      if (selectedAuthorId) {
                        addCollabMutation.mutate(selectedAuthorId);
                        setSelectedAuthorId('');
                      }
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
            {saveError && (
              <p className="text-sm text-destructive">
                {saveError instanceof Error ? saveError.message : 'Erro ao salvar.'}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando…' : isNew ? 'Criar post' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/area-autor">Cancelar</Link>
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
