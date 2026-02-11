# Design: Documentação e CHANGELOG para v2.0

## Escopo da release 2.0

As changes que **compõem** a release 2.0 (listadas no CHANGELOG [2.0]) são as que foram aplicadas e que afetam a área do autor ou a documentação:

- **add-author-dashboard-inicial-v2** — Dashboard como tela inicial da área do autor, métricas, rota Publicações.
- **add-dashboard-rascunho-metric** — Indicador "Rascunho" (draft_count) no dashboard.
- **merge-dashboard-publications-single-page** — Página única em /area-autor (dashboard em cima, lista em baixo); /area-autor/publicacoes → redirect.
- **style-dashboard-rascunho-card-yellow-border** — Borda amarela no card Rascunho (depois substituída por indicador dinâmico).
- **make-dashboard-cards-clickable** — Cards Total, Publicados, Planejados, Rascunho filtram a lista; Autores → Contas; scroll para Publicações.
- **add-author-area-sort-and-story-type-filter** — Ordenação configurável (data/story_order, asc/desc) e filtro por linha da história (Todos / Velho Mundo / Idade das Trevas).
- **widen-author-area-search-input** — Campo de pesquisa com largura mínima para placeholder visível.
- **indicate-dashboard-card-filter-with-yellow-border** — Borda amarela indica o card de filtro ativo; desmarcar ao alterar pesquisa/linha da história/ordenação.
- **update-docs-and-changelog-for-v2** — Esta change (atualização da documentação e CHANGELOG para v2.0).

## Onde atualizar

| Documento | Alteração |
|-----------|-----------|
| docs/changelog/CHANGELOG.md | Nova secção ## [2.0] no topo; frase introdutória com v2.0 |
| README.md | Secção 4: exemplos de tags com v2.0; Secção 5: Área do autor com descrição v2 |
| openspec/project.md | Domain Context — Páginas/Rotas: área do autor como página única com dashboard + lista, cards clicáveis, filtros |
| frontend/package.json | version: "2.0.0" |
| docs/README.md | Menção a v2.0 no changelog (opcional) |

## Guia de atualização 1.10 → 2.0

Opcional. As changes da v2.0 não introduzem novas variáveis de ambiente obrigatórias nem migrações de esquema além das já existentes na v1.10. Um operador em v1.10 pode atualizar com pull, rebuild (se necessário) e build do frontend conforme ATUALIZAR-SERVIDOR-DOCKER-CADDY. Um guia dedicado ATUALIZAR-1-10-PARA-2-0.md pode resumir isso em uma página; se não for criado, o README pode indicar "para atualizar para v2.0, seguir ATUALIZAR-SERVIDOR-DOCKER-CADDY".
