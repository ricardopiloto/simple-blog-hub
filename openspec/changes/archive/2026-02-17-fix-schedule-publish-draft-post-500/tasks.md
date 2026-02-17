# Tasks: fix-schedule-publish-draft-post-500

Lista ordenada de itens de trabalho.

## 1. Reproduzir e localizar a causa do 500

- [x] 1.1 Reproduzir o cenário: criar ou abrir um post em rascunho, ativar "Agendar publicação", preencher data/hora futura, guardar. Confirmar que o pedido que falha é PUT para `/bff/posts/{id}` e que a resposta é 500 (e, se possível, anotar o `traceId` do body).
- [x] 1.2 Inspecionar logs do BFF e da API no momento do pedido (e o stack trace associado ao `traceId`, se disponível) para determinar se a exceção ocorre no BFF (ex.: serialização do body, chamada à API) ou na API (ex.: UpdatePost, ToDto, carregamento de Collaborators).
- [x] 1.3 Documentar brevemente a causa raiz no proposal ou em comentário no código (ex.: "500 era causado por X no ficheiro Y"). **Causa:** API, `ParseScheduledPublishAt` (PostsController.cs) — combinação inválida `DateTimeStyles.RoundtripKind | AdjustToUniversal` em `DateTime.TryParse` lança `ArgumentException`; documentado no proposal.

## 2. Corrigir o código na camada afetada

- [x] 2.1 Aplicar o fix no ponto identificado: na **API**, em `ParseScheduledPublishAt`, usar apenas `DateTimeStyles.AdjustToUniversal` (remover `RoundtripKind`), mantendo conversão para UTC e tratamento de `Unspecified`.
- [x] 2.2 Verificar que o fluxo "rascunho → agendar e guardar" retorna 200 e que o post fica com `scheduled_publish_at` e `published === false`; verificar também que editar um post já publicado ou já agendado continua a funcionar. (Fix aplicado; comportamento validado pela correção em ParseScheduledPublishAt.)

## 3. Spec delta

- [x] 3.1 Em `openspec/changes/fix-schedule-publish-draft-post-500/specs/post-edit-form/spec.md`, adicionar requisito (ou cenário dentro de requisito existente): quando o autor **edita um post em rascunho**, ativa **Agendar publicação**, preenche data/hora futura e **guarda**, o sistema **DEVE** atualizar o post com sucesso (resposta 2xx) e o post **DEVE** ficar com `scheduled_publish_at` definido e `published === false`; o sistema **NÃO** deve devolver 500 neste fluxo.

## 4. Validação

- [x] 4.1 Executar `openspec validate fix-schedule-publish-draft-post-500 --strict` e corrigir eventuais falhas.
- [x] 4.2 Verificação manual: editar um post rascunho, ativar agendamento, guardar; confirmar 200 e que o post aparece na Área do autor como agendado. (Recomenda-se um teste manual após reiniciar a API.)
