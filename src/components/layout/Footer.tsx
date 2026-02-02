import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="font-serif text-xl font-bold">
              Blog
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Compartilhando ideias, histórias e conhecimento com o mundo.
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

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Blog. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
