# Change: Ajustar .gitignore ao essencial

## Why

O `.gitignore` atual não cobre artefatos de build e dependências do .NET (bin, obj, pacotes) e não ignora `.env`, permitindo que secrets ou configuração local sejam commitados. Também ignora `*.sln` e `*.njsproj`, o que impede versionar arquivos de solução e projeto. É necessário deixar somente o necessário: ignorar dependências (node_modules, bin/obj do .NET), builds (dist, saída do .NET), arquivos sensíveis (.env) e lixo de editor/OS, sem ignorar arquivos de projeto que devem ser versionados.

## What Changes

- Revisar e reescrever `.gitignore` na raiz do repositório.
- Garantir que sejam ignorados: `node_modules`, `dist` (e equivalentes de build do frontend); diretórios de build e dependências do .NET (`bin/`, `obj/`, `.vs/`, `packages/` se existir); `.env`; arquivos de banco SQLite do backend; logs e arquivos temporários; diretórios/arquivos de editor e OS (`.vscode/*` com exceção desejada, `.idea`, `.DS_Store`, etc.).
- Remover entradas que impeçam versionar arquivos de projeto: não ignorar `*.sln` nem `*.njsproj`/`.csproj` (ou equivalentes), para que solução e projetos .NET e Node sejam commitados.
- Manter o arquivo enxuto e organizado por categoria (dependências, build, ambiente, editor/OS, backend).

## Impact

- **Affected specs:** project-docs (novo requisito sobre conteúdo do .gitignore).
- **Affected code:** `.gitignore` na raiz.
