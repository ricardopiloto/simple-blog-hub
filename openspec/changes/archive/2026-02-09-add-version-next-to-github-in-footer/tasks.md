# Tasks: add-version-next-to-github-in-footer

## 1. Alterar o rodapé (Footer.tsx)

- [x] 1.1 Em `frontend/src/components/layout/Footer.tsx`, unir o parágrafo do link "Código no GitHub" e o parágrafo da versão num único `<p>`: o link "Código no GitHub" (com ícone, target _blank, noopener noreferrer) seguido de um separador (ex.: " · ") e do texto da versão (`__APP_VERSION__ === '0.0.0' ? 'Versão dev' : \`Versão ${__APP_VERSION__}\``). Manter a mesma classe de estilo (text-xs text-muted-foreground/80) para o parágrafo.
- [x] 1.2 Remover o `<p>` separado que contém apenas a versão.

## 2. Spec delta branding

- [x] 2.1 Em `openspec/changes/add-version-next-to-github-in-footer/specs/branding/spec.md`, ADDED requirement: a versão da aplicação no rodapé **deve** ser exibida **na mesma linha** (ou no mesmo bloco) que o link "Código no GitHub", com separador opcional (ex.: " · ") entre o link e o texto da versão, de forma a agrupar repositório e versão. Incluir cenário: quando o utilizador visualiza o rodapé, vê o link para o GitHub e a versão no mesmo parágrafo/linha.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-version-next-to-github-in-footer --strict` e corrigir falhas.
