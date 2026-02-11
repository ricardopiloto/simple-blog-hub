# author-area-dashboard — delta for merge-dashboard-publications-single-page

## MODIFIED Requirements

### Requirement: Dashboard e lista na mesma página (SHALL)

A rota **/area-autor** SHALL exibir **uma única página** com duas secções verticais na seguinte ordem: (1) **Secção "Visão geral do blog"** no topo — os cinco indicadores do dashboard (total de posts, publicados, planejados/agendados, total de visualizações, autores), obtidos via endpoint protegido (ex.: GET /bff/dashboard/stats); (2) **Secção "Publicações"** em baixo — a lista de posts da área do autor, com filtro por autor/título/data, scroll quando há mais de 10 itens, botão "Novo post" (para /area-autor/posts/novo) e ações editar/excluir conforme permissões. O utilizador SHALL ver os indicadores e a lista no mesmo ecrã, sem precisar de navegar para outra rota para aceder às publicações. Após login com sucesso, o utilizador SHALL ser redirecionado para /area-autor e ver esta página única (visão geral em cima, publicações em baixo).

#### Scenario: Autor vê visão geral e publicações na mesma página

- **GIVEN** o utilizador está autenticado
- **WHEN** acede a /area-autor (ou é redirecionado após login)
- **THEN** vê no topo a secção "Visão geral do blog" com os cinco indicadores (total de posts, publicados, planejados, total de visualizações, autores)
- **AND** vê em baixo a secção "Publicações" com a lista de posts, o filtro de pesquisa e o botão "Novo post"
- **AND** não é necessário navegar para outra rota para ver a lista de posts

#### Scenario: Dados do dashboard e lista na mesma página

- **GIVEN** o frontend está na rota /area-autor
- **WHEN** a página carrega
- **THEN** o cliente obtém as estatísticas do dashboard (ex.: GET /bff/dashboard/stats) e a lista de posts (ex.: endpoint author-area)
- **AND** a página exibe primeiro os indicadores e depois a lista na mesma vista

---

### Requirement: Área do Autor list has scroll when more than 10 records and dynamic filter

**Scope update:** This requirement SHALL apply to the **secção "Publicações"** na **página única** em **/area-autor** (a lista de posts que aparece em baixo da secção "Visão geral do blog"), not to a separate route. The list container SHALL show a **vertical scrollbar** when the list contains more than **10 records**. The list container SHALL have a maximum height (e.g. equivalent to approximately 10 rows) and `overflow-y: auto`. The secção Publicações SHALL provide a **dynamic filter** (a single search field) that filters the list **in real time** by **author name**, **title**, and **publication date**. An empty search SHALL show all posts. Filtering is performed client-side on the already-loaded list.

#### Scenario: Scrollbar visible when list has more than 10 posts

- **GIVEN** a página /area-autor carregou e a secção Publicações (após qualquer filtro) tem **mais de 10** itens
- **WHEN** o utilizador vê a lista
- **THEN** a lista está num contentor com scroll vertical visível
- **AND** o utilizador pode fazer scroll para ver todos os itens

#### Scenario: Dynamic filter narrows list by author, title, or date

- **GIVEN** a página /area-autor carregou com a secção Publicações visível
- **WHEN** o utilizador escreve no campo de pesquisa (autor, título ou data)
- **THEN** a lista atualiza **imediatamente** para mostrar apenas os posts que correspondem
- **AND** ao limpar a pesquisa, a lista completa é mostrada novamente

---

## REMOVED Requirements

### Requirement: Página Publicações contém a lista de posts e "Novo post" (SHALL)

**Removed.** A lista de posts e o botão "Novo post" passam a estar na **secção Publicações** da **página única** em /area-autor, não numa rota separada /area-autor/publicacoes. O requisito "Dashboard e lista na mesma página" acima substitui a necessidade de uma página Publicações dedicada.

### (Referência) Dashboard é a tela inicial da área do autor — substituído pelo requisito "Dashboard e lista na mesma página"

O comportamento de "tela inicial" mantém-se (login → /area-autor), mas o conteúdo da tela passa a ser a página única com visão geral + publicações, não apenas os indicadores com link para outra página. O novo requisito MODIFIED "Dashboard e lista na mesma página" cobre este comportamento.
