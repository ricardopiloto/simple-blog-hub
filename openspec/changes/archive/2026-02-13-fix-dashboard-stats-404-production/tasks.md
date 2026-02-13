# Tasks: fix-dashboard-stats-404-production

## 1. BFF: aceitar /dashboard/stats além de /bff/dashboard/stats

- [x] 1.1 Em `backend/bff/Controllers/DashboardController.cs`, além do atributo existente `[Route("bff/[controller]")]`, adicionar `[Route("[controller]")]` para que o controller responda também ao path /dashboard/stats (quando o proxy reverso faz strip do prefixo /bff).

## 2. Documentação de troubleshooting (opcional)

- [x] 2.1 Em `docs/local/atualizar-1-9-para-2-0.md` (secção Verificação ou nova secção Troubleshooting) ou em `docs/security/PRODUCTION-CHECKLIST.md`, adicionar nota: se o dashboard da área do autor não carregar e o browser mostrar 404 em GET /bff/dashboard/stats, verificar (1) que a imagem do BFF foi reconstruída com a versão que inclui o dashboard (v2.0); (2) que o proxy reverso reencaminha /bff/* para o BFF; com a correção aplicada, o BFF aceita também pedidos a /dashboard/stats caso o proxy remova o prefixo /bff.

## 3. Validação

- [x] 3.1 Executar `openspec validate fix-dashboard-stats-404-production --strict` e corrigir eventuais falhas.
- [x] 3.2 Confirmar localmente que GET /bff/dashboard/stats e GET /dashboard/stats (com e sem JWT) se comportam como esperado (200 com auth, 401 sem auth).
