# home-page Specification

## Purpose
TBD - created by archiving change order-home-by-creation-date. Update Purpose after archive.
## Requirements
### Requirement: Página inicial ordenada por data/hora de criação; Destaque = último post criado

A **página inicial** (`/`) **deve** (SHALL) exibir os posts publicados ordenados por **data/hora de criação** (`CreatedAt`) em ordem **decrescente** (mais recente primeiro). O **Destaque** **deve** ser sempre o primeiro elemento dessa lista, ou seja, o **último post criado** (entre os publicados). A secção **Artigos recentes** **deve** exibir os posts seguintes na mesma ordem (decrescente por criação). A API **deve** ordenar a lista pública com `order=date` por `CreatedAt` descendente, e não por data de publicação, de forma que o Destaque corresponda ao post mais recentemente criado.

#### Scenario: Destaque é o último post criado

- **Dado** que existem vários posts publicados com datas de criação diferentes
- **Quando** o utilizador acede à página inicial
- **Então** o bloco **Destaque** exibe o post cuja data de criação é a **mais recente** entre todos os publicados
- **E** esse post é o primeiro da lista devolvida pela API com `order=date`

#### Scenario: Artigos recentes respeitam ordem decrescente de criação

- **Dado** que existem vários posts publicados
- **Quando** o utilizador acede à página inicial
- **Então** a secção **Artigos recentes** exibe posts na mesma ordem decrescente de data/hora de criação (segundo, terceiro, etc., da lista ordenada por `CreatedAt` desc)
- **E** não há reordenação por data de publicação; a ordem é estritamente por criação

#### Scenario: API ordena lista pública order=date por CreatedAt

- **Quando** o cliente solicita a lista de posts publicados com `order=date` (GET /api/posts?published=true&order=date ou equivalente via BFF)
- **Então** a API devolve os posts ordenados por `CreatedAt` em ordem decrescente
- **E** o primeiro elemento da resposta é o post com `CreatedAt` mais recente entre os publicados

