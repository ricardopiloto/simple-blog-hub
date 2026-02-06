# Change: Atualizar toda a documentação do projeto (README e openspec/project.md)

## Why

A documentação do repositório (README.md e openspec/project.md) deve refletir de forma completa e consistente o estado atual do sistema. Com as mudanças recentes (gestão de contas, Admin, troca obrigatória de senha com modal, reset de senha pelo Admin, .NET 9), é necessário garantir que ambos os documentos cubram os mesmos tópicos, com as mesmas versões e fluxos, para que desenvolvedores e ferramentas (incluindo agentes OpenSpec) tenham uma única fonte de verdade alinhada ao código.

## What Changes

- **README.md**: Revisão completa para garantir que inclua: descrição do projeto e arquitetura (Frontend → BFF → API → SQLite); requisitos (Node.js, npm, .NET 9 SDK); instruções de execução (API, BFF, frontend); variáveis de ambiente e configuração do Admin (`Admin__Email`, exemplo `ac.ricardosobral@gmail.com`); área logada (login, área do autor, **Contas** para Admin, edição de posts, troca obrigatória de senha no primeiro acesso com modal, reset de senha pelo Admin); seção sobre .env opcional; comandos úteis (build, test, lint); tecnologias e crédito de criação quando aplicável.
- **openspec/project.md**: Revisão completa para garantir que inclua: propósito e tech stack atuais (.NET 9, Node/Vite, React, etc.); convenções de código e branding; padrões de arquitetura e **rotas** (incluindo `/area-autor/contas` para gestão de contas pelo Admin); contexto de domínio (blog, páginas, autores, **gestão de contas**: Admin identificado por e-mail, área Contas para criar/resetar/excluir usuários, troca obrigatória de senha com modal quando senha padrão); restrições (variáveis de ambiente, .env opcional); dependências externas.
- **Consistência**: Versões (ex.: .NET 9), nomes de rotas, fluxos (modal de troca de senha, reset pelo Admin) e configuração do Admin devem coincidir entre README e project.md.

## Impact

- Affected specs: project-docs
- Affected code: README.md, openspec/project.md (apenas documentação)
