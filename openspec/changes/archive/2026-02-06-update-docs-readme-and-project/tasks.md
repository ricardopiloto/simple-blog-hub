## 1. Revisão do README.md

- [x] 1.1 Confirmar que a descrição do projeto, arquitetura (Frontend → BFF → API → SQLite) e requisitos (Node.js, npm, .NET 9 SDK) estão corretos e completos.
- [x] 1.2 Confirmar que a seção "O que o projeto faz" inclui a área **Contas** (`/area-autor/contas`) para o Admin (criar contas, resetar senha, excluir) e o fluxo de **troca obrigatória de senha** (modal no primeiro acesso com senha padrão).
- [x] 1.3 Confirmar que a tabela de variáveis de ambiente e o parágrafo sobre configuração do Admin (`Admin__Email`, exemplo `ac.ricardosobral@gmail.com`, modal obrigatório, reset de senha) estão claros.
- [x] 1.4 Confirmar que a seção sobre .env opcional, comandos (build, test, lint) e tecnologias está alinhada ao estado atual.

## 2. Revisão do openspec/project.md

- [x] 2.1 Confirmar que Tech Stack (Runtime/build, Backend, .NET 9) e External Dependencies estão atualizados.
- [x] 2.2 Confirmar que Architecture Patterns inclui a rota `/area-autor/contas` (gestão de contas, apenas Admin) e que o contexto de autenticação (login, área do autor, alterar senha) está descrito.
- [x] 2.3 Adicionar ou ajustar Domain Context / convenções para incluir **gestão de contas**: Admin identificado por `Admin:Email`/`Admin__Email`; área Contas para listar, criar, editar e excluir usuários e para resetar senha; senha padrão `senha123`; troca obrigatória no primeiro acesso (modal bloqueante).
- [x] 2.4 Confirmar que Important Constraints e variáveis de ambiente (incluindo `Admin__Email`) estão consistentes com o README.

## 3. Consistência entre documentos

- [x] 3.1 Verificar que versão do .NET (9), nome do blog (1noDado RPG), fluxos de Admin/Contas e de troca obrigatória de senha estão descritos de forma alinhada em ambos os arquivos.
- [x] 3.2 Executar `openspec validate update-docs-readme-and-project --strict` após as alterações.
