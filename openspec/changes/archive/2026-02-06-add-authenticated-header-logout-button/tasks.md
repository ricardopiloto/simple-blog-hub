## 1. Análise e design leve

- [x] 1.1 Confirmar comportamento atual do `Header` (desktop e mobile) e do `AuthContext` (disponibilidade de `logout()` e `isAuthenticated`).
- [x] 1.2 Definir rótulo/ícone para o botão de logout (ex.: texto "Sair") e comportamento de navegação após logout (ex.: redirecionar para `/`).

## 2. Implementação do botão de logout no header

- [x] 2.1 Atualizar `src/components/layout/Header.tsx` para importar e usar `logout` a partir de `useAuth`.
- [x] 2.2 Adicionar botão/ação de **Logout** na navegação **desktop**, visível apenas quando `isAuthenticated === true`, localizado ao lado de "Área do autor".
- [x] 2.3 Adicionar ação de **Logout** no menu **mobile**, visível apenas quando `isAuthenticated === true`, próxima aos links autenticados (Área do autor / Contas), garantindo que o menu feche após o clique.
- [x] 2.4 Garantir que o botão/ação de Logout chame `logout()` corretamente e, se configurado, redirecione o usuário para `/`.

## 3. Documentação e validação

- [x] 3.1 Atualizar `README.md` e/ou `openspec/project.md` (se necessário) para mencionar que o menu superior exibe um botão de logout quando o usuário estiver autenticado.
- [x] 3.2 Validar manualmente o fluxo: login → header mostra Área do autor + Logout; clicar em Logout limpa sessão, oculta itens autenticados e (se aplicável) redireciona para `/`.
- [x] 3.3 Rodar `npm run lint` no frontend (ou outro comando de linting/documentado) para garantir que as alterações no header não introduziram lints.

