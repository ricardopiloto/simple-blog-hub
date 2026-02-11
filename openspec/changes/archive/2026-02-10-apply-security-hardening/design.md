# Design: Aplicação do security hardening

## 1. Sanitização de HTML (Fase 1)

- **Decisão:** Sanitização no **backend** (MarkdownService) como fonte única de verdade, para que todo o conteúdo servido ao cliente (incluindo pass-through HTML) seja seguro. Opcionalmente **frontend** (DOMPurify antes de `dangerouslySetInnerHTML`) como defesa em profundidade.
- **Implementação backend:** Usar uma biblioteca .NET de sanitização HTML (ex.: [HtmlSanitizer](https://github.com/mganss/HtmlSanitizer)) no `MarkdownService`: (a) quando o conteúdo começa com `<` (pass-through), sanitizar antes de devolver; (b) quando o conteúdo é Markdown, converter com Markdig e sanitizar o HTML resultante. Lista de tags/atributos permitidos alinhada à leitura de posts (p, h1–h6, strong, em, a, ul, ol, li, blockquote, code, pre, img, etc.; remover script, iframe, on*, javascript:).
- **Implementação frontend (opcional):** Instalar DOMPurify e em PostPage fazer `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}` para reduzir risco se o backend falhar.

## 2. CORS e validação de secrets (Fase 2)

- **CORS:** A verificação "em produção exige Cors:AllowedOrigins" deve usar `IHostEnvironment.IsProduction()`. Em desenvolvimento, manter AllowAnyOrigin para facilitar localhost. Em produção, se `Cors:AllowedOrigins` estiver vazio ou null, falhar o arranque (throw ou não registar CORS e deixar um middleware que falhe no primeiro pedido com mensagem clara).
- **Secrets:** Validação apenas quando `IsProduction()`: Jwt:Secret com comprimento >= 32; API:InternalKey não vazio. Em desenvolvimento, manter fallbacks atuais para não quebrar quick start sem .env.

## 3. Security headers

- **Onde:** Middleware no pipeline do BFF (e da API, se a API for exposta atrás de um proxy que não adicione headers). Headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` (ou strict-origin). HSTS: adicionar `Strict-Transport-Security` apenas em produção quando o esquema for HTTPS (pode ser condicionado a config ou a um header do proxy).

## 4. Uploads — magic bytes

- **Assinaturas:** JPEG (FF D8 FF), PNG (89 50 4E 47 0D 0A 1A 0A), WebP (RIFF....WEBP). Ler os primeiros bytes do stream do ficheiro (sem depender de Content-Type) e rejeitar se não corresponder a nenhum dos formatos permitidos.

## 5. Rate limiting

- **Abordagem:** Middleware ou extensão no BFF (ex.: AspNetCoreRateLimit ou middleware custom por IP). Regras: limite mais baixo para POST /bff/auth/login (ex.: N por minuto por IP); limite para POST /bff/uploads/cover; limite para rotas /bff/users (admin). Resposta 429 Too Many Requests quando excedido.

## 6. Auditoria

- **Onde:** API (onde estão as ações) ou BFF (onde passam os pedidos). Registrar: ação (ex.: UserCreated, UserDeleted, PasswordReset, PostPublished, PostDeleted), identificador do autor/admin que fez a ação, identificador do alvo (user id, post id) quando aplicável, timestamp. Sem senhas, tokens ou dados sensíveis no log. Formato estruturado (ex.: ILogger com named scope ou campos) para permitir análise.

## 7. Docker e Caddyfile

- **Docker:** Criar user não-root no Dockerfile (ex.: adduser) e usar USER no final; garantir que o diretório de dados e de uploads é gravável por esse user.
- **Caddyfile:** Ficheiro de exemplo em docs/deploy ou na raiz (ex.: Caddyfile.example) com server block HTTPS, redirecionamento HTTP→HTTPS, proxy para BFF, headers de segurança e servir estáticos/frontend.
