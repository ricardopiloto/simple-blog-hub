# Change: Atualizar README com descrição do projeto e instruções de execução

## Why

O README atual é o template genérico do Lovable e não descreve o **Simple Blog Hub** nem as instruções corretas para rodar o projeto (frontend-only, dados mock, sem backend). Atualizar o README melhora a onboarding e deixa explícito o que o projeto faz e como executá-lo.

## What Changes

- Reescrever o README para incluir: o que é o Simple Blog Hub (blog de leitura, dados mock, sem backend), tecnologias usadas (alinhado ao `openspec/project.md`), instruções para clonar, instalar dependências, rodar em desenvolvimento, build e testes.
- Manter referências ao Lovable (deploy, domínio customizado) como opcionais, sem ser o foco principal.
- Garantir que os comandos documentados (`npm install`, `npm run dev`, `npm run build`, `npm run test`) correspondam ao `package.json` atual.

## Impact

- Affected specs: nova capacidade `project-docs` (documentação do repositório).
- Affected code: `README.md` apenas.
