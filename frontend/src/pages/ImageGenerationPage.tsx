import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCurrentUser } from '@/api/client';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { AlertCircle, ImageIcon } from 'lucide-react';

function CredentialsWarning() {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-6 flex gap-4">
      <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-3">
        <p className="text-foreground">
          Para gerar imagens, configure o <strong>Account ID</strong> e o <strong>API Token</strong> da sua conta
          Cloudflare Workers AI em Contas.
        </p>
        <p className="text-sm text-muted-foreground">
          Cada autor usa a própria conta Cloudflare; o blog não armazena nem expõe o seu API Token.
        </p>
        <Button asChild variant="outline">
          <Link to="/area-autor/contas">Ir para Contas</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const { isLoading, imageBase64, error, generate } = useImageGeneration();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: fetchCurrentUser,
  });

  const hasCredentials =
    !!profile?.cloudflare_account_id?.trim() && profile.has_cloudflare_api_token === true;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await generate(prompt);
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/area-autor">← Voltar à área do autor</Link>
          </Button>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            Geração de Imagem
          </h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Descreva a cena ou personagem em texto e gere uma imagem com Cloudflare Workers AI (Flux Schnell).
            A imagem é exibida aqui no browser e não é guardada no servidor — use-a como capa ou ilustração nos seus posts.
          </p>

          {profileLoading ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : !hasCredentials ? (
            <CredentialsWarning />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-prompt">Prompt</Label>
                <Textarea
                  id="image-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex.: Um cavaleiro élfico sob luz de lua em estilo aquarela, floresta mística ao fundo"
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Gerando…' : 'Gerar Imagem'}
              </Button>

              <div className="min-h-[280px] rounded-lg border bg-muted/30 flex items-center justify-center p-4">
                {isLoading ? (
                  <div className="w-full max-w-md space-y-3">
                    <Skeleton className="h-64 w-full rounded-md" />
                    <p className="text-sm text-muted-foreground text-center">Aguarde, a Cloudflare está gerando a imagem…</p>
                  </div>
                ) : imageBase64 ? (
                  <img
                    src={`data:image/png;base64,${imageBase64}`}
                    alt="Imagem gerada a partir do prompt"
                    className="max-w-full max-h-[480px] rounded-md shadow-md"
                  />
                ) : error ? (
                  <p className="text-destructive text-center max-w-md">{error}</p>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">
                    A imagem gerada aparecerá aqui.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
