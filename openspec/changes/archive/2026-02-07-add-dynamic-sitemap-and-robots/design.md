# Design: Sitemap dinâmico e robots.txt

## Contexto

O blog não tem sitemap nem robots.txt servidos dinamicamente. Existe um `frontend/public/robots.txt` estático sem linha Sitemap. Para SEO e indexação, convém que o sitemap reflita os posts publicados e que o robots.txt aponte para o sitemap na URL correta do domínio.

## Decisão: BFF gera sitemap e robots.txt

- O **BFF** já é o ponto de entrada público e tem acesso à API para obter a lista de posts publicados. Por isso, dois endpoints no BFF:
  - **GET /sitemap.xml**: chama a API (GET /api/posts?published=true&order=date, sem paginação) para obter todos os posts; monta o XML com urlset; inclui URLs estáticas (/, /posts, /indice) e uma \<url\> por post com \<loc\> e opcional \<lastmod\> (published_at ou updated).
  - **GET /robots.txt**: devolve texto plano com as regras atuais (User-agent * e outros, Allow: /) e `Sitemap: {scheme}://{host}/sitemap.xml` usando o pedido atual.

- **Base URL**: Usar `HttpContext.Request.Scheme` e `HttpContext.Request.Host` (e opcionalmente path base se houver) para construir as URLs absolutas. Assim funciona em qualquer domínio sem configuração extra.

## Decisão: Rotas na raiz do BFF

- Os endpoints são **/sitemap.xml** e **/robots.txt** (raiz da aplicação BFF), não sob /bff/. Em produção, o Caddy encaminha pedidos ao domínio para /sitemap.xml e /robots.txt diretamente para o BFF; o BFF recebe o path tal e qual, portanto responde nesses caminhos.

## Decisão: Caddyfile

- Ordem dos handles: primeiro **/sitemap.xml** e **/robots.txt** (reverse_proxy para o BFF), depois **/bff/***, depois **/images/*** (se existir), por fim **file_server** + try_files. Assim, os crawlers obtêm sitemap e robots na raiz do site.

## Formato do sitemap

- Namespace: `http://www.sitemaps.org/schemas/sitemap/0.9`.
- Para cada URL: \<loc\> obrigatório; \<lastmod\> opcional (formato W3C, ex.: YYYY-MM-DD ou ISO 8601).
- Páginas estáticas: / (prioridade ou omitir), /posts, /indice — sem lastmod ou com lastmod genérico.
- Posts: \<loc\> = base + "/post/" + slug; \<lastmod\> = data de publicação ou de atualização do post, se disponível na API.

## robots.txt

- Conteúdo atual (User-agent Googlebot, Bingbot, etc., Allow: /) mantido; adicionar uma linha: `Sitemap: {absolute-url}/sitemap.xml` (sem path duplicado; ex.: `https://example.com/sitemap.xml`).
