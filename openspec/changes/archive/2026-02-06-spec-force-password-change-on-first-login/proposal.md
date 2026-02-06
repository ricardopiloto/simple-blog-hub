# Change: Especificar troca obrigatória de senha no primeiro login (modal bloqueante)

## Why

O sistema já implementa (via change `update-admin-account-first-login-flow`) a obrigatoriedade de troca de senha para usuários que ainda usam a senha padrão: o backend marca o usuário com `MustChangePassword`, o login retorna `must_change_password` e o frontend exibe um modal de troca de senha. Este change formaliza esse comportamento como uma **especificação dedicada**, garantindo que fique explícito que (1) o sistema marca que o usuário ainda não trocou a senha padrão, (2) no primeiro acesso à área autenticada o sistema exibe um modal que **obriga** a alteração da senha e (3) esse modal **não pode ser fechado** até o usuário trocar a senha com sucesso (sem Escape, sem clique fora, sem botão de fechar).

Assim, a capacidade fica documentada de forma clara para desenvolvedores e ferramentas (incluindo agentes OpenSpec), com cenários verificáveis.

## What Changes

- **Especificação (spec)**: Nova capacidade `force-password-change-on-first-login` com requisitos ADDED que definem:
  - O sistema **deve** marcar usuários que ainda não trocaram a senha padrão (ex.: campo `MustChangePassword` no usuário; ativado na criação com senha padrão e no reset de senha pelo Admin).
  - Na primeira entrada na área autenticada com essa marca ativa, o sistema **deve** exibir um modal de troca obrigatória de senha.
  - O modal **não pode** ser fechado pelo usuário até que a troca de senha seja concluída com sucesso: sem fechamento por tecla Escape, por clique fora do modal ou por qualquer controle de “fechar” que permita ignorar a troca. A única forma de sair do bloqueio é alterar a senha com sucesso, após o que o backend limpa a flag e o frontend libera o uso da área logada.
- **Documentação**: Alinhar `openspec/project.md` (se necessário) para referenciar que o modal de troca obrigatória é bloqueante e não-dismissível até a conclusão da troca.
- **Implementação**: Nenhuma alteração de código é exigida por este change; a implementação atual (API, BFF, `ForceChangePasswordModal`, `ForceChangePasswordGate`) já atende aos requisitos. As tasks limitam-se a verificação e documentação.

## Impact

- Affected specs: nova spec `force-password-change-on-first-login`; possível menção em **project-docs** (project.md).
- Affected code: nenhum (change de especificação e documentação).
