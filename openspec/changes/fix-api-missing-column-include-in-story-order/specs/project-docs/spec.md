# project-docs — delta for fix-api-missing-column-include-in-story-order

## ADDED Requirements

### Requirement: README da API documenta resolução para "no such column" (colunas de migrações)

O **README** da API (`backend/api/README.md`) **deve** (SHALL) incluir na secção **Troubleshooting** a descrição de como resolver erros do tipo **"no such column: p.<NomeColuna>"** quando a coluna foi introduzida por uma migração EF Core mas ainda não existe na base de dados (ex.: API não foi reconstruída/reiniciada após atualização do código). Para cada coluna que tenha um script SQL manual de migração (ex.: ViewCount, IncludeInStoryOrder), o README **deve** indicar: (1) recomendar reconstruir e reiniciar a API para que `MigrateAsync()` aplique as migrações ao arranque; (2) alternativa: executar o script SQL correspondente contra o ficheiro da base de dados e reiniciar a API. O objetivo é que um operador que encontre o erro saiba como corrigi-lo sem alterar código.

#### Scenario: Operador vê "no such column: p.IncludeInStoryOrder"

- **Dado** que a API lança SQLite Error "no such column: p.IncludeInStoryOrder"
- **Quando** o operador abre o README da API na secção Troubleshooting
- **Então** encontra instruções para este erro (reconstruir e reiniciar a API, ou executar o script `add_include_in_story_order_to_posts.sql`)
- **E** após aplicar uma das opções e reiniciar a API, o erro deixa de ocorrer
