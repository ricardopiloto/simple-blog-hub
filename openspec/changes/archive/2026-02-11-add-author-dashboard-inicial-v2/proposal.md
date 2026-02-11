# Dashboard inicial na área do autor (v2.0)

## Why

Para a **versão 2.0** do portal, a área logada do autor deve ter uma **tela inicial em forma de dashboard** que resume o estado do blog (total de posts, publicados, agendados, visualizações, autores). Assim que o autor faz login, é redirecionado para este dashboard; a lista de publicações e o "Novo post" passam a estar num submenu **Publicações**, mantendo a experiência atual mas com navegação mais clara.

## What Changes

1. **Nova tela inicial da área do autor (dashboard)**  
   A rota **`/area-autor`** passa a exibir um **dashboard** com os seguintes indicadores (apenas leitura, para qualquer autor logado):
   - Total de posts
   - Quantos estão publicados
   - Quantos estão planejados (agendados: têm data de publicação agendada)
   - Total de visualizações (soma dos ViewCount de todos os posts)
   - Quantos autores existem no blog  

   O dashboard inclui navegação para o submenu **Publicações** (lista de posts + Novo post).

2. **Submenu Publicações**  
   A lista de posts que hoje está em `/area-autor` (com filtro, scroll, botão "Novo post", editar/excluir) passa para a rota **`/area-autor/publicacoes`**. O link "Publicações" no dashboard (e, se aplicável, no header ou menu da área do autor) leva a esta lista. As rotas `/area-autor/posts/novo` e `/area-autor/posts/:id/editar` mantêm-se; a lista em `/area-autor/publicacoes` continua com o botão "Novo post" que aponta para `/area-autor/posts/novo`.

3. **Backend**  
   - **API:** Novo endpoint (protegido por X-Author-Id) que devolve os cinco números do dashboard: total de posts, publicados, agendados (ScheduledPublishAt != null), soma de ViewCount, contagem de autores. Qualquer autor autenticado pode chamar.
   - **BFF:** Novo endpoint protegido (JWT) que repassa o pedido à API e devolve o mesmo payload ao frontend.

4. **Rotas e redirects**  
   - Login bem-sucedido → redirecionar para `/area-autor` (dashboard).
   - `/area-autor` → componente do dashboard.
   - `/area-autor/publicacoes` → componente da lista de posts (conteúdo atual de AreaAutor).
   - `/area-autor/posts` → redirect para `/area-autor` (ou para `/area-autor/publicacoes`, conforme decisão; propõe-se redirect para `/area-autor` para manter o dashboard como entrada).

5. **Spec author-area-dashboard**  
   - **ADDED:** Requisitos para o dashboard como tela inicial (métricas e link para Publicações).
   - **MODIFIED:** Requisitos existentes (scroll, filtro) passam a aplicar-se explicitamente à página **Publicações** em `/area-autor/publicacoes`.

## Goals

- Após login, o autor vê primeiro o dashboard com totais (posts, publicados, agendados, visualizações, autores).
- O autor acede à lista de posts e "Novo post" através do submenu Publicações (`/area-autor/publicacoes`).
- API e BFF expõem um único endpoint de estatísticas para o dashboard; frontend consome e exibe sem lógica de agregação pesada no cliente.
- Spec author-area-dashboard atualizado com cenários verificáveis para o dashboard e para a lista em Publicações.

## Base de dados e scripts manuais

**Não é necessária alteração de esquema nem script SQL para execução manual.** Todas as métricas do dashboard usam dados já existentes: tabela **Posts** (Total, Published, ScheduledPublishAt, ViewCount) e tabela **Authors** (contagem). Não se criam colunas, tabelas nem migrações EF Core para esta funcionalidade. Em instalações que já tenham as migrações aplicadas (ViewCount, ScheduledPublishAt), o novo endpoint de stats funciona sem passos adicionais no banco. Se no futuro uma release introduzir novas colunas ou tabelas para o dashboard, aí sim deverá ser criado script de migração manual (e documentado em README da API / guias de atualização) conforme a regra do projeto.

## Out of scope

- Alterar permissões (quem vê o quê); qualquer autor logado vê os mesmos totais globais do blog.
- Novas métricas (ex.: gráficos, evolução no tempo); apenas os cinco números indicados.
- Alteração do esquema da base de dados para esta change (ver secção acima).

## Success criteria

- GET `/area-autor` (autenticado) mostra o dashboard com os cinco indicadores e link para Publicações.
- GET `/area-autor/publicacoes` mostra a lista de posts com filtro, scroll e "Novo post" como hoje.
- Login redireciona para `/area-autor`.
- `openspec validate add-author-dashboard-inicial-v2 --strict` passa.
