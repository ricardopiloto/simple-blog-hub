# Change: Atualizar documentação e validar uso do .env

## Why

A documentação do projeto (README, openspec/project.md) deve refletir o estado atual: quais variáveis de ambiente são realmente usadas e onde. O arquivo `.env` na raiz contém atualmente variáveis **Supabase** (`VITE_SUPABASE_*`), que o projeto **não utiliza** — a aplicação usa BFF + API .NET + SQLite. É necessário atualizar a documentação e deixar explícito quando o `.env` é necessário e quais variáveis são usadas, para que o time saiba se pode remover o `.env` ou mantê-lo apenas com o que for útil.

## What Changes

- **Documentação (README e openspec/project.md):**
  - Incluir uma seção ou parágrafo que esclareça: (1) o projeto **roda sem `.env`** (frontend usa padrão `http://localhost:5000` para o BFF; backend usa appsettings e variáveis de ambiente do processo). (2) O **`.env` na raiz é opcional** e usado apenas pelo **frontend (Vite)** para variáveis `VITE_*`; a única variável de frontend usada no código é `VITE_BFF_URL` (opcional; padrão em código). (3) Backend (API/BFF) **não lê o `.env` da raiz** por padrão; variáveis como `Admin__Email`, `API__BaseUrl`, `Jwt:Secret` são lidas de appsettings ou das variáveis de ambiente do processo ao rodar `dotnet run`.
  - Deixar claro que variáveis **Supabase** (`VITE_SUPABASE_*`) **não são usadas** pelo projeto atual; podem ser removidas do `.env` local. Não commitar `.env` (já está no .gitignore).
- **Validação do .env:** Documentar que **não é obrigatório** ter um arquivo `.env` para desenvolvimento: o projeto funciona com os padrões. O `.env` só é útil para sobrescrever `VITE_BFF_URL` (ex.: BFF em outra URL/porta) ou para carregar variáveis em ferramentas que leem `.env` (ex.: alguns IDEs ou scripts). Opcionalmente, adicionar um `.env.example` na raiz com apenas as variáveis usadas (ex.: `VITE_BFF_URL`) e comentário indicando que variáveis do backend (Admin__Email etc.) devem ser configuradas no ambiente ao rodar a API/BFF.

## Impact

- **Affected specs:** project-docs (requisito ou esclarecimento sobre documentação de variáveis de ambiente e uso do .env).
- **Affected code:** README.md, openspec/project.md; opcionalmente `.env.example` (novo arquivo, versionado).
