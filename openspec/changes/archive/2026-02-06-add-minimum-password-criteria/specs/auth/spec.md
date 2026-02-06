# auth (delta)

## ADDED Requirements

### Requirement: Critério mínimo de senha

Quando uma senha é **definida** pelo utilizador ou pelo Admin (criação de conta com senha explícita, edição de conta com nova senha, alterar minha senha), o sistema **deve** (SHALL) validar que a senha cumpre um **critério mínimo**: (1) pelo menos **6 caracteres**; (2) pelo menos **uma letra maiúscula** (A-Z); (3) pelo menos **um número** (0-9). Se a senha não cumprir, a API **deve** rejeitar o pedido (ex.: 400 Bad Request) com uma mensagem clara. A senha padrão definida pelo sistema (ex.: em criação sem senha ou em reset de senha) **não** está sujeita a esta validação. O frontend **deve** exibir o critério junto aos formulários de senha.

#### Scenario: Senha válida é aceite

- **Quando** o utilizador ou o Admin define uma senha que tem pelo menos 6 caracteres, pelo menos uma letra maiúscula e pelo menos um número (ex.: "Senha1")
- **Então** a API **deve** aceitar e persistir a senha (em hash)
- **E** o login com essa senha deve funcionar

#### Scenario: Senha sem maiúscula é rejeitada

- **Quando** o utilizador ou o Admin envia uma senha com 6 ou mais caracteres e um número mas **sem** letra maiúscula (ex.: "senha123")
- **Então** a API **deve** retornar 400 Bad Request (ou equivalente)
- **E** a mensagem deve indicar que é necessário uma letra maiúscula (ou descrever o critério completo)
- **E** a senha **não** deve ser alterada

#### Scenario: Senha sem número é rejeitada

- **Quando** o utilizador ou o Admin envia uma senha com 6 ou mais caracteres e uma maiúscula mas **sem** número (ex.: "SenhaAb")
- **Então** a API **deve** retornar 400 Bad Request
- **E** a senha **não** deve ser alterada

#### Scenario: Senha com menos de 6 caracteres é rejeitada

- **Quando** o utilizador ou o Admin envia uma senha com menos de 6 caracteres (ex.: "Ab1")
- **Então** a API **deve** retornar 400 Bad Request
- **E** a senha **não** deve ser alterada
