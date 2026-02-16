import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  useEffect(() => {
    document.title = "Termos de Uso — 1noDado RPG";
    return () => {
      document.title = "1noDado RPG";
    };
  }, []);

  return (
    <Layout>
      <section className="py-16">
        <div className="container-wide max-w-3xl">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Termos de Uso
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Aceitação</h2>
              <p>
                Ao acessar e utilizar o site, o usuário aceita estes termos. Se não concordar, não deve utilizar o site.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Natureza do serviço</h2>
              <p>
                O 1noDado RPG é um blog de contos e aventuras de RPG para leitura pública. O site permite ainda a autores autenticados publicar e gerenciar seus textos e contas na área do autor.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Propriedade intelectual e licenciamento</h2>
              <p className="mb-2">
                <strong className="text-foreground">Código do projeto:</strong> O código-fonte do repositório deste projeto está licenciado sob a licença MIT. Pode ser consultado no repositório indicado no footer (GitHub).
              </p>
              <p className="mb-2">
                <strong className="text-foreground">Conteúdo dos posts:</strong> Os contos, textos e imagens publicados pelos autores são da responsabilidade dos respectivos autores. O operador do site não reclama propriedade sobre o conteúdo criado pelos usuários; os autores mantêm os direitos sobre suas obras, salvo disposição em contrário (ex.: se um autor declarar licença específica no próprio post).
              </p>
              <p>
                <strong className="text-foreground">Marca e identidade visual:</strong> O nome "1noDado RPG", o logo e outros elementos de identidade do site são do responsável pelo blog.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Condutas permitidas</h2>
              <p>
                Utilizar o site para leitura, compartilhamento de links e uso da área de autor nos termos previstos (publicar, editar, gerenciar a própria conta).
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Condutas proibidas</h2>
              <p>
                É proibido: usar o site para fins ilegais; tentar acessar áreas restritas sem autorização; copiar ou republicar em massa o conteúdo sem autorização dos autores; prejudicar a disponibilidade ou segurança do site; usar bots ou scraping de forma abusiva.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Área do autor</h2>
              <p>
                Os autores são responsáveis pelo que publicam. A conta é pessoal; não compartilhe credenciais. O operador reserva-se o direito de remover conteúdo que viole os termos ou a lei e de suspender ou encerrar contas em caso de abuso.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Links externos</h2>
              <p>
                O site pode conter links para sites de terceiros; não nos responsabilizamos pelo conteúdo ou práticas de privacidade desses sites.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Limitação de responsabilidade</h2>
              <p>
                O site é prestado "como está". O operador não se responsabiliza por danos indiretos ou consequentes decorrentes do uso ou da impossibilidade de uso do site, dentro dos limites permitidos pela lei aplicável.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-semibold text-foreground text-lg mb-2">Alterações aos termos</h2>
              <p>
                Os termos podem ser alterados; a continuação do uso após alterações constitui aceitação. Alterações relevantes podem ser comunicadas no site ou aos autores cadastrados.
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
