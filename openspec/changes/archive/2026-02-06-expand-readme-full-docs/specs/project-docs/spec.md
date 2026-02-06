# project-docs (delta)

## ADDED Requirements

### Requirement: README inclui funcionalidades completas, estrutura dos serviços, stack e passo a passo de configuração

O **README** do repositório SHALL incluir: (1) uma **lista completa das funcionalidades** do projeto (leitura pública, índice com paginação/filtro/reordenação, área do autor, gestão de contas, perfil com descrição do autor, critério mínimo de senha, recuperação da senha do Admin, etc.); (2) uma descrição da **estrutura dos serviços** (fluxo Frontend → BFF → API → SQLite e estrutura de pastas relevante: `src/`, `backend/api/`, `backend/bff/` com subpastas); (3) a **stack de desenvolvimento** (versões e tecnologias: Node.js, npm, .NET 9, Vite, React, TypeScript, EF Core, SQLite, etc.) e referência aos comandos de build e scripts principais; (4) um **passo a passo de configuração** numerado, desde o build do projeto até o reset de senha do Admin (clone, instalar dependências, build/executar API e BFF, executar frontend, configurar Admin, primeiro login e troca de senha, e opcionalmente recuperar senha do Admin via ficheiro de trigger). O objetivo é que um novo desenvolvedor ou operador possa seguir uma única sequência lógica para pôr o sistema a funcionar e entender todas as capacidades do produto.

#### Scenario: Leitor encontra lista completa de funcionalidades no README

- **WHEN** a developer or operator opens the README
- **THEN** they find a section (or integrated list) that explicitly covers: public pages (home, posts list, single post with author description), story index (pagination, filter, reorder), theme, login, mandatory password change, author area, Contas (own profile and Admin management), password criteria, post permissions, and Admin password recovery via trigger file
- **AND** the list matches the current product capabilities described in openspec/project.md

#### Scenario: Leitor entende a estrutura dos serviços

- **WHEN** a developer reads the README
- **THEN** they find a clear description of the flow Frontend → BFF → API → SQLite and the folder structure (e.g. `src/` for frontend, `backend/api/` and `backend/bff/` with Controllers, Services, etc.)
- **AND** they can identify where the API, BFF, and frontend code live

#### Scenario: Leitor vê a stack e comandos de build

- **WHEN** a developer looks for technology stack and build instructions
- **THEN** the README lists Node.js, npm, .NET 9, Vite, React, TypeScript, and other key technologies with versions where relevant
- **AND** it references the main commands: frontend build (`npm run build`), backend build (`dotnet build` in api and bff), and scripts (dev, test, lint)

#### Scenario: Leitor segue o passo a passo desde o build até ao reset de senha Admin

- **WHEN** a new developer or operator follows the README step-by-step configuration section
- **THEN** the steps cover in order: clone and install dependencies, build and run API and BFF, run frontend, configure Admin email (and first-run account creation), first login and mandatory password change
- **AND** the section includes the optional procedure to recover Admin password (create trigger file, restart API, login with default password and change again)
- **AND** following these steps leads to a working system and ability to log in as Admin and (if needed) recover Admin password
