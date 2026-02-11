# Armazenamento de token (JWT) e mitigações

## Decisão atual

O frontend armazena o **JWT** em **sessionStorage** (ver `frontend/src/auth/storage.ts`). O BFF emite o token após login bem-sucedido e o frontend envia-o no header `Authorization: Bearer <token>` em pedidos autenticados.

## Riscos

- **sessionStorage** é acessível a scripts na mesma origem; em caso de **XSS** (cross-site scripting), um atacante pode roubar o token e impersonar o utilizador.
- Mitigação principal: **sanitização de HTML** no backend (MarkdownService) e no frontend (DOMPurify antes de `dangerouslySetInnerHTML`) para reduzir a superfície de XSS.

## Alternativa futura: cookies HttpOnly

Uma evolução possível é migrar para **cookies HttpOnly + SameSite=Strict** emitidos pelo BFF: o token não seria acessível a JavaScript, reduzindo o impacto de XSS. Essa alteração exigiria:

- BFF a definir um cookie com o JWT (HttpOnly, Secure em produção, SameSite=Strict).
- Frontend a enviar pedidos com `credentials: 'include'` em vez de header Authorization.
- Ajustes em CORS e em proxies (ex.: Caddy) para que o cookie seja enviado corretamente.

Esta change **não** implementa cookies HttpOnly; apenas documenta a decisão atual e a alternativa.

## Mitigações atuais

1. **Backend:** Todo o conteúdo de posts (Markdown e pass-through HTML) é sanitizado no `MarkdownService` (HtmlSanitizer) antes de ser servido.
2. **Frontend:** O conteúdo do post é sanitizado com DOMPurify antes de ser injetado em `dangerouslySetInnerHTML` (defesa em profundidade).
3. **Futuro:** Content-Security-Policy (CSP) restritiva pode ser adicionada para limitar execução de scripts inline.
