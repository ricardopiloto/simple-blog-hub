# Proposal: Notificar sessão expirada e redirecionar para a página inicial

## Summary

Quando o **token JWT expira** (ou é inválido) e o utilizador ainda estava com a aplicação aberta na área logada, o sistema atualmente faz logout e redireciona para `/login` **sem informar** o utilizador do motivo. O utilizador fica sem perceber que a sessão expirou. Este change ajusta o comportamento para: (1) **notificar claramente** o utilizador com um **modal (popup)** a informar que a sessão expirou e que deve autenticar-se novamente; (2) quando o 401 ocorre **enquanto o utilizador está na área do autor** (qualquer rota sob `/area-autor`), após dispensar o modal **redirecionar para a página inicial** (`/`) em vez de para a página de login, para que o utilizador possa depois usar o link "Login" no header se quiser autenticar-se de novo.

## Why

- **Problema atual:** Após expiração do token, o utilizador é redirecionado para o login sem qualquer mensagem; ações na área logada falham silenciosamente ou com redirecionamento abrupto, gerando confusão.
- **Objetivo:** Deixar explícito que a **sessão expirou** e que é necessário **autenticar novamente**; quando estava na área do autor, levar o utilizador à **página inicial** após o aviso, em vez de à página de login, conforme pedido.

## What Changes

- **Frontend — fluxo 401:** Sempre que uma resposta **401 Unauthorized** for recebida (BFF rejeita o token por expirado ou inválido), o frontend SHALL: (1) fazer **logout** (limpar token e estado de autenticação); (2) exibir um **modal/dialog** com mensagem explícita (ex.: "A sua sessão expirou. Por favor, autentique-se novamente.") e um botão para dispensar (ex.: "Entendido"); (3) quando o utilizador dispensar o modal, se a rota atual for da **área do autor** (`/area-autor` ou subcaminhos), **navegar para a página inicial** (`/`). Se o 401 ocorrer fora da área do autor, o modal é exibido e, ao dispensar, pode manter-se na página atual ou ir para `/` conforme desenho (recomenda-se redirecionar para `/` em todos os casos para consistência).
- **Frontend — implementação:** Introduzir um mecanismo centralizado para "sessão expirada": por exemplo, no **AuthContext** (ou contexto dedicado) expor `openSessionExpiredModal()` e estado para exibir um modal; um **modal de sessão expirada** renderizado ao nível da aplicação (ex.: dentro de AuthProvider ou Layout) que mostra a mensagem e, ao ser fechado, navega para `/`. Todas as páginas que atualmente reagem a `Unauthorized` com `logout()` e `navigate('/login')` passam a chamar `logout()` e `openSessionExpiredModal()` em vez de navegar diretamente; o redirecionamento para `/` fica a cargo do modal quando o utilizador está na área do autor (ou sempre ao fechar).
- **Locais a atualizar:** AreaAutor.tsx, AreaAutorDashboard.tsx, AreaContas.tsx (e qualquer outro que trate 401 com redirect para login), além de possíveis chamadas a `requestWithAuth` em PostEdit ou outros que devam acionar o mesmo fluxo.

## Goals

- O utilizador vê sempre um **aviso claro** quando a sessão expira (modal com texto explícito).
- Quando o 401 ocorre na **área do autor**, após fechar o modal o utilizador é levado à **página inicial** (`/`).
- O comportamento fica consistente em qualquer ação protegida (listagem, edição, exclusão, contas, etc.) que receba 401.

## Scope

- **In scope:** Frontend: AuthContext (ou equivalente) com modal de sessão expirada; atualização dos handlers de Unauthorized nas páginas da área do autor e onde mais fizer sentido; redirecionamento para `/` ao dispensar o modal quando na área do autor.
- **Out of scope:** Alterar tempo de expiração do JWT no backend; refresh tokens; alterações no BFF além do que já devolve 401.

## Affected code and docs

- **frontend/src/contexts/AuthContext.tsx** (ou novo contexto/helper) — estado e função para abrir o modal de sessão expirada; opcionalmente renderizar o modal no provider.
- **frontend/src/App.tsx** ou **Layout** — garantir que o modal de sessão expirada seja exibido ao nível da app (acessível após logout).
- **frontend/src/pages/AreaAutor.tsx**, **AreaAutorDashboard.tsx**, **AreaContas.tsx** — substituir `navigate('/login')` por `openSessionExpiredModal()` (mantendo `logout()`).
- **frontend/src/pages/PostEdit.tsx** (e outros que usem requestWithAuth e tratem erro) — em catch de Unauthorized, chamar `logout()` e `openSessionExpiredModal()`.
- **openspec/changes/notify-session-expired-and-redirect-to-home/specs/auth/spec.md** — delta ADDED para o requisito de notificação e redirecionamento.

## Dependencies and risks

- **Dependências:** Nenhuma. O cliente já lança `Error('Unauthorized')` em 401 e as páginas já reagem; só se altera a reação (modal + redirect para /).
- **Riscos:** O modal deve estar montado num nível que não desmonte ao fazer logout (ex.: dentro de AuthProvider mas fora das rotas protegidas), para que continue visível até o utilizador dispensar.

## Success criteria

- Ao receber 401 em qualquer pedido autenticado, o utilizador vê um **modal** com mensagem do tipo "A sua sessão expirou. Por favor, autentique-se novamente." e um botão para fechar.
- Ao fechar o modal, se o utilizador estava em `/area-autor` ou subrota, é **redirecionado para** `/`.
- Após 401, o estado de autenticação é limpo (logout) e o header reflete utilizador não autenticado; o utilizador pode voltar a autenticar-se via "Login" no header.
- `openspec validate notify-session-expired-and-redirect-to-home --strict` passa.
