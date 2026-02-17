# Proposal: Adicionar link "Personagens" no menu superior (header)

## Summary

No **menu superior** (header) do blog, adicionar um novo item **"Personagens"** imediatamente **após** "Índice da História". O item deve ser um **link externo** que redireciona para **https://1nodado.com.br**, abrindo em nova aba (`target="_blank"` com `rel="noopener noreferrer"`). O link deve aparecer tanto na navegação **desktop** como no **menu móvel** (hamburger), na mesma posição relativa.

## Why

- **Experiência do utilizador:** O blog e o site de personagens (1nodado.com.br) são recursos complementares; um acesso rápido no header permite aos leitores navegar entre ambos sem abandonar o contexto.
- **Posição:** Colocar após "Índice da História" mantém a ordem lógica: conteúdo do blog (Início, Artigos, Índice) e depois o recurso externo (Personagens), antes dos itens de autenticação (Área do autor, Contas, Login/Sair).

## What Changes

- **frontend/src/components/layout/Header.tsx:** Inserir, na navegação desktop (`<nav className="hidden md:flex ...">`), um link **após** o link "Índice da História" e **antes** do bloco condicional `{isAuthenticated ? ...}`. O link deve usar `<a href="https://1nodado.com.br" target="_blank" rel="noopener noreferrer">` (não React Router `<Link>`) para abrir em nova aba. Texto visível: "Personagens". Estilo igual aos demais itens do menu (ex.: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`). Na navegação móvel (menu expansível), inserir o mesmo link na mesma posição relativa (após "Índice da História", antes dos itens de autenticação), com `onClick={() => setIsMenuOpen(false)}` para fechar o menu ao clicar.

## Goals

- No header (desktop e móvel), o utilizador vê o item "Personagens" logo após "Índice da História".
- Ao clicar em "Personagens", abre-se https://1nodado.com.br numa nova aba; o site do blog permanece na aba atual.

## Scope

- **In scope:** Um único novo item de menu no Header, link externo para https://1nodado.com.br, mesma posição em desktop e móvel.
- **Out of scope:** Configuração da URL por variável de ambiente; ícone no item; alteração de outros itens do menu; conteúdo ou páginas em 1nodado.com.br.

## Affected code and docs

- **frontend/src/components/layout/Header.tsx** — adicionar link "Personagens" (desktop e móvel) após "Índice da História".
- **openspec/changes/add-personagens-menu-link/specs/branding/spec.md** — delta ADDED com requisito e cenário para o link Personagens no header.

## Dependencies and risks

- **Dependências:** Nenhuma.
- **Riscos:** Nenhum. Link externo com `rel="noopener noreferrer"` é a prática recomendada para segurança.

## Success criteria

- No header (desktop), entre "Índice da História" e "Área do autor" (ou "Login") existe o item "Personagens".
- No menu móvel, entre "Índice da História" e os itens seguintes existe o item "Personagens".
- Clicar em "Personagens" abre https://1nodado.com.br numa nova aba.
- `openspec validate add-personagens-menu-link --strict` passa.
