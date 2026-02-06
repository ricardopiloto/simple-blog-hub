# Tasks: Critério mínimo de senha

## 1. API – validação

- [x] 1.1 Criar um helper de validação (ex.: método estático ou serviço) que, dado uma string de senha, retorna se é válida: comprimento ≥ 6, pelo menos um carácter maiúscula (A-Z), pelo menos um dígito (0-9). Expor uma mensagem de erro fixa em português (ex.: "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número").
- [x] 1.2 Em **CreateUser**: quando `request.Password` for não nulo e não vazio (trim), validar com o helper antes de criar o utilizador; se inválida, retornar 400 Bad Request com a mensagem.
- [x] 1.3 Em **UpdateUser**: quando `request.Password` for não nulo e não vazio (trim), validar com o helper antes de atualizar; se inválida, retornar 400 Bad Request com a mensagem.

## 2. Frontend – critério visível e opcional validação

- [x] 2.1 Exibir o critério mínimo junto aos campos de senha: "Mínimo 6 caracteres, uma letra maiúscula e um número" (ex.: texto de ajuda em AreaContas no diálogo Nova conta e Editar conta; em AreaAutor na secção Alterar minha senha; em ForceChangePasswordModal). Usar o mesmo texto em todos os pontos.
- [x] 2.2 (Opcional) Validar no cliente antes de enviar: se a senha não cumprir o critério, desabilitar submissão ou exibir erro e não chamar a API. Reutilizar a mesma regra (6+ caracteres, 1 maiúscula, 1 número).

## 3. Documentação

- [x] 3.1 Atualizar `openspec/project.md` (e/ou README): na secção de gestão de contas ou requisitos, indicar que as senhas definidas pelo utilizador ou Admin devem cumprir o critério mínimo (6 caracteres, uma letra maiúscula e um número).

## 4. Validação

- [x] 4.1 Build da API e do frontend. Validar manualmente: tentar criar ou alterar senha com menos de 6 caracteres ou sem maiúscula ou sem número e confirmar 400 e mensagem; com senha válida (ex.: "Senha1") confirmar sucesso.
