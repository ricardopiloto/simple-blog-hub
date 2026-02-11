# Design: Ordenação e filtro por linha da história (Publicações)

## Estado no cliente

- **sortBy**: `'date' | 'story_order'` — critério de ordenação.
- **sortDir**: `'asc' | 'desc'` — direção. Default: `sortBy = 'date'`, `sortDir = 'desc'` (mais novo primeiro).
- **storyTypeFilter**: `'all' | 'velho_mundo' | 'idade_das_trevas'` — filtro por linha da história. Default: `'all'`.

A lista exibida é: `posts` → filtro por estado (se existir, ex.: make-dashboard-cards-clickable) → filtro por `storyTypeFilter` → filtro por texto (autor, título, data) → ordenar por `sortBy` + `sortDir`.

## Critério de data

Para "ordenar por data" usar **`created_at`** (data de criação do post). Alternativa aceitável: `updated_at` se o produto preferir "última alteração". A proposta recomenda `created_at` para "mais novo" = último criado; a implementação deve ser consistente e documentar a escolha.

## Layout da barra de filtros/ordenação

- **Lado esquerdo (ou início, em RTL):** campo de pesquisa (Input) + toggle/selector de linha da história (Todos | Velho Mundo | Idade das Trevas). O toggle pode ser um `<select>`, um grupo de botões/segmented control, ou tabs compactas; deve estar "ao lado" do input (mesma linha em desktop).
- **Lado direito (ou fim):** selector de ordenação: por exemplo um `<select>` com opções "Mais recentes", "Mais antigos", "Ordem da história (crescente)", "Ordem da história (decrescente)", ou dois selects (ordenar por: Data | Ordem da história; direção: Asc | Desc). A proposta exige que este controlo esteja no **lado oposto** ao do filtro de texto.

Em viewports pequenos, os blocos podem empilhar (ex.: filtro + story type numa linha, ordenação na linha seguinte) mantendo "filtro + story" juntos e "ordenar" separado.

## Acessibilidade

- Labels para o selector de story type (ex.: "Linha da história") e para o de ordenação (ex.: "Ordenar por").
- Se usar selects, associar `<label>` ou `aria-label`; se usar botões, garantir texto visível ou `aria-label`.
