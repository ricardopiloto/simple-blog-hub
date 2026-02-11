# Tasks: apply-security-hardening

## Fase 1 — XSS e tokens

- [x] 1.1 **Backend:** Adicionar sanitização de HTML no `MarkdownService` (ex.: HtmlSanitizer): sanitizar o resultado de Markdown→HTML e sanitizar o conteúdo quando for pass-through (StartsWith("<")); garantir que script, on*, javascript: são removidos.
- [x] 1.2 **Frontend (opcional):** Adicionar DOMPurify em PostPage antes de `dangerouslySetInnerHTML` para defesa em profundidade.
- [x] 1.3 **Documentação:** Criar ou atualizar documento em docs/security com a decisão sobre armazenamento de token (sessionStorage vs cookies HttpOnly) e mitigações atuais (sanitização, CSP futura).

## Fase 2 — CORS, headers e secrets

- [x] 2.1 **BFF:** Em produção (IsProduction()), exigir Cors:AllowedOrigins configurado e não vazio; falhar arranque ou não usar AllowAnyOrigin quando vazio.
- [x] 2.2 **BFF:** Adicionar middleware de security headers (X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy); em produção com HTTPS, adicionar Strict-Transport-Security quando aplicável.
- [x] 2.3 **API:** Adicionar o mesmo middleware de security headers nas respostas.
- [x] 2.4 **BFF:** Em produção, validar que Jwt:Secret está configurado e tem comprimento >= 32 caracteres; falhar arranque caso contrário.
- [x] 2.5 **API:** Em produção, exigir API:InternalKey configurado; falhar arranque se estiver vazio ou ausente.

## Fase 3 — Uploads, validação de input e senha

- [x] 3.1 **UploadsController:** Validar magic bytes (assinatura) do ficheiro para JPEG, PNG e WebP antes de gravar; rejeitar com BadRequest se não corresponder.
- [x] 3.2 **API:** Adicionar Data Annotations aos DTOs de entrada (LoginRequest, CreateUserRequest, UpdateUserRequest, CreateOrUpdatePostRequest, etc.) e verificar ModelState.IsValid no início das actions; devolver BadRequest(ModelState) quando inválido.
- [x] 3.3 **PasswordValidation:** Alterar para mínimo 8 caracteres e exigir pelo menos uma maiúscula, uma minúscula e um dígito; atualizar mensagem de erro e testes se existirem.

## Fase 4 — Rate limiting e auditoria

- [x] 4.1 **BFF:** Implementar rate limiting (middleware ou biblioteca) para POST /bff/auth/login, POST /bff/uploads/cover e rotas /bff/users (ex.: por IP); responder 429 quando excedido.
- [x] 4.2 **API ou BFF:** Registrar em log de auditoria (quem, o quê, quando) as ações: criação de utilizador, exclusão de utilizador, reset de senha, publicação/remoção de post quando for ação administrativa; sem senhas nem tokens no log.

## Fase 5 — Infra e documentação

- [x] 5.1 **Docker:** Alterar Dockerfiles da API e do BFF para usar user não-root (criar user e USER no Dockerfile; garantir permissões para diretórios de dados/uploads).
- [x] 5.2 **Caddyfile:** Adicionar Caddyfile de exemplo ao repositório (ex.: docs/deploy ou raiz) com HTTPS, redirecionamento HTTP→HTTPS, proxy para BFF e headers de segurança.
- [x] 5.3 **Documentação:** Adicionar ou atualizar documento (ex.: em docs/security ou deploy) com lista de variáveis obrigatórias para produção e checklist de revisão antes de publicar.

## Validação

- [x] 6.1 Executar `openspec validate apply-security-hardening --strict` e corrigir falhas até passar.
