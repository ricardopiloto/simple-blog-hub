# Colocar a versão do rodapé ao lado do link "Código no GitHub"

## Summary

Exibir a **versão da aplicação** no rodapé **na mesma linha** (ou no mesmo bloco visual) que o link **"Código no GitHub"**, em vez de numa linha separada. A versão continua a vir de `__APP_VERSION__` (definida à build). Objetivo: agrupar no rodapé a referência ao repositório e a versão, reduzindo linhas e tornando a informação mais compacta.

## Goals

1. **Footer.tsx:** No bloco inferior do rodapé (zona do copyright e links), colocar o link "Código no GitHub" e o texto da versão ("Versão X" ou "Versão dev") **no mesmo parágrafo** (ou na mesma linha), por exemplo: `Código no GitHub · Versão 1.8` ou `Código no GitHub` (link) seguido de ` · Versão 1.8` no mesmo `<p>`. Separador opcional (ex.: " · ") entre o link e a versão para legibilidade.
2. **Spec branding:** Refletir no spec que a versão é exibida ao lado do link do repositório GitHub (mesma linha/bloco), mantendo os requisitos existentes de link para o GitHub e de versão em tempo de build.

## Out of scope

- Alterar a fonte da versão (`__APP_VERSION__`, package.json ou VITE_APP_VERSION).
- Alterar o texto "Código no GitHub" ou o URL do repositório.
- Adicionar nova funcionalidade além do posicionamento no rodapé.

## Success criteria

- No rodapé, o link "Código no GitHub" e o texto da versão aparecem na mesma linha (ou no mesmo bloco visual), com separador opcional.
- O link continua a abrir numa nova aba com `rel="noopener noreferrer"`.
- A versão continua a ser "Versão dev" quando `__APP_VERSION__ === '0.0.0'`, caso contrário "Versão X".
- `openspec validate add-version-next-to-github-in-footer --strict` passa.
