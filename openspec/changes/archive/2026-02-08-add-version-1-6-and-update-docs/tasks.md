# Tasks: add-version-1-6-and-update-docs

## 1. CHANGELOG

- [x] 1.1 Em **CHANGELOG.md**, adicionar secção **## [1.6]** (acima de [1.5]) com as alterações desta release: add-scheduled-publish-post, fix-scheduled-publish-at-missing-column, schedule-publish-toggle-show-calendar-when-on, docker-bff-upload-volume-host-public-images, hide-newsletter-section-until-implemented; descrição breve por change.

## 2. README

- [x] 2.1 Em **README.md**, atualizar a frase que lista as tags de versão para incluir **v1.6** (ex.: "v1.3, v1.4, v1.5, v1.6").

## 3. Guia de atualização 1.4 → 1.6

- [x] 3.1 Criar **docs/local/atualizar-1-4-para-1-6.md** com: contexto (servidor em v1.4 → v1.6); placeholders REPO_DIR, SEU_DOMINIO; resumo do que muda na v1.6 (agendamento, toggle, upload de capa com volume, secção newsletter oculta, nova migração e script SQL); passos numerados: 1) git pull/checkout v1.6, 2) backend Docker (reconstruir API e BFF — migração ScheduledPublishAt, volume BFF para uploads), 3) frontend build e cópia, 4) Caddy (adicionar handle /images/posts/* se ainda não tiver; referência ao DEPLOY-DOCKER-CADDY), 5) scripts manuais (add_scheduled_publish_at_to_posts.sql se necessário), 6) validação (login, agendamento, upload de capa); tabela resumo; referências a ATUALIZAR-SERVIDOR-DOCKER-CADDY, DEPLOY-DOCKER-CADDY, CHANGELOG.

## 4. Spec delta

- [x] 4.1 Em **openspec/changes/add-version-1-6-and-update-docs/specs/project-docs/spec.md**, ADDED requirement: para a release v1.6, o CHANGELOG deve ter a secção [1.6] com as changes listadas; o repositório pode incluir um guia de atualização em docs/local/ (ex.: atualizar-1-4-para-1-6.md) para operadores que partem da v1.4. Incluir cenário: leitor consulta CHANGELOG e encontra [1.6]; operador em v1.4 segue o guia e atualiza para v1.6.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-version-1-6-and-update-docs --strict` e corrigir falhas.
