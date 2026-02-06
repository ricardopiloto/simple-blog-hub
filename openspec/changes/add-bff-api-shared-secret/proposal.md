# Change: Chave partilhada entre BFF e API para segurança

## Why

A API é interna e só deve ser chamada pelo BFF; o frontend nunca acede à API diretamente. Para reforçar a segurança, deve existir uma **chave única partilhada** entre o BFF e a API: o BFF envia essa chave em cada pedido à API e a API só aceita pedidos que apresentem a chave correta. Assim, mesmo que o URL da API seja descoberto (ex.: em rede interna), chamadas diretas à API sem a chave são rejeitadas. A chave **não é exposta ao frontend** (configurada apenas no servidor, no BFF e na API), reduzindo superfície de ataque e evitando que um atacante possa invocar a API directamente. (Nota: SQL injection é mitigado pelo uso de queries parametrizadas na API; a chave impede acesso não autorizado à API.)

## What Changes

- **API**: Configuração opcional (ex.: `API:InternalKey` ou `ApiKey:Secret`) com o valor da chave. Quando configurada, a API **rejeita** (401) qualquer pedido que não inclua um header (ex.: `X-Api-Key`) com o mesmo valor. Quando a chave **não** está configurada (ex.: desenvolvimento local), a API pode aceitar todos os pedidos para manter compatibilidade com ambientes sem esta configuração.
- **BFF**: Configuração com o **mesmo** valor (ex.: `API:InternalKey` ou `ApiKey:Secret`). O cliente HTTP que chama a API adiciona o header `X-Api-Key` (ou equivalente) em todos os pedidos com esse valor. A chave é lida apenas de appsettings ou variáveis de ambiente do processo; nunca é exposta ao frontend.
- **Documentação**: O **README** deve incluir instruções para configurar a chave: definir o **mesmo** valor na API e no BFF (appsettings ou variáveis de ambiente, ex.: `API__InternalKey`), recomendando um valor forte e único em produção. Referir que sem a chave configurada a API aceita pedidos (desenvolvimento); em produção deve estar configurada em ambos os serviços. Atualizar a tabela de variáveis de ambiente e, se aplicável, a secção de instalação em cloud/Linux.
- **Spec**: Nova capability **bff-api-security**: ADDED requirement que a API possa exigir uma chave partilhada (header) e que o BFF envie essa chave; a chave nunca é exposta ao frontend. README documenta a configuração.

## Impact

- Affected specs: **bff-api-security** (nova capability com um ADDED requirement), **project-docs** (ADDED: README documenta configuração da chave BFF-API).
- Affected code: `backend/api` (middleware ou filter que valida o header quando a chave está configurada); `backend/bff/Program.cs` (configurar o HttpClient com o header a partir da configuração) e `ApiClient` se necessário; `README.md` (secção ou tabela com instruções da chave). Nenhuma alteração no frontend.
