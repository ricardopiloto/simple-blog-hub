import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/api/client';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/area-autor" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (!result) {
        setError('E-mail ou senha incorretos.');
        return;
      }
      setAuth(result.token, {
        id: result.author.id,
        name: result.author.name,
        avatar: result.author.avatar ?? null,
        bio: result.author.bio ?? null,
        is_admin: result.is_admin,
      }, result.user_id, result.must_change_password);
      navigate('/area-autor', { replace: true });
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-md mx-auto">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2 text-center">
            Área do autor
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Entre com seu e-mail e senha para publicar e editar artigos.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
