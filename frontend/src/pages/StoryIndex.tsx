import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Layout } from '@/components/layout/Layout';
import { DEFAULT_POST_COVER_IMAGE } from '@/lib/constants';
import { usePostsByStoryOrder } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { updateStoryOrder } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import type { Post, StoryType } from '@/api/types';

const ITEMS_PER_PAGE = 6;

function filterPosts(posts: Post[], filterText: string): Post[] {
  const q = filterText.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter((p) => {
    const orderStr = String(p.story_order);
    const title = (p.title ?? '').toLowerCase();
    return orderStr.includes(q) || title.includes(q);
  });
}

function applyManualReorder(items: Post[], fromIndex: number, newPosition1Based: number): Post[] {
  if (newPosition1Based < 1 || newPosition1Based > items.length) return items;
  const from = fromIndex;
  const to = newPosition1Based - 1;
  if (from === to) return items;
  const copy = [...items];
  const [removed] = copy.splice(from, 1);
  copy.splice(to, 0, removed);
  return copy.map((p, i) => ({ ...p, story_order: i + 1 }));
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [removed] = copy.splice(from, 1);
  copy.splice(to, 0, removed);
  return copy;
}

interface SortableCardProps {
  post: Post;
  displayOrder: number;
  workingListLength: number;
  isAuthenticated: boolean;
  onPositionChange: (postId: string, value: string) => void;
}

