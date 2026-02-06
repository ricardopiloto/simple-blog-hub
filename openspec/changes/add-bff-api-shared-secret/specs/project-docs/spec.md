# project-docs (delta)

## ADDED Requirements

### Requirement: README documenta configuração da chave partilhada BFF–API

O **README** **DEVE** (SHALL) incluir instruções para configurar a **chave partilhada** entre o BFF e a API: nome da configuração (ex.: `API:InternalKey` ou variável de ambiente `API__InternalKey`), indicação de que o **mesmo** valor deve ser definido na API e no BFF, recomendação de usar um valor forte e único em produção, e que a chave não é exposta ao frontend. O README **DEVE** indicar que, quando a chave não está configurada, a API aceita pedidos (útil em desenvolvimento local).

#### Scenario: Operador encontra instruções da chave BFF–API no README

- **Quando** um operador ou desenvolvedor consulta o README para configurar a aplicação (em especial para produção ou instalação em cloud)
- **Então** encontra a descrição da configuração da chave partilhada entre BFF e API (nome da variável ou secção appsettings, valor a definir em ambos os serviços)
- **E** entende que em produção deve configurar a chave e que o frontend não tem acesso a ela
