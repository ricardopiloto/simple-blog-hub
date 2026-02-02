import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCanManagePosts, useIsAdmin } from '@/hooks/useUserRole';
import { useAllPosts, useDeletePost, useUpdatePost } from '@/hooks/usePosts';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Tab = 'posts' | 'users' | 'settings';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { canManage, isLoading: roleLoading } = useCanManagePosts();
  const { isAdmin } = useIsAdmin();
  const { data: posts, isLoading: postsLoading } = useAllPosts();
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();
  const { toast } = useToast();

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

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
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold mb-4">
              Acesso Restrito
            </h1>
            <p className="text-muted-foreground mb-6">
              Você não tem permissão para acessar esta área.
            </p>
            <Button asChild>
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    try {
      await deletePostMutation.mutateAsync(deletePostId);
      toast({
        title: 'Post excluído',
        description: 'O post foi excluído com sucesso.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o post.',
        variant: 'destructive',
      });
    }
    setDeletePostId(null);
  };

  const handleTogglePublish = async (postId: string, currentlyPublished: boolean) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        published: !currentlyPublished,
      });
      toast({
        title: currentlyPublished ? 'Post despublicado' : 'Post publicado',
        description: currentlyPublished
          ? 'O post foi despublicado.'
          : 'O post foi publicado com sucesso.',
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do post.',
        variant: 'destructive',
      });
    }
  };

  const tabs = [
    { id: 'posts' as Tab, label: 'Posts', icon: FileText },
    ...(isAdmin ? [{ id: 'users' as Tab, label: 'Usuários', icon: Users }] : []),
    { id: 'settings' as Tab, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-lg"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            pt-20 lg:pt-0
          `}
        >
          <div className="p-6">
            <h2 className="font-serif text-xl font-bold mb-6">Painel Admin</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="font-serif text-2xl font-bold">Gerenciar Posts</h1>
                  <Button asChild>
                    <Link to="/admin/post/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Post
                    </Link>
                  </Button>
                </div>

                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="bg-card border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                              Título
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                              Autor
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                              Data
                            </th>
                            <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-medium text-foreground line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-sm text-muted-foreground sm:hidden">
                                  {post.published ? (
                                    <Badge variant="default" className="mt-1">Publicado</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="mt-1">Rascunho</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                                {post.profiles?.full_name || 'Sem autor'}
                              </td>
                              <td className="px-6 py-4 hidden sm:table-cell">
                                {post.published ? (
                                  <Badge variant="default">Publicado</Badge>
                                ) : (
                                  <Badge variant="secondary">Rascunho</Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                                {format(new Date(post.created_at), "dd/MM/yyyy", { locale: ptBR })}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleTogglePublish(post.id, post.published)}
                                    title={post.published ? 'Despublicar' : 'Publicar'}
                                  >
                                    {post.published ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link to={`/admin/post/${post.id}`}>
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeletePostId(post.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-card border rounded-xl">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-2">Nenhum post ainda</h3>
                    <p className="text-muted-foreground mb-6">
                      Comece criando seu primeiro post.
                    </p>
                    <Button asChild>
                      <Link to="/admin/post/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Post
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && isAdmin && (
              <div>
                <h1 className="font-serif text-2xl font-bold mb-8">Gerenciar Usuários</h1>
                <div className="text-center py-12 bg-card border rounded-xl">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Gestão de Usuários</h3>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h1 className="font-serif text-2xl font-bold mb-8">Configurações</h1>
                <div className="text-center py-12 bg-card border rounded-xl">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Configurações do Blog</h3>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O post será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
