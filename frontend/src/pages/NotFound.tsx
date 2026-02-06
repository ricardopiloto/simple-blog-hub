import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Página não encontrada
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
