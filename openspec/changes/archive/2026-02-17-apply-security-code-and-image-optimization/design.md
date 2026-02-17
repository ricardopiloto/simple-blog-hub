# Design: apply-security-code-and-image-optimization

## 1. Content-Security-Policy (CSP)

- **Onde aplicar:** No **BFF** (middleware em Program.cs), para que todas as respostas do BFF (incluindo as que o Caddy reencaminha) possam levar o header. Alternativa seria configurar no Caddy; colocar no BFF mantém a configuração junto da aplicação e permite valores por ambiente (Development vs Production).
- **Configuração:** Duas chaves opcionais em appsettings: `Security:CspHeader` (valor do header, ex.: `default-src 'self'; script-src 'self'`) e `Security:CspReportOnly` (boolean; se true, enviar como `Content-Security-Policy-Report-Only`). Se `Security:CspHeader` estiver vazio ou ausente, o middleware não adiciona nenhum header CSP. Assim, em desenvolvimento não é obrigatório definir CSP e em produção o operador pode começar com Report-Only para validar antes de ativar enforcement.
- **Conteúdo da política:** O frontend usa Vite; em produção os scripts e estilos vêm do mesmo origin (build estático). Uma política mínima segura pode ser `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'` (Tailwind/shadcn podem usar inline styles). O documento em docs/deploy descreve exemplos e como relaxar (ex.: 'unsafe-inline' para scripts só se necessário para ferramentas de dev).

## 2. Processamento de imagens no upload (BFF)

- **Biblioteca:** **SixLabors.ImageSharp** — suportada, mantida e usada em .NET para leitura/redimensionamento/compressão de JPEG, PNG e WebP. Alternativas (ex.: System.Drawing) são menos adequadas em contexto cross-platform e headless.
- **Fluxo:** Após validação por magic bytes (existente), abrir o stream com ImageSharp; redimensionar mantendo proporção (largura máxima configurável, ex.: 1200 px); codificar com qualidade configurável (JPEG 85%, PNG/WebP com compressão). Gravar um único ficheiro (nome GUID + extensão). Não gerar thumbnail nesta change para manter o scope pequeno; pode ser extensão futura.
- **Configuração:** `Uploads:MaxWidth` (int, default 1200); `Uploads:JpegQuality` (int 1–100, default 85). Para PNG/WebP, usar níveis de compressão equivalentes quando a API ImageSharp o permitir (ex.: PngEncoder com nível de compressão).
- **Formato de saída:** Manter a extensão original (jpg/png/webp) para não quebrar clientes que esperam o mesmo tipo; a qualidade é reduzida. Opcionalmente, em mudança futura, converter tudo para WebP para menor tamanho.

## 3. Lazy loading (frontend)

- **Onde lazy:** Componentes que renderizam listas de capas (abaixo da dobra): PostCard, Posts (lista de cards), StoryIndex (cards na grelha e na lista arrastável). Atributo HTML `loading="lazy"` é suficiente; não é necessário Intersection Observer para este caso.
- **Onde eager:** FeaturedPost (destaque na home) e a capa principal em PostPage (topo do artigo) — mantêm carregamento imediato para LCP e experiência acima da dobra. Autor avatar em PostPage pode manter sem lazy (área pequena).

## 4. API — Data Annotations e ModelState

- **AddCollaboratorRequest:** Adicionar `[Required]` em AuthorId. AddCollaborator já valida Guid; com ModelState.IsValid rejeitamos pedidos sem body ou com author_id vazio antes de chegar à lógica.
- **StoryOrderItemRequest:** Adicionar `[Required]` em Id; StoryOrder pode ter Range(0, int.MaxValue) ou deixar como está (número). UpdateStoryOrder hoje não chama ModelState; adicionar verificação no início e BadRequest(ModelState) quando inválido.
- **CreateUserRequest:** Password é nullable (string?); para criação de utilizador a senha é obrigatória. Adicionar `[Required]` em Password em CreateUserRequest (o endpoint é só para create).
- **Limite de corpo:** Fora do scope desta change; pode ser tratado em change futura (Kestrel request body limit ou middleware).

## 5. Documentação de auditoria e logs

- **Auditoria de dependências:** Secção curta no README ou em docs/security (ex.: SECURITY-ASSESSMENT-FOLLOW-UP.md já existe; podemos adicionar parágrafo “Como verificar vulnerabilidades”) com comandos: `dotnet list package --vulnerable` (em backend/api e backend/bff), `npm audit` (em frontend). Sem CI automático nesta change.
- **Revisão de logs:** Referência no mesmo documento ou em PRODUCTION-CHECKLIST: garantir que nenhum log inclui senhas, JWT ou corpo de login; revisar ILogger em AuthController, BFF auth proxy, etc. Implementação pode ser apenas checklist/documentação; alterações de código só se forem encontrados pontos que registem dados sensíveis.

## 6. Documento docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md

- **Conteúdo:** (1) **CSP:** Descrição de Security:CspHeader e Security:CspReportOnly; exemplo de política mínima; como testar em Report-Only primeiro; variáveis de ambiente (Security__CspHeader, Security__CspReportOnly). (2) **Imagens:** Uploads:MaxWidth, Uploads:JpegQuality; comportamento antes/depois (ficheiro original vs. otimizado); onde configurar (appsettings ou bff.env). (3) **Auditoria:** Comandos dotnet e npm; onde correr; referência a SECURITY-ASSESSMENT-FOLLOW-UP e CODE-OPTIMIZATION / IMAGE-OPTIMIZATION. (4) Opcional: nota de que operadores podem copiar o conteúdo para docs/local para manter valores específicos do servidor (docs/local está no .gitignore).