function SortableCard({ post, displayOrder, workingListLength, isAuthenticated, onPositionChange }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <motion.article
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
    >
      <div className="flex">
        <div
          className="p-2 flex items-center cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
          title="Arrastar para reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.slug}`} className="block">
            <div className="aspect-video w-full relative rounded-lg overflow-hidden">
              <img
                src={post.cover_image || DEFAULT_POST_COVER_IMAGE}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </Link>
          <div className="p-3 flex items-center gap-2">
            {isAuthenticated ? (
              <Input
                type="number"
                min={1}
                max={workingListLength}
                value={String(displayOrder)}
                onChange={(e) => onPositionChange(post.id, e.target.value)}
                className="w-14 h-8 text-sm font-mono"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="font-mono text-sm font-medium text-muted-foreground w-8">
                {String(displayOrder).padStart(2, '0')}
              </span>
            )}
            <Link to={`/post/${post.slug}`} className="flex-1 min-w-0">
              <h3 className="font-serif font-semibold text-foreground truncate text-sm">{post.title}</h3>
            </Link>
            <Link
              to={`/post/${post.slug}`}
              className="text-accent hover:underline flex items-center gap-0.5 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              Ler
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function StoryIndex() {
  const { data: posts = [], isLoading } = usePostsByStoryOrder();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUniverse, setSelectedUniverse] = useState<StoryType>('velho_mundo');
  const [editingOrder, setEditingOrder] = useState<Post[] | null>(null);
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(() => [...posts].sort((a, b) => a.story_order - b.story_order), [posts]);
  const hasVelhoMundo = useMemo(() => posts.some((p) => p.story_type === 'velho_mundo'), [posts]);
  const hasIdadeDasTrevas = useMemo(() => posts.some((p) => p.story_type === 'idade_das_trevas'), [posts]);
  const showUniverseToggle = hasVelhoMundo && hasIdadeDasTrevas;

  const effectiveUniverseFilteredList = useMemo(() => {
    if (showUniverseToggle) return sorted.filter((p) => p.story_type === selectedUniverse);
    if (hasVelhoMundo) return sorted.filter((p) => p.story_type === 'velho_mundo');
    if (hasIdadeDasTrevas) return sorted.filter((p) => p.story_type === 'idade_das_trevas');
    return sorted;
  }, [sorted, showUniverseToggle, hasVelhoMundo, hasIdadeDasTrevas, selectedUniverse]);

  const workingList = editingOrder ?? effectiveUniverseFilteredList;
  const filtered = useMemo(() => filterPosts(workingList, filterText), [workingList, filterText]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  );

  const hasOrderChanges = editingOrder != null && JSON.stringify(editingOrder.map((p) => ({ id: p.id, so: p.story_order }))) !== JSON.stringify(sorted.map((p) => ({ id: p.id, so: p.story_order })));

  const handlePositionChange = (postId: string, newPositionStr: string) => {
    const newPos = parseInt(newPositionStr, 10);
    if (Number.isNaN(newPos) || newPos < 1) return;
    const list = editingOrder ?? sorted;
    const fromIndex = list.findIndex((p) => p.id === postId);
    if (fromIndex === -1) return;
    const reordered = applyManualReorder(list, fromIndex, Math.min(newPos, list.length));
    setEditingOrder(reordered);
  };

  const handleSaveOrder = async () => {
    if (!editingOrder || !hasOrderChanges) return;
    setSaving(true);
    try {
      await updateStoryOrder(editingOrder.map((p) => ({ id: p.id, story_order: p.story_order })));
      queryClient.invalidateQueries({ queryKey: ['posts', 'story'] });
      setEditingOrder(null);
      toast({ title: 'Ordem salva!', description: 'A ordem da história foi atualizada.' });
    } catch (e) {
      toast({ title: 'Erro', description: e instanceof Error ? e.message : 'Não foi possível salvar a ordem.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = () => {
    setEditingOrder(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !editingOrder) return;
      const list = editingOrder;
      const oldIndex = paginated.findIndex((p) => p.id === active.id);
      const newIndex = paginated.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
      const newPaginatedOrder = arrayMove(paginated, oldIndex, newIndex);
      const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageIndices = paginated.map((p) => list.findIndex((x) => x.id === p.id));
      const newWorkingList = [...list];
      for (let i = 0; i < paginated.length; i++) {
        newWorkingList[pageIndices[i]] = newPaginatedOrder[i];
      }
      const withOrder = newWorkingList.map((p, i) => ({ ...p, story_order: i + 1 }));
      setEditingOrder(withOrder);
    },
    [editingOrder, paginated, currentPage]
  );

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16">
          <div className="container-wide">
            <p className="text-muted-foreground">Carregando índice…</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Índice da História
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              A ordem aqui define como a história será contada. Use o filtro para buscar por número ou título.
            </p>

            {/* Filtro e toggle de universo */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Input
                type="text"
                placeholder="Filtrar por número da ordem ou título..."
                value={filterText}
                onChange={(e) => {
                  setFilterText(e.target.value);
                  setPage(1);
                }}
                className="max-w-md"
              />
              {showUniverseToggle && !editingOrder && (
                <ToggleGroup
                  type="single"
                  value={selectedUniverse}
                  onValueChange={(v) => {
                    if (v) {
                      setSelectedUniverse(v as StoryType);
                      setPage(1);
                    }
                  }}
                  className="inline-flex rounded-md border p-1"
                >
                  <ToggleGroupItem value="velho_mundo" aria-label="Velho Mundo">
                    Velho Mundo
                  </ToggleGroupItem>
                  <ToggleGroupItem value="idade_das_trevas" aria-label="Idade das Trevas">
                    Idade das Trevas
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>

            {/* Controles de edição (apenas autenticados) */}
            {isAuthenticated && (
              <div className="mb-4 flex gap-3">
                {!editingOrder ? (
                  <Button variant="outline" size="sm" onClick={() => setEditingOrder([...sorted])}>
                    Editar ordem
                  </Button>
                ) : (
                  <>
                    <Button size="sm" onClick={handleSaveOrder} disabled={!hasOrderChanges || saving}>
                      {saving ? 'Salvando…' : 'Salvar ordem'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancelOrder} disabled={saving}>
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>

          {/* Grid de cards compactos (6 por página) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {isAuthenticated && editingOrder ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={paginated.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {paginated.map((post, indexInPage) => {
                    const displayOrder = workingList.findIndex((p) => p.id === post.id) + 1;
                    return (
                      <SortableCard
                        key={post.id}
                        post={post}
                        displayOrder={displayOrder}
                        workingListLength={workingList.length}
                        isAuthenticated={isAuthenticated}
                        onPositionChange={handlePositionChange}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              paginated.map((post, indexInPage) => {
                const displayOrder = workingList.findIndex((p) => p.id === post.id) + 1;
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: indexInPage * 0.03 }}
                    className="bg-card border rounded-lg overflow-hidden hover:border-accent/50 transition-colors"
                  >
                    <Link to={`/post/${post.slug}`} className="block">
                      <div className="aspect-video w-full relative rounded-lg overflow-hidden">
                        <img
                          src={post.cover_image || DEFAULT_POST_COVER_IMAGE}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </Link>
                    <div className="p-3 flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-muted-foreground w-8">
                        {String(displayOrder).padStart(2, '0')}
                      </span>
                      <Link to={`/post/${post.slug}`} className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-foreground truncate text-sm">
                          {post.title}
                        </h3>
                      </Link>
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-accent hover:underline flex items-center gap-0.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ler
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                {filterText.trim() ? 'Nenhum capítulo corresponde ao filtro.' : 'Nenhum capítulo publicado ainda.'}
              </p>
            </motion.div>
          )}

          {filtered.length > 0 && !filterText.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 p-6 bg-secondary/30 rounded-xl text-center"
            >
              <p className="text-muted-foreground">
                💡 <strong>Dica:</strong> Comece pelo capítulo 01 e siga a ordem para uma experiência completa da história.
              </p>
              <Link
                to={`/post/${filtered[0]?.slug}`}
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
