# auth (delta)

## ADDED Requirements

### Requirement: Admin pode alterar o nome do autor ao editar uma conta

O sistema **deve** (SHALL) permitir que o **Admin** altere o **nome do autor** (nome exibido ao publicar e na área do autor) de qualquer conta ao editar essa conta na gestão de contas (Contas). A API **deve** aceitar um campo opcional `author_name` no `PUT /api/users/{id}` e, quando o chamador for Admin, **deve** atualizar o `Name` do `Author` associado ao utilizador alvo. O frontend **deve** exibir um campo "Nome do autor" no diálogo de edição de conta (apenas acessível ao Admin) e enviar o valor no payload de atualização.

#### Scenario: Admin altera o nome do autor ao editar uma conta

- **Dado** que o utilizador logado é o Admin
- **Quando** o Admin abre a gestão de contas, clica em "Editar" numa conta e altera o campo "Nome do autor" (ex.: de "Admin" para "Ricardo" ou de "Ana" para "Ana Luisa") e salva
- **Então** a API **deve** persistir o novo nome no `Author` associado a essa conta
- **E** o nome atualizado **deve** ser exibido na lista de contas e nos posts/publicações desse autor

#### Scenario: Não-Admin não pode alterar o nome do autor de outras contas

- **Quando** um utilizador não-Admin chama o endpoint de atualização de utilizador (PUT) com o identificador de outra conta e envia `author_name`
- **Então** a API **deve** recusar a alteração do nome (403 ou ignorar o campo `author_name`) e apenas permitir alteração da própria senha quando for o próprio utilizador
