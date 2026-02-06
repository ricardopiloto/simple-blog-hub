## 1. Verificação do backend

- [x] 1.1 Confirmar que o modelo de usuário possui campo (ex.: `MustChangePassword`) que indica obrigatoriedade de troca de senha e que é definido como `true` na criação com senha padrão e no reset de senha pelo Admin.
- [x] 1.2 Confirmar que a resposta de login (API e BFF) inclui um indicador (ex.: `must_change_password`) quando o usuário deve trocar a senha.
- [x] 1.3 Confirmar que, após troca de senha bem-sucedida (ex.: PUT user com nova senha), a API limpa o flag `MustChangePassword` para esse usuário.

## 2. Verificação do frontend

- [x] 2.1 Confirmar que, quando `must_change_password === true` no contexto de auth, o usuário autenticado vê apenas o modal de troca de senha e não tem acesso às rotas/área autenticada (ex.: `ForceChangePasswordGate` envolvendo as rotas e exibindo somente o modal nesse caso).
- [x] 2.2 Confirmar que o modal de troca obrigatória não pode ser fechado por Escape, clique fora ou botão de fechar; apenas a conclusão bem-sucedida da troca de senha remove o bloqueio (ex.: `onOpenChange` no-op, `onPointerDownOutside` e `onEscapeKeyDown` com `preventDefault`).
- [x] 2.3 Confirmar que, após troca de senha com sucesso, o frontend atualiza o estado (ex.: `setMustChangePassword(false)`) e o modal é fechado, liberando o uso normal da área logada.

## 3. Documentação e validação

- [x] 3.1 Verificar se `openspec/project.md` (e README, se aplicável) descreve que o modal de troca obrigatória é bloqueante e não pode ser fechado até a alteração da senha; ajustar texto se necessário.
- [x] 3.2 Executar `openspec validate spec-force-password-change-on-first-login --strict` e corrigir qualquer falha de validação.
