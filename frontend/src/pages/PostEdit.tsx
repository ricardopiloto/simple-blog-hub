import { useEffect, useState, useCallback } from 'react';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
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
import type { CreateOrUpdatePostPayload, StoryType } from '@/api/types';
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

/**
 * Constrói ISO 8601 com offset do fuso do browser (ex.: 2025-02-14T10:00:00-03:00)
 * para que o servidor interprete a hora como a hora local do autor.
 * Retorna null se a data/hora for inválida ou não for futura.
 */
function toScheduledIsoWithOffset(dateStr: string, timeStr: string): string | null {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  if ([y, m, d, h, min].some(Number.isNaN)) return null;
  const date = new Date(y, m - 1, d, h, min, 0, 0);
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) return null;
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const oh = Math.floor(Math.abs(offsetMin) / 60);
  const om = Math.abs(offsetMin) % 60;
  const offsetStr = `${sign}${String(oh).padStart(2, '0')}:${String(om).padStart(2, '0')}`;
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const minStr = String(date.getMinutes()).padStart(2, '0');
  return `${yy}-${mm}-${dd}T${hh}:${minStr}:00${offsetStr}`;
}

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { author } = useAuth();
  const isNew = !id;

  const [storyType, setStoryType] = useState<'' | StoryType>('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [storyOrder, setStoryOrder] = useState(1);
  const [includeInStoryOrder, setIncludeInStoryOrder] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [selectedAuthorId, setSelectedAuthorId] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [storyTypeError, setStoryTypeError] = useState('');
  const [coverPreviewError, setCoverPreviewError] = useState(false);

  const resolveCoverUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const base = (typeof import.meta.env?.VITE_BFF_URL === 'string' && import.meta.env.VITE_BFF_URL.trim())
      ? import.meta.env.VITE_BFF_URL.trim().replace(/\/$/, '')
      : window.location.origin;
    return base + (trimmed.startsWith('/') ? trimmed : `/${trimmed}`);
  }, []);

  const { data: post, isLoading: loadingPost } = useQuery({
    queryKey: ['post', 'edit', id],
    queryFn: () => fetchPostByIdForEdit(id!),
    enabled: !isNew && Boolean(id),
  });

  useEffect(() => {
    setCoverPreviewError(false);
  }, [coverImage]);

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
      setStoryType(post.story_type ?? '');
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt ?? '');
      setContent(post.content);
      setCoverImage(post.cover_image ?? '');
      setPublished(post.published);
      setStoryOrder(post.story_order);
      setIncludeInStoryOrder(post.include_in_story_order ?? true);
      if (post.scheduled_publish_at) {
        setScheduleEnabled(true);
        const d = new Date(post.scheduled_publish_at);
        setScheduledDate(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        );
        setScheduledTime(
          `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
        );
      } else {
        setScheduleEnabled(false);
        setScheduledDate('');
        setScheduledTime('');
      }
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
    if (isNew) setExcerpt(value.slice(0, EXCERPT_LENGTH).trim());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStoryTypeError('');
    if (storyType !== 'velho_mundo' && storyType !== 'idade_das_trevas') {
      setStoryTypeError('Selecione a história (Velho Mundo ou Idade das Trevas).');
      return;
    }
    let scheduledIso: string | null = null;
    if (scheduleEnabled && scheduledDate && scheduledTime) {
      scheduledIso = toScheduledIsoWithOffset(scheduledDate, scheduledTime);
    }
    const payload: CreateOrUpdatePostPayload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content,
      cover_image: coverImage.trim() || null,
      published: scheduledIso ? false : published,
      story_order: storyOrder,
      story_type: storyType,
      include_in_story_order: includeInStoryOrder,
      scheduled_publish_at: scheduleEnabled ? (scheduledIso ?? null) : null,
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
              <Label htmlFor="post-story-type">História (obrigatório)</Label>
              <ToggleGroup
                id="post-story-type"
                type="single"
                value={storyType === '' ? undefined : storyType}
                onValueChange={(v) => {
                  if (v) {
                    setStoryType(v as StoryType);
                    setStoryTypeError('');
                  }
                }}
                className={cn('inline-flex rounded-md border p-1', storyTypeError && 'border-destructive')}
              >
                <ToggleGroupItem value="velho_mundo" aria-label="Velho Mundo">
                  Velho Mundo
                </ToggleGroupItem>
                <ToggleGroupItem value="idade_das_trevas" aria-label="Idade das Trevas">
                  Idade das Trevas
                </ToggleGroupItem>
              </ToggleGroup>
              {storyTypeError && (
                <p className="text-sm text-destructive">{storyTypeError}</p>
              )}
            </div>
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
              <Tabs defaultValue="escrever" className="w-full">
                <TabsList>
                  <TabsTrigger value="escrever">Escrever</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="escrever">
                  <Textarea
                    id="post-content"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Escreva em **Markdown**..."
                    rows={14}
                    className="font-mono text-sm"
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Suporta Markdown: **negrito**, *itálico*, # títulos, listas, links, etc.
                  </p>
                </TabsContent>
                <TabsContent value="preview">
                  <div
                    className="min-h-[20.5rem] h-[20.5rem] w-full rounded-md border border-input bg-background px-3 py-2 overflow-y-auto overflow-x-hidden text-sm"
                    aria-label="Preview do conteúdo"
                  >
                    {content.trim() ? (
                      <div
                        className="prose prose-neutral dark:prose-invert max-w-none text-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(marked.parse(content.trim(), { async: false }) as string),
                        }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">Nada para previsualizar.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-cover">URL da imagem de capa</Label>
              <p className="text-xs text-muted-foreground">Proporção recomendada 16:9 (ex.: 1200×675 px) para não cortar a imagem na visualização.</p>
              {!isNew && coverImage.trim() && (
                <div className="rounded-lg border bg-muted/30 overflow-hidden max-w-lg aspect-video">
                  {!coverPreviewError ? (
                    <img
                      src={resolveCoverUrl(coverImage)}
                      alt="Preview da capa"
                      className="w-full h-full object-contain"
                      onError={() => setCoverPreviewError(true)}
                    />
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">Não foi possível carregar a imagem.</p>
                  )}
                </div>
              )}
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
              <div className="flex items-center gap-2">
                <Switch
                  id="post-schedule-enabled"
                  checked={scheduleEnabled}
                  onCheckedChange={(checked) => {
                    setScheduleEnabled(checked);
                    if (!checked) {
                      setScheduledDate('');
                      setScheduledTime('');
                    }
                  }}
                  disabled={saving}
                />
                <Label htmlFor="post-schedule-enabled">Agendar publicação</Label>
              </div>
              {!scheduleEnabled && (
                <p className="text-xs text-muted-foreground">
                  Desligado: o post será publicado imediatamente ao guardar (conforme o switch &quot;Publicado&quot;).
                </p>
              )}
              {scheduleEnabled && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Defina data e hora para publicar automaticamente. Enquanto agendado, o post fica como rascunho.
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={saving}
                          className={cn(
                            'min-w-[140px] justify-start text-left font-normal',
                            !scheduledDate && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate || 'Escolher data'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={scheduledDate ? new Date(scheduledDate + 'T12:00:00') : undefined}
                          onSelect={(date) =>
                            setScheduledDate(
                              date
                                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                                : '',
                            )
                          }
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      disabled={saving}
                      className="w-[120px]"
                    />
                    {(scheduledDate || scheduledTime) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={saving}
                        onClick={() => {
                          setScheduledDate('');
                          setScheduledTime('');
                        }}
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </>
              )}
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
