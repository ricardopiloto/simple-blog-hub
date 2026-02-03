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
  createPost,
  updatePost,
  fetchAuthors,
  addCollaborator,
  removeCollaborator,
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
  const [published, setPublished] = useState(false);
  const [storyOrder, setStoryOrder] = useState(1);
  const [selectedAuthorId, setSelectedAuthorId] = useState('');

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
    }
  }, [post]);

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
                placeholder="https://..."
                disabled={saving}
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
            </div>
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
