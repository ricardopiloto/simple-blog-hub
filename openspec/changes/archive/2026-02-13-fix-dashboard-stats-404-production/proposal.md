# Proposal: Corrigir 404 em GET /bff/dashboard/stats em produção

## Summary

Em produção, o pedido **GET https://blog.1nodado.com.br/bff/dashboard/stats** devolve **HTTP 404**, impedindo o carregamento do dashboard da área do autor. As causas prováveis são: (1) o proxy reverso (Caddy ou outro) reencaminha para o BFF **removendo o prefixo /bff** do path, pelo que o BFF recebe GET /dashboard/stats e não encontra rota (o BFF expõe apenas /bff/dashboard/stats); (2) a imagem do BFF em produção ser antiga e não incluir o `DashboardController`. Este change torna o endpoint de estatísticas do dashboard **acessível tanto com o path completo /bff/dashboard/stats como com /dashboard/stats**, de forma a que funcione quer o proxy reenvie o path completo quer faça strip do prefixo /bff. Opcionalmente documenta verificação e troubleshooting (imagem BFF atualizada; proxy não deve fazer strip salvo se o BFF aceitar ambos os paths).

## Goals

- **Dashboard carrega em produção**: GET ao endpoint de estatísticas do dashboard (com path /bff/dashboard/stats ou /dashboard/stats) SHALL devolver 200 (com payload JSON) quando o utilizador está autenticado, e 401 quando não está; nunca 404 quando o path chega ao BFF como /bff/dashboard/stats ou /dashboard/stats.
- **Compatibilidade**: O frontend continua a pedir bff/dashboard/stats (URL relativa ao BFF base); o proxy pode reencaminhar com path completo ou com strip; o BFF responde em ambos os casos.

## Scope

- **In scope**: (1) No BFF, fazer o `DashboardController` responder tanto a /bff/dashboard/stats como a /dashboard/stats (ex.: segundo atributo `[Route("[controller]")]` além do existente `[Route("bff/[controller]")]`). (2) Opcional: em docs de deploy ou atualização (ex.: atualizar-1-9-para-2-0.md ou PRODUCTION-CHECKLIST), adicionar nota de troubleshooting: se o dashboard não carregar (404 em /bff/dashboard/stats), verificar que a imagem do BFF foi reconstruída com a versão que inclui o dashboard e que o proxy reencaminha /bff/* para o BFF; com este change, o BFF aceita também /dashboard/stats caso o proxy faça strip do prefixo.
- **Out of scope**: Alterar outros controllers do BFF; alterar Caddyfile.example (o exemplo já reencaminha /bff/* sem strip); alterar o frontend (continua a usar bff/dashboard/stats).

## Affected code and docs

- **backend/bff/Controllers/DashboardController.cs**: Adicionar segundo `[Route("[controller]")]` para que o mesmo controller responda a /dashboard/stats além de /bff/dashboard/stats.
- **docs/local/atualizar-1-9-para-2-0.md** ou **docs/security/PRODUCTION-CHECKLIST.md** (opcional): Breve nota de troubleshooting para 404 no dashboard (confirmar imagem BFF e configuração do proxy).

## Dependencies and risks

- **Nenhum**: Alteração localizada; rotas adicionais não expõem novos comportamentos (o mesmo endpoint, mesma autorização). Em ambientes onde o proxy já envia o path completo, o comportamento mantém-se.

## Success criteria

- GET /bff/dashboard/stats e GET /dashboard/stats no BFF (com JWT válido) devolvem 200 e o payload de estatísticas; sem JWT devolvem 401.
- Em produção, após deploy da nova imagem do BFF, o dashboard da área do autor carrega sem 404 no pedido a /bff/dashboard/stats (ou o operador pode configurar o proxy para enviar /dashboard/stats e o BFF responde).
- `openspec validate fix-dashboard-stats-404-production --strict` passa.
