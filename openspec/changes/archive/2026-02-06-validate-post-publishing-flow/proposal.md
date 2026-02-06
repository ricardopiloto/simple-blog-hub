# Change: Validar fluxo de postagens – posts publicados na página inicial e no índice

## Why

O utilizador (Admin) criou postagens que **não aparecem** na página inicial nem no índice. O sistema está desenhado para que apenas posts com **Publicado** (`published === true`) figurem nas listas públicas (início e índice). Se o formulário de novo post tiver "Publicado" por defeito desmarcado, os posts são guardados como rascunho e não surgem nessas páginas, o que gera confusão. É necessário **validar** o fluxo (API, BFF, frontend) e **tornar explícito** o comportamento, e opcionalmente melhorar o valor por defeito para novos posts.

## What Changes

- **Validação do fluxo**: Garantir e documentar que (1) a API filtra por `Published == true` nas listas públicas (`GET /api/posts` sem `forAuthorArea`); (2) o BFF envia `published: true` ao listar posts para a página inicial e o índice; (3) o formulário de criar/editar envia o campo `published` e a API persiste-o em create e update. Se alguma destas condições falhar, corrigir.
- **UX opcional**: Para **novos** posts, considerar definir o valor por defeito de "Publicado" como **true** no formulário, para que ao criar um post ele apareça na página inicial e no índice salvo o utilizador desmarcar explicitamente. Manter o comportamento de edição (carregar o valor atual do post).
- **Documentação**: Explicar em `openspec/project.md` e/ou README que apenas posts **publicados** (checkbox "Publicado" marcado) aparecem na página inicial e no índice; posts em rascunho só são visíveis na Área do autor e por link direto ao slug (se a política o permitir).

## Impact

- Affected specs: nova capability **post-publishing** (visibilidade em listas públicas; persistência do campo Published; opcional valor por defeito no formulário).
- Affected code: possivelmente `src/pages/PostEdit.tsx` (valor inicial de `published` para novo post, ex.: `true`); verificação/correção em API/BFF se necessário; `openspec/project.md` e README.
