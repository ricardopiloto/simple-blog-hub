import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import Posts from "./pages/Posts";
import PostPage from "./pages/PostPage";
import StoryIndex from "./pages/StoryIndex";
import Login from "./pages/Login";
import AreaAutor from "./pages/AreaAutor";
import AreaContas from "./pages/AreaContas";
import PostEdit from "./pages/PostEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/indice" element={<StoryIndex />} />
            <Route path="/login" element={<Login />} />
            <Route path="/area-autor" element={<ProtectedRoute><AreaAutor /></ProtectedRoute>} />
            <Route path="/area-autor/contas" element={<AdminRoute><AreaContas /></AdminRoute>} />
            <Route path="/area-autor/posts/novo" element={<ProtectedRoute><PostEdit /></ProtectedRoute>} />
            <Route path="/area-autor/posts/:id/editar" element={<ProtectedRoute><PostEdit /></ProtectedRoute>} />
            <Route path="/area-autor/posts" element={<Navigate to="/area-autor" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
