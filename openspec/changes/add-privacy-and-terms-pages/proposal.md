# Proposal: Popular páginas Privacidade e Termos de Uso

## Summary

O footer do blog já inclui links para **Privacidade** (`/privacy`) e **Termos de Uso** (`/terms`), mas essas rotas não existem — o usuário cai na página 404. Este change adiciona as **rotas** e **páginas** correspondentes, com conteúdo estático adequado a um **blog de contos e aventuras de RPG**, orientado a **utilizadores no Brasil**: política de privacidade em conformidade com a **LGPD** (Lei Geral de Proteção de Dados) e termos de uso sob **lei brasileira** e foro no Brasil, redigidos em português do Brasil. O contexto do site (leitura pública, área de autores, sem comércio de dados) é mantido. O **repositório** do projeto utiliza licença **MIT** para o código; essa decisão é referenciada nos Termos e não altera o conteúdo dos contos publicados no blog (que permanecem da responsabilidade dos autores). O design inclui **propostas concretas** de estrutura e texto para as seções de Privacidade e de Termos de Uso, pensadas para este tipo de blog e para o operador no Brasil.

## Goals

- **Rotas e páginas**: Garantir que `/privacy` e `/terms` existam e exibam páginas com layout consistente (ex.: `Layout`, título, conteúdo em prosa).
- **Conteúdo Privacidade**: Incluir seções típicas de uma política de privacidade (responsável, dados coletados, finalidade, bases legais, cookies, direitos do usuário nos termos da **LGPD**, contato), adaptadas a um blog de leitura e área de autores (sem venda de dados, sem tracking invasivo), com redação em português do Brasil.
- **Conteúdo Termos de Uso**: Incluir aceitação dos termos, natureza do serviço (blog de contos e aventuras de RPG), propriedade/licenciamento do conteúdo e do código (MIT para o repositório), condutas permitidas e proibidas, área do autor, limitação de responsabilidade, **lei brasileira aplicável e foro no Brasil**, e contato.
- **Licenciamento**: O repositório do projeto usa **MIT**; referenciar nos Termos (e opcionalmente na página ou no footer) que o código do projeto está sob MIT, sem obrigar o conteúdo dos posts a essa licença.

## Scope

- **In scope**: (1) Adicionar rotas `/privacy` e `/terms` no `App.tsx`. (2) Criar componentes de página (ex.: `Privacy.tsx`, `Terms.tsx`) que usem `Layout` e exibam o conteúdo estático em português. (3) Conteúdo baseado nas propostas do design (estrutura e texto de exemplo para Privacidade e Termos). (4) Spec delta para uma nova capacidade `legal-pages`: requisitos de existência e conteúdo mínimo das páginas. (5) Manter os links já existentes no footer.
- **Out of scope**: Formulários de consentimento (cookie banner), backend para guardar preferências, versões em outros idiomas, edição dinâmica do texto via CMS; licenciamento do conteúdo dos posts pelos autores (fica à decisão dos autores; os Termos podem deixar claro que os contos são da responsabilidade de quem publica).

## Affected code and docs

- **frontend/src/App.tsx**: Novas rotas `Route path="/privacy"` e `Route path="/terms"` com os componentes das páginas.
- **frontend/src/pages/Privacy.tsx** (novo): Página de Privacidade com título e conteúdo em secções.
- **frontend/src/pages/Terms.tsx** (novo): Página de Termos de Uso com título e conteúdo em secções.
- **openspec/changes/add-privacy-and-terms-pages/specs/legal-pages/spec.md**: Delta ADDED para a nova capacidade legal-pages.

## Dependencies and risks

- **Nenhuma dependência técnica** além do React Router e do Layout já existentes. Conteúdo estático em JSX ou em constantes; sem API.
- **Jurídico**: As propostas de texto são genéricas e adequadas a um blog pequeno com operador no Brasil; o operador pode querer revisão jurídica antes de publicar em produção, sobretudo se houver tratamento de dados sensíveis. O change descreve a estrutura e o tom, com foco em **LGPD** e lei brasileira; a redação final pode ser ajustada sem alterar a implementação.

## Success criteria

- Ao clicar em "Privacidade" ou "Termos de Uso" no footer, o usuário é levado a `/privacy` ou `/terms` e vê a página correspondente com conteúdo legível e estruturado.
- O conteúdo cobre as seções propostas no design (Privacidade: responsável, dados, finalidade, direitos na LGPD, contato; Termos: aceitação, natureza do serviço, licença do código MIT, condutas, responsabilidade, lei brasileira e foro, contato).
- A referência ao licenciamento MIT do repositório está presente nos Termos de Uso (e/ou onde fizer sentido).
- `openspec validate add-privacy-and-terms-pages --strict` passa.
