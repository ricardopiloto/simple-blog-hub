# project-docs — delta for add-version-1-6-and-update-docs

## ADDED Requirements

### Requirement: CHANGELOG e guia de atualização para a release v1.6

Para a **release versionada v1.6**, o ficheiro **CHANGELOG.md** na raiz **deve** (SHALL) conter a secção **## [1.6]** que descreve as alterações dessa versão: lista das changes OpenSpec incluídas (add-scheduled-publish-post, fix-scheduled-publish-at-missing-column, schedule-publish-toggle-show-calendar-when-on, docker-bff-upload-volume-host-public-images, hide-newsletter-section-until-implemented) com descrição breve. O repositório **pode** incluir um **guia de atualização** em `docs/local/` (ex.: `atualizar-1-4-para-1-6.md`) destinado a operadores que têm o servidor em **v1.4** e pretendem atualizar para **v1.6**, com passos que cubram migrações de base, volume de uploads do BFF, configuração do Caddy para `/images/posts/`, build do frontend e validação.

#### Scenario: Leitor consulta o CHANGELOG para a v1.6

- **Quando** um utilizador abre o CHANGELOG
- **Então** encontra a secção **## [1.6]** acima de [1.5]
- **E** vê a lista das changes (agendamento de posts, script SQL ScheduledPublishAt, toggle de agendamento, volume de uploads Docker, secção newsletter oculta)
- **E** pode usar essa informação para saber o que mudou desde a v1.5

#### Scenario: Operador em v1.4 segue o guia e atualiza para v1.6

- **Dado** que o operador tem o servidor em v1.4 (Docker + Caddy)
- **Quando** consulta o guia em docs/local/atualizar-1-4-para-1-6.md (se existir e estiver disponível)
- **Então** encontra passos para: pull/checkout, reconstruir API e BFF, build do frontend, Caddy (handle /images/posts/), scripts manuais opcionais
- **E** ao seguir os passos consegue atualizar para a v1.6 com agendamento, upload de capa a funcionar e secção newsletter oculta
