# Change: Remover menções e ícone do Lovable; manter só referência de criação no README

## Why

O projeto não deve exibir branding do Lovable na interface (ícone/badge injetado pelo plugin) nem em metadados da página (título, descrição, og/twitter). Manter uma única referência no README informando que o Lovable foi utilizado na criação do projeto atende a atribuição sem poluir a experiência do usuário nem o código.

## What Changes

- **index.html**: Substituir título "Lovable App", description, author e meta og/twitter por valores do Simple Blog Hub (título, descrição e autor adequados; remover imagens/links do Lovable).
- **vite.config.ts**: Remover import e uso do plugin `componentTagger` do pacote `lovable-tagger` (elimina o ícone/badge do Lovable na página em desenvolvimento).
- **package.json**: Remover a dependência de desenvolvimento `lovable-tagger`.
- **README.md**: Remover a seção de deploy e edição que fala de Lovable (Share → Publish, domínio, edição no Lovable). Deixar apenas uma frase no README creditando o Lovable como ferramenta de criação (ex.: "Este projeto foi criado com [Lovable](https://lovable.dev).").
- **openspec/project.md**: Remover referências ao Lovable em Git Workflow e External Dependencies (ou reduzir a uma menção mínima de “criado com Lovable” se desejado; alinhado à decisão de uma única referência no README).

## Impact

- Affected specs: nova capacidade `branding` (ausência de branding de ferramenta de criação na UI e meta; crédito apenas no README).
- Affected code: `index.html`, `vite.config.ts`, `package.json`, `README.md`, `openspec/project.md`.
