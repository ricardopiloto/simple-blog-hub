# Tasks: Chave partilhada BFF–API

## 1. API – Validar chave no pedido

- [x] 1.1 Adicionar configuração na API para a chave partilhada (ex.: `API:InternalKey` em appsettings ou `API__InternalKey` em variável de ambiente). Quando **configurada e não vazia**, a API deve rejeitar (401 Unauthorized) pedidos que não incluam um header (ex.: `X-Api-Key`) com o valor idêntico. Comparação em tempo constante (ex.: evitar early exit por tamanho) para reduzir timing attacks.
- [x] 1.2 Quando a chave **não** estiver configurada (ou estiver vazia), a API não exige o header (comportamento atual), para permitir desenvolvimento local sem config.
- [x] 1.3 Implementar via middleware (executado antes dos controllers) ou via authorization filter; aplicar a todos os pedidos à API.

## 2. BFF – Enviar chave em cada pedido à API

- [x] 2.1 Adicionar configuração no BFF com o mesmo nome/valor (ex.: `API:InternalKey` ou `ApiKey:Secret`). No registo do `HttpClient` para o `ApiClient`, adicionar um header por defeito (ex.: `X-Api-Key`) com o valor configurado, quando este existir. Se não estiver configurado, não enviar o header (compatível com API sem chave).
- [x] 2.2 Garantir que a chave é lida apenas de IConfiguration (appsettings ou variáveis de ambiente); nunca é exposta em respostas ao frontend.

## 3. Documentação – README

- [x] 3.1 Incluir no README (tabela de variáveis de ambiente e/ou secção de configuração) a **chave partilhada BFF–API**: nome da configuração (ex.: `API__InternalKey` na API e no BFF), descrição (valor secreto que o BFF envia à API; deve ser o mesmo em ambos; em produção usar um valor forte e único; não exposto ao frontend). Indicar que quando não configurada, a API aceita pedidos (útil em desenvolvimento).
- [x] 3.2 Na secção de instalação em cloud/Linux (se existir), referir que em produção se deve configurar a chave partilhada na API e no BFF.

## 4. Documentação – project.md

- [x] 4.1 Em Important Constraints (variáveis de ambiente), referir a configuração opcional da chave BFF–API (`API:InternalKey` / `API__InternalKey`) e que o frontend nunca tem acesso a esta chave.

## 5. Validação

- [x] 5.1 Build da API e do BFF. Testar: (1) Sem chave configurada em ambos: pedidos BFF→API funcionam; (2) Com a mesma chave na API e no BFF: pedidos BFF→API funcionam; (3) Com chave na API e sem header ou com valor errado: API devolve 401; (4) Confirmar que o frontend não recebe nem envia a chave (apenas chama o BFF).
- [x] 5.2 Executar `openspec validate add-bff-api-shared-secret --strict`.
