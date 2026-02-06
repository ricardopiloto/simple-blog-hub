# Change: Refatorar gestão de contas com Admin fixo e troca de senha obrigatória

## Why

A gestão de contas já prevê um Admin configurado por e-mail, criação de autores com senha padrão `senha123` e uma área de Contas, mas hoje a troca de senha no primeiro acesso não é realmente **forçada** e não existe um fluxo claro de **reset de senha** pelo Admin. Precisamos garantir que qualquer conta criada ou resetada com a senha padrão seja obrigada a trocar a senha no primeiro login (com um modal bloqueando o uso da área logada) e que o Admin tenha uma ação explícita de reset de senha na tela de gestão de contas.

## What Changes

- **Admin principal**: Manter o modelo atual em que o Admin é identificado pelo e-mail configurado (`Admin:Email` / `Admin__Email`), com recomendação de uso de `ac.ricardosobral@gmail.com` na documentação para este ambiente.
- **Reset de senha pelo Admin**: Na área de gestão de contas, adicionar ação para o Admin resetar a senha de qualquer usuário para o padrão `senha123`. A API/BFF devem expor endpoint dedicado de reset que marque o usuário como “precisa trocar a senha”.
- **Flag de primeiro acesso / senha padrão**: Introduzir (ou tornar explícito) um campo de estado no usuário (ex.: `MustChangePassword`), ativado quando a conta é criada com senha padrão (Admin inicial, novos autores criados pelo Admin, resets de senha).
- **Login com senha padrão**: No login, quando o usuário autenticar com senha padrão e `MustChangePassword` estiver ativo, a API/BFF devem retornar um sinalizador (ex.: `must_change_password: true`) além do `is_admin`.
- **Modal obrigatório de troca de senha**: No frontend, ao detectar `must_change_password === true`, abrir um modal bloqueante na área logada exigindo que o usuário defina uma nova senha antes de acessar qualquer outra funcionalidade. Após sucesso na troca, a flag deve ser limpa e o modal fechado.

## Impact

- Affected specs: auth
- Affected code: API (modelo User/Author, login, endpoints de gestão de usuários/reset de senha), BFF (login e repasse do estado de troca obrigatória), frontend (contexto de auth, rotas protegidas, tela de Contas com ação de reset, modal de troca obrigatória de senha).

