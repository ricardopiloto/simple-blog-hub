# Script SQL para coluna StoryType, documentação das alterações e atualização do CHANGELOG

## Summary

Criar o **script SQL manual** para adicionar a coluna **StoryType** à tabela Posts (para upgrades em que a migração EF Core não foi aplicada); **documentar** essa alteração e o erro associado no README da API e, se aplicável, em guias de atualização; e **atualizar o CHANGELOG** com uma nova secção de versão (ex.: [1.7]) que liste todas as alterações aplicadas desde a última versão documentada (ex.: 1.6), incluindo a funcionalidade de tipo de história (Velho Mundo / Idade das Trevas), o toggle no Índice da História, o campo História como toggle e obrigatório no formulário de post, e outras changes relevantes.

## Goals

1. **Script SQL**: Criar em `backend/api/Migrations/Scripts/add_story_type_to_posts.sql` um script que adiciona a coluna `StoryType` (TEXT NOT NULL DEFAULT 'velho_mundo') à tabela `Posts`, equivalente à migração EF Core `AddStoryTypeToPost`. Instruções no próprio script: executar uma vez; se a coluna já existir, o SQLite devolverá erro e pode ignorar.
2. **Documentação na API**: No README da API (`backend/api/README.md`), na secção "Migrações manuais (upgrade)", adicionar um parágrafo que referencia o script `add_story_type_to_posts.sql` para a coluna StoryType (tipo de história do post). Na secção "Troubleshooting", adicionar entrada para o erro "no such column: p.StoryType" (ou "no such column: StoryType") com passos de resolução (reconstruir/restart da API ou executar o script manualmente).
3. **CHANGELOG**: Atualizar o `CHANGELOG.md` na raiz do repositório com uma nova secção de versão (ex.: **[1.7]**) que liste as changes OpenSpec aplicadas desde a 1.6, incluindo pelo menos: add-post-story-type-velho-mundo-idade-das-trevas (campo obrigatório História no post; coluna StoryType); add-story-index-universe-toggle (toggle Velho Mundo / Idade das Trevas no Índice da História); post-edit-historia-field-toggle-ui (campo História como toggle no formulário); clarify-historia-required-in-post-edit (label "História (obrigatório)"); disable-auto-excerpt-when-editing-post (resumo não atualiza ao editar); e esta change (script SQL para StoryType e documentação). A lista exata pode ser ajustada conforme as changes que forem consideradas parte desta release.
4. **Documentação de atualização (opcional)**: Se existir guia em `docs/local/` para atualização entre versões (ex.: 1.4 → 1.6), criar ou atualizar um guia que inclua a nova migração/script StoryType e a reconstrução da API quando aplicável (ex.: atualizar 1.6 → 1.7).

## Out of scope

- Alterar o código da API ou do BFF além do que já foi feito nas changes de StoryType.
- Adicionar novas funcionalidades; apenas documentar e fornecer o script de upgrade.

## Success criteria

- Existe o ficheiro `backend/api/Migrations/Scripts/add_story_type_to_posts.sql` com o ALTER TABLE adequado e comentários de uso.
- O README da API descreve o script e inclui troubleshooting para "no such column: p.StoryType".
- O CHANGELOG tem uma secção [1.7] (ou o número de versão acordado) com a lista das changes aplicadas.
- Opcionalmente, um guia de atualização em docs/local menciona a migração StoryType e os passos para atualizar.
- `openspec validate add-story-type-script-docs-changelog --strict` passa.
