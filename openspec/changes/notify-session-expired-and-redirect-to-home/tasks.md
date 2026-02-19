# Tasks: notify-session-expired-and-redirect-to-home

## 1. Modal de sessão expirada e integração no AuthContext

- [x] 1.1 No **AuthContext** (ou num componente/provider que tenha acesso a `useNavigate` e que seja filho de `BrowserRouter`), adicionar estado para controlar a visibilidade do modal de sessão expirada (ex.: `sessionExpiredOpen: boolean`) e uma função **openSessionExpiredModal()** que define esse estado como true. Expor ambos no valor do contexto (ex.: adicionar ao tipo e ao Provider).
- [x] 1.2 Renderizar um **modal/dialog** (ex.: AlertDialog ou Dialog do shadcn) quando `sessionExpiredOpen` for true, com título e mensagem explícitos (ex.: "Sessão expirada" / "A sua sessão expirou. Por favor, autentique-se novamente.") e um botão "Entendido" (ou equivalente). Ao fechar o modal (botão ou overlay): definir `sessionExpiredOpen` como false; se a rota atual for `/area-autor` ou subcaminho (ex.: `location.pathname.startsWith('/area-autor')`), chamar `navigate('/', { replace: true })`. O modal deve estar montado num nível que permaneça visível após `logout()` (ex.: no mesmo AuthProvider, que não desmonta ao fazer logout).
- [x] 1.3 Garantir que o AuthProvider (ou o componente que renderiza o modal) está dentro de `BrowserRouter` para poder usar `useNavigate`; se o AuthContext não tiver acesso ao router, usar um componente wrapper que consuma o contexto e o router e renderize o modal.

## 2. Substituir redirect para /login por abertura do modal

- [x] 2.1 Em **frontend/src/pages/AreaAutor.tsx**, no `useEffect` que reage a `error === 'Unauthorized'` e no `catch` de `handleDelete`: em vez de `navigate('/login', { replace: true })`, chamar **openSessionExpiredModal()** (mantendo `logout()`). Remover o `navigate('/login')` desses pontos.
- [x] 2.2 Em **frontend/src/pages/AreaAutorDashboard.tsx**, idem: onde se faz `logout()` e `navigate('/login')` por Unauthorized, passar a chamar `logout()` e **openSessionExpiredModal()**.
- [x] 2.3 Em **frontend/src/pages/AreaContas.tsx**, idem: substituir o redirect para login por `openSessionExpiredModal()` quando o erro for Unauthorized.

## 3. Tratar Unauthorized em PostEdit e outros fluxos protegidos

- [x] 3.1 Em **frontend/src/pages/PostEdit.tsx** (e em qualquer outro componente que chame `requestWithAuth` e possa receber 401), em blocos catch que tratem falhas de API: se o erro for `Error` com `message === 'Unauthorized'`, chamar `logout()` e **openSessionExpiredModal()** em vez de apenas mostrar erro genérico ou redirecionar para login. Verificar se já existe tratamento e alinhar ao novo fluxo.

## 4. Spec delta auth

- [x] 4.1 Criar **openspec/changes/notify-session-expired-and-redirect-to-home/specs/auth/spec.md** com um requisito **ADDED**: quando o frontend recebe **401 Unauthorized** (token expirado ou inválido), o sistema SHALL (1) fazer **logout** (limpar token e estado de autenticação); (2) exibir um **modal/dialog** com mensagem explícita de que a sessão expirou e que o utilizador deve autenticar-se novamente; (3) quando o utilizador dispensar o modal, se estava na **área do autor** (`/area-autor` ou subcaminhos), **redirecionar para a página inicial** (`/`). Cenários: utilizador na área do autor recebe 401 → vê modal "Sessão expirada..." → ao fechar é redirecionado para /; utilizador noutra página recebe 401 → vê o mesmo modal → ao fechar redireciona para / ou mantém (especificar).

## 5. Validação

- [x] 5.1 Executar `openspec validate notify-session-expired-and-redirect-to-home --strict` e corrigir até passar.
