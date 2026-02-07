# story-index — delta for fix-story-order-save-204-no-content

## ADDED Requirements

### Requirement: Cliente trata resposta 204 No Content ao salvar ordem

O endpoint que persiste a ordem (PUT /bff/posts/story-order) **deve** (SHALL) devolver **204 No Content** em caso de sucesso (sem corpo na resposta). O cliente do frontend **deve** (SHALL) tratar essa resposta **sem tentar parsear JSON** no corpo (evitando o erro "Unexpected end of JSON input"), de forma que o fluxo "Salvar ordem" no Índice da História conclua com sucesso e o utilizador veja a confirmação (ex.: toast "Ordem salva!").

#### Scenario: Salvar ordem com sucesso sem erro de JSON

- **Dado** que o utilizador está autenticado e em modo "Editar ordem" no Índice da História
- **E** alterou a ordem e clica em "Salvar ordem"
- **Quando** o BFF responde com 204 No Content (sucesso, sem corpo)
- **Então** o cliente não tenta parsear o corpo como JSON
- **E** o utilizador vê a mensagem de sucesso (ex.: "Ordem salva!") e a ordem fica persistida
- **E** não ocorre o erro "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
