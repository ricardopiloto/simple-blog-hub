# Design: Simplificar README e documentação

## Contexto

O README atual é longo e mistura descrição do projeto, passo a passo detalhado de configuração, tabela de variáveis de ambiente, instalação em cloud, recuperação de senha e verificação — muita informação que já existe nos guias **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** e **EXPOR-DB-NO-HOST.md**. O objetivo é tornar o README um **índice claro** em sete secções, reduzir redundância e manter os guias como fonte canónica para instalação e atualização.

## Decisões

1. **Sete secções no README**  
   Seguir exatamente a ordem pedida: explicação breve → stack → requisitos → links CHANGELOG → funcionalidades → procedimentos (com links) → estrutura de pastas. Isso permite que um novo leitor encontre rapidamente "o que é", "com o que se desenvolve", "o que preciso instalar", "onde ver o histórico de versões", "o que o blog faz", "como instalar/atualizar" e "onde está cada coisa no repo".

2. **Procedimentos = links, não duplicação**  
   A secção 6 não repete o conteúdo dos guias; lista os documentos (DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY, EXPOR-DB-NO-HOST) com uma frase cada e link. Quem precisa de passos detalhados segue o link. Opcionalmente manter um "Quick start" de 3–4 linhas (clone, install frontend, run API/BFF/frontend) no README para desenvolvimento local.

3. **Funcionalidades**  
   Manter a lista de capacidades do produto (página inicial, posts, índice da história, tema, login, área do autor, Contas, etc.) em formato conciso (bullets), sem o texto extenso atual. Alinhar com o que está em openspec/project.md (Domain Context).

4. **CHANGELOG [1.8]**  
   Nova secção no CHANGELOG para esta release; a change em si é "simplify-readme-docs-changelog-v1-8". Se existirem outras changes aplicadas após 1.7 ainda não documentadas numa versão, incluí-las na mesma secção [1.8].

5. **Spec project-docs**  
   O spec existente exige README com funcionalidades, estrutura dos serviços, stack e passo a passo. O delta desta change acrescenta que o README **deve** estar organizado nas sete secções e que os procedimentos podem ser satisfeitos por links para os guias (não é obrigatório que todo o passo a passo esteja no README, desde que os guias existam e estejam referenciados).

## Riscos e mitigações

- **Perda de informação**: Garantir que nada essencial (Admin, chave BFF–API, CORS, recuperação de senha, scripts de banco) deixa de estar acessível — ou permanece no README em forma resumida ou está nos guias com link a partir do README.
- **Consistência**: Após reescrever o README, verificar que project.md e os guias não ficam em contradição (ex.: .NET 8 em ambos, mesma estrutura de pastas).
