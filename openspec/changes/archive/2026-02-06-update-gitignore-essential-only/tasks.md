# Tasks: Ajustar .gitignore ao essencial

## 1. Conteúdo do .gitignore

- [x] 1.1 Garantir que o .gitignore inclua: `node_modules`, `dist`, `dist-ssr` (ou equivalente de build do frontend).
- [x] 1.2 Garantir que o .gitignore inclua artefatos .NET: `bin/`, `obj/`, `.vs/` em qualquer nível sob `backend/` (ou padrões que cubram `backend/**/bin`, `backend/**/obj`, `backend/**/.vs`).
- [x] 1.3 Garantir que o .gitignore inclua `.env` e arquivos de banco SQLite do backend (ex.: `backend/api/*.db`, `backend/api/*.db-*`).
- [x] 1.4 Garantir que o .gitignore inclua logs e temporários (ex.: `*.log`, `npm-debug.log*`, `*.local`).
- [x] 1.5 Garantir que o .gitignore inclua diretórios/arquivos de editor e OS (ex.: `.vscode/*` com `!.vscode/extensions.json` se desejado, `.idea`, `.DS_Store`, `*.suo`, `*.sw?`).
- [x] 1.6 Remover ou não incluir padrões que ignorem arquivos de projeto versionáveis: não ignorar `*.sln`, `*.csproj`, `*.njsproj` (para que solução e projetos sejam commitados).

## 2. Organização e validação

- [x] 2.1 Organizar o .gitignore em seções claras (ex.: Dependências, Build, Ambiente, Editor/OS, Backend) e manter apenas entradas necessárias.
- [x] 2.2 Executar `git status` após as alterações e confirmar que `node_modules`, `dist`, `backend/*/bin`, `backend/*/obj` e `.env` não aparecem como untracked a commitar; confirmar que `.sln` e `.csproj` continuam rastreáveis se existirem.
