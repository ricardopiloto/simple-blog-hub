# project-docs — delta for document-404-uploaded-cover-image-troubleshooting

## ADDED Requirements

### Requirement: Troubleshooting para 404 em GET /images/posts/ após upload de capa

A documentação de deploy com Docker (DEPLOY-DOCKER-CADDY.md) **deve** (SHALL) incluir uma entrada de **troubleshooting** que descreva o cenário em que o **upload** da imagem de capa do post devolve **sucesso** (200 OK) mas a **imagem não é exibida** no post e, no console do browser (DevTools → Network), o pedido **GET** a `https://dominio/images/posts/<ficheiro>.jpg` devolve **404**. A entrada **deve** explicar a **causa** (Caddy não serve o path `/images/posts/` a partir do diretório de uploads no host, ou o volume do BFF não está montado) e os **passos de resolução** (confirmar volume no docker-compose no serviço BFF; adicionar no Caddyfile o bloco `handle /images/posts/*` com `root` apontando para REPO_DIR/frontend/public/images e `file_server`; recarregar o Caddy), com referência à secção do guia onde o exemplo completo do Caddyfile está descrito.

#### Scenario: Operador vê 404 no console após upload de capa

- **Dado** que o operador fez deploy com Docker + Caddy e um autor enviou uma imagem de capa no formulário de post
- **Quando** a imagem não aparece no post e o operador abre o DevTools → Network (ou o console)
- **Então** vê um pedido GET a `https://dominio/images/posts/xxx.jpg` com resposta **404**
- **E** ao consultar o DEPLOY-DOCKER-CADDY (secção de troubleshooting) encontra a entrada que descreve este sintoma
- **E** segue os passos (volume BFF + Caddy handle /images/posts/*) e, após recarregar o Caddy, as imagens passam a ser servidas e a aparecer no post
