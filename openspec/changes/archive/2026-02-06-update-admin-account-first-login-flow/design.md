## Context

O sistema já possui:
- Um Admin identificado por e-mail configurado (`Admin:Email` / `Admin__Email`).
- Criação automática da conta Admin inicial com senha padrão `senha123`.
- Área de gestão de contas (Contas) onde o Admin pode criar autores com senha padrão.
- Seção para o autor alterar a própria senha.

O que falta é: (1) uma forma explícita e segura de o Admin resetar senhas para o padrão `senha123`; (2) garantir que qualquer conta com senha padrão seja **obrigada** a trocar a senha no primeiro acesso, com bloqueio visual claro (modal) e sem depender apenas de disciplina do usuário.

## Goals / Non-Goals

- **Goals**
  - Permitir que o Admin resete a senha de qualquer usuário para `senha123`.
  - Marcar usuários com senha padrão como “precisam trocar a senha” e refletir isso no login (API/BFF → frontend).
  - Bloquear o uso da área logada até que a senha seja alterada via modal dedicado.
- **Non-Goals**
  - Não mudar o mecanismo de hash de senha (continua BCrypt).
  - Não introduzir multi-admin nem papéis adicionais além do Admin existente.

## Decisions

- **Campo de estado de senha**: Usar (ou introduzir) um campo booleano no modelo de usuário (ex.: `MustChangePassword`) para indicar que a senha atual é padrão ou que o usuário precisa trocar a senha no próximo login.
- **Origem do estado**:
  - Criação automática do Admin inicial → `MustChangePassword = true`.
  - Criação de novo autor pelo Admin com senha padrão → `MustChangePassword = true`.
  - Reset de senha pelo Admin → `MustChangePassword = true`.
  - Troca de senha bem-sucedida pelo próprio usuário → `MustChangePassword = false`.
- **Sinalização no login**: A API adiciona um campo `must_change_password` na resposta de login; o BFF repassa esse campo para o frontend junto com `is_admin` e o token.
- **UI bloqueante**: O frontend exibe um modal de “Trocar senha obrigatoriamente” quando `must_change_password === true` no contexto de auth. O modal deve impedir navegação normal na área logada até a conclusão da troca de senha.
- **Reset de senha**: Em vez de aceitar alteração arbitrária de senha pelo Admin, o reset será sempre para a senha padrão `senha123`, o que simplifica comunicação com o usuário (sempre sabe qual é a senha temporária) e ativa o fluxo de troca obrigatória.

## Risks / Trade-offs

- **Risco**: Usuários podem permanecer com senha padrão se o fluxo de modal não bloquear corretamente.
  - **Mitigação**: Modal bloqueante, verificação no frontend em cada inicialização de sessão (releitura do estado de auth).
- **Risco**: Expor demasiada informação sobre o estado da senha.
  - **Mitigação**: `must_change_password` é um sinalizador interno ao cliente e não revela qual é a senha nem se ela é fraca; apenas indica a necessidade de troca.

## Migration Plan

1. Adicionar campo `MustChangePassword` ao modelo de usuário e migrar o banco, marcando `true` para contas que foram criadas via fluxo de senha padrão (quando possível inferir).
2. Atualizar criação automática do Admin inicial e criação de autores pelo Admin para definir `MustChangePassword = true`.
3. Implementar endpoint de reset de senha (Admin) e marcar `MustChangePassword = true`.
4. Alterar login (API/BFF) para retornar `must_change_password`.
5. Implementar modal obrigatório no frontend e ação de reset na tela de Contas.
6. Testar fluxos end-to-end (Admin inicial, novo autor, reset de senha).

## Open Questions

- Como tratar contas legadas criadas antes de existir `MustChangePassword`? (possível resposta: assumir `false` e confiar na troca manual já realizada).
- O Admin deve poder resetar a própria senha para `senha123` ou apenas a dos outros usuários? (padrão sugerido: permitir, mas exigir troca imediata via modal como qualquer outra conta).

