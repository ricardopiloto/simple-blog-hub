# bff-api-security (delta)

## Purpose

Define a proteção da comunicação entre o BFF e a API através de uma chave partilhada que nunca é exposta ao frontend.

## ADDED Requirements

### Requirement: API exige chave partilhada quando configurada; BFF envia a chave; frontend não tem acesso

A **API** **DEVE** (SHALL) aceitar um header (ex.: `X-Api-Key`) que contenha a **chave partilhada** configurada no servidor (ex.: `API:InternalKey` ou `API__InternalKey`). Quando esta chave **está configurada e não é vazia**, a API **DEVE** rejeitar com **401 Unauthorized** qualquer pedido que não inclua o header com o valor idêntico. Quando a chave **não** está configurada (ou é vazia), a API **PODE** aceitar pedidos sem o header, para permitir desenvolvimento local. O **BFF** **DEVE** enviar em cada pedido à API o header com a chave partilhada quando esta estiver configurada no BFF. A chave **NUNCA** é exposta ao frontend: é lida apenas da configuração do servidor (appsettings ou variáveis de ambiente) no BFF e na API; o frontend comunica apenas com o BFF e não tem acesso a esta configuração.

#### Scenario: Pedido à API sem header da chave é rejeitado quando a chave está configurada

- **Dado** que a API tem a chave partilhada configurada (ex.: `API:InternalKey` com valor "my-secret")
- **Quando** um cliente envia um pedido à API **sem** o header `X-Api-Key` (ou com valor diferente)
- **Então** a API responde com **401 Unauthorized**
- **E** o corpo da resposta não expõe a chave

#### Scenario: BFF envia a chave e a API aceita o pedido

- **Dado** que a API e o BFF têm a **mesma** chave configurada
- **Quando** o BFF envia um pedido à API incluindo o header `X-Api-Key` com esse valor
- **Então** a API aceita o pedido e processa normalmente
- **E** a resposta é devolvida ao BFF e, quando aplicável, ao frontend sem incluir a chave

#### Scenario: Frontend nunca tem acesso à chave

- **Dado** que a chave está configurada no BFF e na API
- **Quando** o frontend faz pedidos ao BFF (login, listar posts, etc.)
- **Então** as respostas do BFF não contêm o valor da chave
- **E** o frontend não envia nem armazena a chave; toda a comunicação com a API é feita pelo BFF no servidor

#### Scenario: Sem chave configurada, a API aceita pedidos (desenvolvimento)

- **Dado** que a API **não** tem a chave partilhada configurada (ou o valor está vazio)
- **Quando** o BFF (ou outro cliente) envia um pedido à API sem o header da chave
- **Então** a API aceita o pedido (comportamento compatível com desenvolvimento local)
- **E** não é necessário configurar a chave para desenvolvimento
