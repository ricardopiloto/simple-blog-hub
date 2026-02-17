# Tasks: add-personagens-menu-link

## 1. Link Personagens na navegação desktop

- [x] 1.1 Em `frontend/src/components/layout/Header.tsx`, na `<nav className="hidden md:flex ...">`, inserir **após** o link "Índice da História" e **antes** do bloco `{isAuthenticated ? ...}` um link externo: texto "Personagens", `href="https://1nodado.com.br"`, `target="_blank"`, `rel="noopener noreferrer"`. Usar `<a>` (não `<Link>` do React Router). Aplicar as mesmas classes de estilo dos outros itens do menu (ex.: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`).

## 2. Link Personagens no menu móvel

- [x] 2.1 No mesmo ficheiro, no menu móvel (dentro do `{isMenuOpen && (...)}`), inserir **após** o link "Índice da História" e **antes** do bloco `{isAuthenticated ? ...}` o mesmo link "Personagens" para https://1nodado.com.br com `target="_blank"` e `rel="noopener noreferrer"`. Incluir `onClick={() => setIsMenuOpen(false)}` para fechar o menu ao clicar.

## 3. Spec delta branding

- [x] 3.1 Criar `openspec/changes/add-personagens-menu-link/specs/branding/spec.md` com um requisito ADDED: o header SHALL incluir um item de navegação "Personagens" imediatamente após "Índice da História", em desktop e no menu móvel; o item SHALL linkar para https://1nodado.com.br e abrir em nova aba (target="_blank", rel="noopener noreferrer"). Incluir um cenário: quando o utilizador clica em "Personagens" no header, a página https://1nodado.com.br abre numa nova aba.

## 4. Validação

- [x] 4.1 Executar `openspec validate add-personagens-menu-link --strict` e corrigir até passar.
