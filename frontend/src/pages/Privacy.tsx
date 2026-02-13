import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  useEffect(() => {
    document.title = "Política de Privacidade — 1noDado RPG";
    return () => {
      document.title = "1noDado RPG";
    };
  }, []);

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <div>
              <p className="text-foreground/90">
                O 1noDado RPG é um blog de contos e aventuras de RPG. Esta política descreve como tratamos os seus dados ao utilizar o site, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Responsável</h2>
              <p>
                O responsável pelo tratamento dos dados é a equipe do 1noDado RPG. Para dúvidas sobre privacidade, entre em contato através do e-mail disponível no site.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Dados que coletamos</h2>
              <p className="mb-2">
                <strong className="text-foreground">Leitores:</strong> dados de navegação (endereço IP, tipo de navegador, páginas visitadas) na medida em que o servidor ou infraestrutura os registre; cookies técnicos se existirem (ex.: preferência de tema claro/escuro em localStorage).
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Finalidade</h2>
              <p>
                Operar o blog; permitir leitura pública dos contos; autenticação e gestão da área de autores; eventual melhoria da experiência (ex.: tema claro/escuro).
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Base legal (LGPD)</h2>
              <p>
                Prestação do serviço e gestão de contas de autores, nos termos da LGPD (Lei 13.709/2018). Quando aplicável, utilizamos execução do contrato ou de procedimento preliminar, consentimento (ex.: cookies não essenciais, se existirem) e cumprimento de obrigação legal.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Cookies e tecnologias similares</h2>
              <p>
                O site pode usar apenas cookies técnicos ou localStorage para preferências (ex.: tema claro/escuro). Não utilizamos cookies de terceiros ou analytics; o uso é mínimo e técnico.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Compartilhamento de dados</h2>
              <p>
                Não vendemos dados. Dados podem ser processados por serviços de hospedagem ou infraestrutura necessários ao funcionamento do site; exigimos que esses prestadores respeitem a confidencialidade e a lei aplicável (incluindo a LGPD).
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Direitos do usuário (LGPD)</h2>
              <p className="mb-2">
                Nos termos da LGPD (Lei 13.709/2018), você tem direito a: acesso, correção, eliminação, portabilidade e revogação do consentimento (quando aplicável); oposição e limitação do tratamento; informação sobre compartilhamento e não consentimento.
              </p>
              <p>
                Esses direitos podem ser exercidos através do contato indicado. A ANPD (Autoridade Nacional de Proteção de Dados) é a autoridade nacional para questões relativas à LGPD.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Retenção</h2>
              <p>
                Conservamos os dados enquanto a conta existir; logs são mantidos por um período limitado. Após eliminação da conta, mantemos apenas o estritamente necessário para obrigações legais.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Alterações</h2>
              <p>
                Esta política pode ser atualizada. Alterações relevantes serão comunicadas por aviso no site ou por e-mail aos autores cadastrados.
              </p>
            </div>

            <div>
              <p className="text-sm">
                Os contos e aventuras publicados neste blog são obra ficcional. Os dados pessoais dos visitantes e autores são tratados conforme esta política.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
