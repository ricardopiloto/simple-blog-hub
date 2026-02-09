import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { DiceIcon } from '@/components/layout/DiceIcon';

const GITHUB_REPO_URL = 'https://github.com/ricardopiloto/simple-blog-hub';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1.5 font-serif text-xl font-bold">
              <DiceIcon className="h-7 w-7 shrink-0" />
              noDado RPG
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Contos e aventuras de RPG.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Início
              </Link>
              <Link
                to="/posts"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Artigos
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear}</span>
            <span className="inline-flex items-center gap-1">
              <DiceIcon className="h-6 w-6 shrink-0" />
              noDado RPG
            </span>
            <span>. Todos os direitos reservados.</span>
          </p>
          <p className="text-xs text-muted-foreground/80">
            Ícone de dado: Delapouite,{' '}
            <a
              href="https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              game-icons.net
            </a>
            , CC BY 3.0.
          </p>
          <p className="text-xs text-muted-foreground/80">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 underline hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" aria-hidden />
              Código no GitHub
            </a>
          </p>
          <p className="text-xs text-muted-foreground/80">
            {__APP_VERSION__ === '0.0.0' ? 'Versão dev' : `Versão ${__APP_VERSION__}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
