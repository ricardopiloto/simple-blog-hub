# Atualizar documentação para v1.6 e guia de atualização 1.4 → 1.6

## Summary

Atualizar a **documentação** do projeto com todas as alterações introduzidas **desde a versão 1.5**, agrupando-as na nova versão **1.6**, e criar um **documento de atualização** em `docs/local/` que descreve como passar do servidor em **v1.4** para esta nova versão (v1.6). Assim, quem está em 1.4 tem um guia único (migrações de base, scripts manuais, volume de uploads, Caddy) até à versão atual.

## Changes incluídas na v1.6 (desde 1.5)

- **add-scheduled-publish-post**: Publicação agendada de posts (calendário e hora no formulário Novo/Editar Post; campo `ScheduledPublishAt`; background service na API publica automaticamente à data/hora agendada).
- **fix-scheduled-publish-at-missing-column**: Script SQL manual `add_scheduled_publish_at_to_posts.sql` e documentação no README da API e em ATUALIZAR para o erro "no such column: p.ScheduledPublishAt".
- **schedule-publish-toggle-show-calendar-when-on**: Toggle "Agendar publicação" no formulário de post; calendário e hora só visíveis quando o toggle está ligado; sem toggle = publicação imediata (substitui o texto "Deixe vazio para publicação imediata").
- **docker-bff-upload-volume-host-public-images**: Volume no docker-compose (BFF) `./frontend/public/images/posts:/frontend/public/images/posts` para os uploads de capa ficarem no host; Caddy deve servir esse diretório em `/images/posts/` (handle no Caddyfile).
- **hide-newsletter-section-until-implemented**: Secção "Fique por dentro" na página inicial oculta até a funcionalidade de newsletter estar implementada.

(Nota: clarify-empty-schedule-means-immediate-publish foi supersedida por schedule-publish-toggle-show-calendar-when-on.)

## Goals

1. **CHANGELOG.md**: Adicionar secção **## [1.6]** acima de [1.5] com a lista das changes acima e descrição breve de cada uma.
2. **README.md**: Incluir **v1.6** nas referências a tags de versão (ex.: "v1.3, v1.4, v1.5, v1.6") onde aplicável.
3. **docs/local/atualizar-1-4-para-1-6.md**: Criar documento de atualização que descreve os passos para levar um servidor que está em **v1.4** até à **v1.6**: pull/checkout; reconstruir API (nova migração ScheduledPublishAt e background service); reconstruir BFF (volume de uploads); frontend build e cópia; Caddyfile (adicionar handle `/images/posts/*` e, se ainda não tiver, sitemap/robots); scripts manuais (opcional, se não reconstruir: `add_scheduled_publish_at_to_posts.sql`); validação pós-atualização.

## Out of scope

- Alterar código de funcionalidades; apenas documentação e ficheiro de guia local.
- Criar tag git v1.6 (fica a cargo do maintainer).

## Success criteria

- CHANGELOG contém [1.6] com as alterações listadas.
- README menciona v1.6 nas versões.
- docs/local/atualizar-1-4-para-1-6.md existe e permite a um operador em v1.4 seguir os passos até v1.6 (incl. migração, volume BFF, Caddy /images/posts/).
- `openspec validate add-version-1-6-and-update-docs --strict` passa.
