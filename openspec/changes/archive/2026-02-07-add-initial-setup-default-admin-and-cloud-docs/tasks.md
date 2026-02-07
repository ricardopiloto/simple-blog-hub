# Tasks: Configuração inicial com admin padrão e documentação para nuvem

## 1. API – Admin por defeito (admin@admin.com)

- [x] 1.1 Em `SeedData.cs`, em `EnsureInitialAdminUserAsync`: quando `configuration["Admin:Email"]` for nulo ou vazio, usar o valor por defeito **admin@admin.com** (constante, ex.: `DefaultAdminEmail = "admin@admin.com"`). Assim, na primeira execução sem configuração, o sistema cria o utilizador admin@admin.com com senha padrão e MustChangePassword = true.
- [x] 1.2 Em `AdminService.cs`: quando `configuration["Admin:Email"]` for nulo ou vazio, usar o mesmo valor por defeito **admin@admin.com** para `_adminEmail`, de forma que IsAdminAsync considere admin quem tiver esse e-mail quando não houver Admin:Email configurado.
- [x] 1.3 Em `SeedData.TryResetAdminPasswordByTriggerFileAsync`: quando Admin:Email não estiver configurado, usar o mesmo valor por defeito admin@admin.com para localizar o utilizador a repor (para consistência com o reset de senha).

## 2. API – Seed de demonstração opcional (banco zerado por defeito)

- [x] 2.1 Em `SeedData.cs`, em `EnsureSeedAsync`: aceitar um parâmetro ou ler configuração (ex.: `Seed:EnableDemoData`) que indique se deve criar autores e posts de demonstração. Quando **false** ou ausente (valor por defeito), **não** criar nenhum autor nem post; sair imediatamente (apenas migrations e o admin inicial serão aplicados noutro passo). Quando **true**, manter o comportamento atual (criar Ana Silva, utilizador ana@example.com, posts de exemplo).
- [x] 2.2 Em `Program.cs`: ler `Seed:EnableDemoData` (ex.: `config.GetValue<bool>("Seed:EnableDemoData")`, default false) e chamar `EnsureSeedAsync` apenas quando true, ou passar a configuração para `EnsureSeedAsync` e decidir dentro do método. Garantir que `EnsureInitialAdminUserAsync` e `TryResetAdminPasswordByTriggerFileAsync` continuam a ser chamados na mesma ordem.

## 3. Documentação – README (cloud / Linux)

- [x] 3.1 Adicionar no README uma secção **Instalação em ambientes de nuvem (Linux)** (ou "Deploy em Linux") com passos numerados: (1) Instalar Node.js e npm e .NET 9 SDK no servidor Linux; (2) Clonar o repositório; (3) Build: na raiz `npm install` e `npm run build`; em `backend/api` e `backend/bff` executar `dotnet build`; (4) Configuração: variáveis de ambiente ou appsettings (ConnectionStrings, API__BaseUrl no BFF, opcionalmente Admin__Email; em produção definir Jwt:Secret no BFF); (5) Executar a API (ex.: `dotnet run` em backend/api ou publicar e executar o binário; indicar porta 5001); (6) Executar o BFF (ex.: porta 5000); (7) Servir o frontend: copiar o conteúdo de `dist/` para um servidor web (ex.: nginx) ou usar um reverse proxy que sirva estáticos e faça proxy para o BFF; (8) Primeiro acesso: abrir a URL do frontend, fazer login com **admin@admin.com** e senha **senha123**, concluir a troca obrigatória de senha no modal. Incluir referência a que, por defeito, o banco não tem dados de demonstração e o admin é admin@admin.com quando Admin__Email não está definido.
- [x] 3.2 Atualizar a secção "Configuração passo a passo" ou "Requisitos" se necessário para referir que, sem configuração, o admin padrão é admin@admin.com.

## 4. Documentação – project.md

- [x] 4.1 Em `openspec/project.md`, na secção de gestão de contas ou constraints, indicar que quando `Admin:Email` não está configurado, o sistema usa **admin@admin.com** como e-mail do admin e que o seed de demonstração (autores e posts de exemplo) é **opcional** (ex.: `Seed:EnableDemoData`), estando desativado por defeito para instalações novas.

## 5. Validação

- [x] 5.1 Build da API e do BFF. Testar localmente: remover ou comentar Admin:Email em appsettings, definir Seed:EnableDemoData = false (ou omitir), apagar blog.db se existir, arrancar a API; confirmar que é criado um utilizador admin@admin.com e que não existem autores/posts de demonstração; fazer login no frontend com admin@admin.com / senha123 e concluir a troca de senha. Confirmar que o trigger de reset de senha continua a funcionar (com admin@admin.com quando Admin:Email não configurado).
- [x] 5.2 Validar a proposta com `openspec validate add-initial-setup-default-admin-and-cloud-docs --strict`.
