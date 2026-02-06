# Change: Critério mínimo de senha

## Why

Reforçar a segurança das contas exigindo um **critério mínimo de senha** quando o utilizador ou o Admin define uma senha: pelo menos 6 caracteres, com **pelo menos uma letra maiúscula** e **pelo menos um número**. A senha padrão usada em criação/reset (ex.: `senha123`) continua a ser definida pelo sistema sem esta validação; a validação aplica-se quando uma senha é **escolhida** (criação de conta com senha explícita, edição de conta com nova senha, alterar minha senha).

## What Changes

- **API**: Antes de aceitar uma senha em **CreateUser** (quando `request.Password` é fornecido) e em **UpdateUser** (quando `request.Password` é fornecido), validar: comprimento ≥ 6, pelo menos um carácter em `A-Z`, pelo menos um carácter em `0-9`. Se falhar, retornar 400 Bad Request com mensagem clara (ex.: "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número"). Não validar quando a API define a senha para o valor padrão (CreateUser sem password, ResetPassword).
- **BFF**: Opcionalmente repetir a validação no BFF para devolver erro mais rápido; o contrato do cliente pode documentar o critério.
- **Frontend**: Exibir o critério junto aos formulários de senha (criar conta, editar conta, alterar minha senha, modal de troca obrigatória): "Mínimo 6 caracteres, uma letra maiúscula e um número". Opcionalmente validar no cliente antes de enviar e desabilitar submissão se não cumprir.
- **Spec**: Extensão da capability **auth**: novo requisito que exige o critério mínimo de senha quando uma senha é definida pelo utilizador ou pelo Admin.

## Impact

- Affected specs: **auth** (ADDED requirement).
- Affected code: `backend/api/Controllers/UsersController.cs` (validação em CreateUser e UpdateUser quando password é fornecida); possivelmente um helper partilhado de validação; `src/pages/AreaContas.tsx`, `src/components/ForceChangePasswordModal.tsx`, `src/pages/AreaAutor.tsx` (texto de ajuda e opcional validação); `openspec/project.md` e README (documentar o critério).
