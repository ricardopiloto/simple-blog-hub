# Tasks: add-post-story-type-velho-mundo-idade-das-trevas

## 1. API – modelo e persistência

- [x] 1.1 Em `backend/api/Models/Post.cs`, adicionar a propriedade `StoryType` (string, NOT NULL; valores `velho_mundo` ou `idade_das_trevas`).
- [x] 1.2 Criar migração EF Core que adiciona a coluna `StoryType` à tabela `Posts` com valor default `velho_mundo` para linhas existentes (NOT NULL).
- [x] 1.3 Em `PostDto` e `CreateOrUpdatePostRequest`, adicionar `story_type` (JSON snake_case); em `CreateOrUpdatePostRequest` o campo é obrigatório para create/update.
- [x] 1.4 No `PostsController` (create e update), validar que `request.StoryType` é um dos dois valores permitidos; caso contrário, retornar 400 com mensagem de validação. Mapear o valor para a entidade ao criar/atualizar e no DTO de resposta.

## 2. BFF

- [x] 2.1 Garantir que o BFF repassa o body do create/update de posts para a API sem alteração (pass-through); o novo campo `story_type` será enviado pelo frontend e aceite pela API. Confirmar que a resposta da API (com `story_type`) é devolvida ao frontend.

## 3. Frontend – tipos e cliente

- [x] 3.1 Em `frontend/src/api/types.ts`, adicionar ao tipo `Post` o campo `story_type: 'velho_mundo' | 'idade_das_trevas'` e ao `CreateOrUpdatePostPayload` o campo obrigatório `story_type: 'velho_mundo' | 'idade_das_trevas'`.
- [x] 3.2 No cliente (ex.: `createPost` / `updatePost`), incluir `story_type` no payload enviado ao BFF (já coberto pelo tipo e pelo uso do objeto no formulário).

## 4. Frontend – formulário PostEdit

- [x] 4.1 Em `frontend/src/pages/PostEdit.tsx`, adicionar estado para `storyType` (ex.: `'' | 'velho_mundo' | 'idade_das_trevas'`). Em novo post, estado inicial vazio (nenhuma opção selecionada). Ao carregar post para edição, preencher com `post.story_type`.
- [x] 4.2 Inserir **antes** do campo "Título" um controlo de seleção (select ou radio group) com as opções "Velho Mundo" (`velho_mundo`) e "Idade das Trevas" (`idade_das_trevas`), com label visível (ex.: "História" ou "Tipo de história"). Não pré-selecionar nenhuma opção em novo post.
- [x] 4.3 Na submissão do formulário, validar que `storyType` é um dos dois valores; se estiver vazio, impedir o envio e indicar ao utilizador que deve selecionar (ex.: mensagem de erro ou atributo `required`/validação inline). Incluir `story_type` no payload de create e update.

## 5. Spec delta

- [x] 5.1 Em `openspec/changes/add-post-story-type-velho-mundo-idade-das-trevas/specs/post-edit-form/spec.md`, ADDED requirement: o formulário Novo post e Editar post deve incluir um campo obrigatório (antes do Título) para seleção da história: "Velho Mundo" ou "Idade das Trevas", sem valor pré-definido; o utilizador deve ser obrigado a selecionar antes de guardar. Incluir cenários: novo post sem seleção (não permite guardar); novo post com seleção (guarda com valor); editar post (valor guardado é exibido e pode ser alterado).

## 6. Validação

- [x] 6.1 Executar `openspec validate add-post-story-type-velho-mundo-idade-das-trevas --strict` e corrigir falhas.
