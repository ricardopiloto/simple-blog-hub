# Tasks: remove-personagens-menu-link

## 1. Fazer o título do site (logo) redirecionar para 1nodado.com.br

- [x] 1.1 Em `frontend/src/components/layout/Header.tsx`, alterar o elemento do **logo/título**: substituir o `<Link to="/">` que envolve o DiceIcon e o texto "noDado RPG" por um `<a href="https://1nodado.com.br">`, mantendo as mesmas classes (ex.: `className="flex items-center gap-1.5"`) e o aspeto visual. O link deve abrir na mesma aba (não usar `target="_blank"`). Opcional: adicionar `rel="noopener noreferrer"` se o link for aberto noutra aba no futuro.

## 2. Remover link Personagens da navegação desktop

- [x] 2.1 No mesmo ficheiro, na `<nav className="hidden md:flex ...">`, remover o bloco completo do link "Personagens" (o `<a href="https://1nodado.com.br" target="_blank" rel="noopener noreferrer" ...>Personagens</a>`) que está após o link "Índice da História" e antes do bloco `{isAuthenticated ? ...}`.

## 3. Remover link Personagens do menu móvel

- [x] 3.1 No menu móvel (dentro do `{isMenuOpen && (...)}`), remover o bloco completo do link "Personagens" (o `<a href="https://1nodado.com.br" ... onClick={() => setIsMenuOpen(false)}>Personagens</a>`) que está após o link "Índice da História" e antes do bloco `{isAuthenticated ? ...}`.

## 4. Spec delta branding

- [x] 4.1 Em `openspec/changes/remove-personagens-menu-link/specs/branding/spec.md`: manter o requisito **REMOVED** (header não inclui item "Personagens"). Adicionar um requisito **ADDED**: o **logo/título** do header (ícone + "noDado RPG") SHALL linkar para **https://1nodado.com.br** e SHALL abrir na mesma aba (não target="_blank"). Incluir cenário: quando o utilizador clica no título do site no header, é redirecionado para https://1nodado.com.br na mesma aba.

## 5. Validação

- [x] 5.1 Executar `openspec validate remove-personagens-menu-link --strict` e corrigir até passar.
