# Change: Expandir README com funcionalidades, estrutura dos serviços, stack e passo a passo de configuração

## Why

O README é o primeiro ponto de entrada para quem clona o repositório. Atualmente descreve arquitetura, o que o projeto faz, como executar e variáveis de ambiente, mas pode ser mais completo e estruturado: **(1)** listar de forma clara **todas as funcionalidades** do projeto (leitura pública, índice, área do autor, gestão de contas, perfil, descrição do autor, critério de senha, recuperação da senha do Admin, etc.); **(2)** mostrar a **estrutura dos serviços** (frontend, BFF, API) e das pastas relevantes; **(3)** explicitar a **stack de desenvolvimento** (versões e principais tecnologias); **(4)** oferecer um **passo a passo de configuração** contínuo, desde o build do projeto até o reset de senha do Admin, para que um novo desenvolvedor ou operador siga uma única sequência lógica.

## What Changes

- **README.md**: Reorganizar e expandir para incluir:
  - **Funcionalidades**: secção que liste de forma explícita todas as funcionalidades (página inicial, lista de posts, post individual com descrição do autor, índice com paginação/filtro/reordenação, tema claro/escuro, login, troca obrigatória de senha, área do autor, Contas com perfil e descrição do autor, critério mínimo de senha, edição de posts, permissões, recuperação da senha do Admin).
  - **Estrutura dos serviços**: diagrama ou descrição clara do fluxo Frontend → BFF → API → SQLite e da estrutura de pastas (raiz: `src/`, `backend/api/`, `backend/bff/` com subpastas Controllers, Services, etc.).
  - **Stack de desenvolvimento**: secção dedicada com versões (Node.js, npm, .NET 9, Vite, React, TypeScript, Tailwind, etc.) e referências aos comandos de build/test/lint.
  - **Passo a passo de configuração**: secção numerada desde "1. Clonar e instalar dependências" até "N. Recuperar senha do Admin (opcional)", cobrindo build do frontend, build/execução da API e BFF, configuração do Admin (e-mail), primeiro login e troca de senha, e o procedimento de reset da senha do Admin via ficheiro de trigger.
- **Spec**: Capability **project-docs**: ADDED requirement que o README inclua lista completa de funcionalidades, estrutura dos serviços, stack e passo a passo de configuração (build até reset de senha Admin).

## Impact

- Affected specs: **project-docs** (ADDED requirement).
- Affected code: `README.md` apenas. Nenhuma alteração em `openspec/project.md` é obrigatória para este change; a consistência entre README e project.md já é exigida por requisitos existentes.
