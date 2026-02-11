# Tasks: harden-login-credentials-exposure

## 1. Documentação

- [x] 1.1 No README e em docs/deploy (DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY) e docs/database (EXPOR-DB-NO-HOST), substituir todas as ocorrências da senha padrão em texto claro por referência genérica (ex.: "senha padrão inicial" ou "default password") e acrescentar que em produção o operador **deve** configurar Admin__Email e **deve** alterar a senha no primeiro acesso.
- [x] 1.2 Manter referência ao e-mail padrão do Admin (admin@admin.com) apenas como "e-mail quando não configurado", com aviso para produção; não remover a informação necessária para desenvolvimento local e recuperação de senha, mas não expor a senha literal em documentação versionada.

## 2. Configuração versionada

- [x] 2.1 Em backend/api/appsettings.json, garantir que não há e-mail ou credenciais reais: usar placeholder (ex.: admin@example.com) ou remover Admin:Email do exemplo commitado; documentar no README da API que em produção se usa variável de ambiente (Admin__Email) ou ficheiro não versionado.

## 3. Frontend

- [x] 3.1 Em frontend/src/api/types.ts, no comentário de CreateUserPayload (campo password), remover a string literal da senha padrão; usar texto genérico (ex.: "quando omitido, a API usa uma senha inicial padrão; o utilizador deve alterá-la no primeiro acesso").

## 4. Spec delta security-hardening

- [x] 4.1 Criar openspec/changes/harden-login-credentials-exposure/specs/security-hardening/spec.md com secção **## ADDED Requirements** contendo: (a) documentação versionada acessível à internet não deve conter a senha padrão em texto claro; (b) documentação de produção deve exigir Admin__Email e alteração da senha no primeiro acesso; (c) ficheiros de configuração versionados não devem conter credenciais reais; (d) frontend não deve incluir a senha padrão em código/comentários servidos ao cliente; (e) endpoints de login devem devolver a mesma resposta genérica (ex.: 401) para utilizador inexistente e senha incorreta. Pelo menos um **#### Scenario:** por requisito.

## 5. Validação

- [x] 5.1 Executar `openspec validate harden-login-credentials-exposure --strict` e corrigir falhas até passar.
