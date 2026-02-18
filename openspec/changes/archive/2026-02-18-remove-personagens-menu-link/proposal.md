# Proposal: Remover o link "Personagens" do menu e fazer o título do site redirecionar para 1nodado.com.br

## Summary

Alterar o **menu superior** (header) em dois pontos: (1) **Remover** o item **"Personagens"** da navegação (desktop e móvel), revertendo a implementação da change add-personagens-menu-link. (2) **Fazer o título do site** (logo: ícone + texto "noDado RPG") redirecionar para **https://1nodado.com.br** em vez da página inicial do blog (`/`). Assim, o título passa a ser o acesso principal ao site 1nodado.com.br; o blog deixa de ter um item "Personagens" no menu e a home do blog continua acessível pelos restantes links (ex.: "Início" ou primeiro item da nav, se existir).

## Why

- **Decisão de produto:** O link "Personagens" como item de menu deixa de existir; o **título/logo** assume o papel de entrada para o site 1nodado.com.br, mantendo uma única e clara forma de ir ao site principal a partir do header.
- **Consistência:** O header deixa de ter um item de nav "Personagens" e passa a ter o logo como link externo para 1nodado.com.br (na mesma aba), enquanto os demais itens continuam a ser links internos do blog.

## What Changes

- **frontend/src/components/layout/Header.tsx:**  
  - **Remover** o bloco do link "Personagens" na navegação desktop e no menu móvel (o `<a href="https://1nodado.com.br" ...>Personagens</a>` em ambos os contextos).  
  - **Alterar o logo/título:** substituir o `<Link to="/">` que envolve o DiceIcon e o texto "noDado RPG" por um `<a href="https://1nodado.com.br">` (link externo). Abrir na **mesma aba** (sem `target="_blank"`), para que o clique no título leve o utilizador ao site 1nodado.com.br. Manter as mesmas classes de estilo (ex.: `flex items-center gap-1.5`) e o aspeto visual do logo. Para links externos na mesma aba não é obrigatório `rel="noopener noreferrer"`; pode ser omitido ou incluído por consistência.

## Goals

- O header (desktop e móvel) deixa de exibir o item "Personagens".
- Ao clicar no **título do site** (ícone + "noDado RPG"), o utilizador é redirecionado para https://1nodado.com.br na mesma aba.
- A ordem dos itens de nav restantes mantém-se (Início, Artigos, Índice da História, depois itens de autenticação).

## Scope

- **In scope:** Remoção do item "Personagens" no Header (desktop e móvel); alteração do link do logo/título para https://1nodado.com.br; spec delta REMOVED para o requisito Personagens e ADDED para o logo apontar para 1nodado.com.br.
- **Out of scope:** Alterar outros itens do menu além do logo e do Personagens; abrir o link do título em nova aba (fica opcional ou para decisão posterior); alterar o rodapé ou outras referências ao site.

## Affected code and docs

- **frontend/src/components/layout/Header.tsx** — remover os dois blocos do link "Personagens" (desktop e móvel); alterar o elemento do logo de `<Link to="/">` para `<a href="https://1nodado.com.br">`.
- **openspec/changes/remove-personagens-menu-link/specs/branding/spec.md** — delta REMOVED para o requisito "Header inclui link Personagens"; delta ADDED para o requisito "Logo/título do header redireciona para https://1nodado.com.br".

## Dependencies and risks

- **Dependências:** Nenhuma.
- **Riscos:** O utilizador que clicar no título sai do blog e vai para 1nodado.com.br (comportamento intencional). Quem quiser a página inicial do blog deve usar o link "Início" na nav, se existir.

## Success criteria

- Na navegação desktop, não existe item "Personagens" após "Índice da História".
- No menu móvel, não existe item "Personagens" após "Índice da História".
- Clicar no título do site (logo "noDado RPG") redireciona para https://1nodado.com.br na mesma aba.
- `openspec validate remove-personagens-menu-link --strict` passa.
