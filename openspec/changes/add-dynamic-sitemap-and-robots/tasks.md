# Tasks: add-dynamic-sitemap-and-robots

## 1. BFF: endpoint GET /sitemap.xml

- [x] 1.1 Adicionar endpoint GET /sitemap.xml no BFF (controller ou minimal API) que: (a) chama a API para obter a lista de posts publicados (ex.: GET /api/posts?published=true&order=date, sem page/pageSize para obter todos); (b) constrói o XML no formato sitemap (urlset xmlns sitemaps.org) com \<loc\> e opcional \<lastmod\>; (c) inclui as URLs estáticas da raiz (/), /posts e /indice; (d) para cada post, inclui \<url\>\<loc\>{base}/post/{slug}\</loc\> e \<lastmod\> se a API devolver data de publicação/atualização; (e) usa o scheme e host do HttpRequest para a base das URLs; (f) devolve Content-Type application/xml e UTF-8.

## 2. BFF: endpoint GET /robots.txt

- [x] 2.1 Adicionar endpoint GET /robots.txt no BFF que devolve texto plano (Content-Type text/plain) com: (a) as regras atuais de User-agent (Googlebot, Bingbot, Twitterbot, facebookexternalhit, *) e Allow: /; (b) uma linha Sitemap: {scheme}://{host}/sitemap.xml (sem path duplicado; construir a partir do pedido).

## 3. Documentação de deploy (Caddy)

- [x] 3.1 Em DEPLOY-DOCKER-CADDY.md, na secção do Caddyfile, adicionar dois blocos handle **antes** de handle /bff/*: handle /sitemap.xml { reverse_proxy 127.0.0.1:5000 } e handle /robots.txt { reverse_proxy 127.0.0.1:5000 }. Explicar que assim /sitemap.xml e /robots.txt são servidos pelo BFF na raiz do domínio.
- [x] 3.2 Em ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, se existir exemplo de Caddyfile, incluir ou referir o mesmo encaminhamento para /sitemap.xml e /robots.txt.

## 4. Frontend: robots.txt estático

- [x] 4.1 Decidir e aplicar: ou remover frontend/public/robots.txt (o robots passará a ser só do BFF) ou mantê-lo como fallback em dev e documentar que em produção o Caddy encaminha /robots.txt para o BFF. A proposta recomenda manter como fallback opcional e documentar; em produção a prioridade é o BFF.

## 5. Spec delta

- [x] 5.1 Criar openspec/changes/add-dynamic-sitemap-and-robots/specs/seo-sitemap-robots/spec.md com ADDED requirements: (1) Sitemap dinâmico gerado pelo BFF com URLs estáticas e posts publicados; (2) robots.txt servido pelo BFF com linha Sitemap. Incluir pelo menos um cenário por requisito.

## 6. Validação

- [x] 6.1 Executar `openspec validate add-dynamic-sitemap-and-robots --strict` e corrigir qualquer falha.
