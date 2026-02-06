# Tasks: Atualizar documentação e validar .env

## 1. Documentação – quando o .env é necessário

- [x] 1.1 No README.md, na seção de variáveis de ambiente (ou criar subseção “Sobre o arquivo .env”): explicar que o projeto **roda sem `.env`** (frontend usa padrão `http://localhost:5000` para o BFF; API e BFF usam appsettings e variáveis de ambiente do processo). O `.env` na raiz é **opcional** e usado apenas pelo Vite (frontend) para variáveis `VITE_*`; a única usada no código é `VITE_BFF_URL`. Backend não lê `.env` da raiz; variáveis como `Admin__Email` são definidas no ambiente ao rodar a API (ex.: `Admin__Email=... dotnet run` ou em appsettings.Development.json).
- [x] 1.2 No README.md: esclarecer que variáveis **Supabase** (`VITE_SUPABASE_*`) **não são utilizadas** pelo projeto atual; se existirem no `.env` local, podem ser removidas.

## 2. Documentação – openspec/project.md

- [x] 2.1 Em openspec/project.md, na seção **Important Constraints** (ou equivalente): atualizar o texto sobre variáveis de ambiente para mencionar que o `.env` é opcional; que a única variável de frontend usada é `VITE_BFF_URL` (padrão em código); e que o backend lê configuração de appsettings e variáveis de ambiente do processo, não do `.env` na raiz.

## 3. .env.example (opcional)

- [x] 3.1 Criar `.env.example` na raiz com apenas as variáveis utilizadas pelo projeto (ex.: `VITE_BFF_URL=http://localhost:5000`) e um comentário indicando que variáveis da API (ex.: `Admin__Email`) devem ser configuradas no ambiente ao rodar a API, não neste arquivo. Garantir que `.env.example` seja versionado (não está no .gitignore).

## 4. Validação

- [x] 4.1 Confirmar que, sem arquivo `.env`, o frontend inicia e usa o BFF em `http://localhost:5000`; confirmar que a documentação está alinhada ao código (nenhuma referência a variáveis Supabase no fluxo atual).
