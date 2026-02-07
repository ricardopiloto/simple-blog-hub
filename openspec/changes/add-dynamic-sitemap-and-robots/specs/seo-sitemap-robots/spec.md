# seo-sitemap-robots — delta for add-dynamic-sitemap-and-robots

## Purpose

Define o comportamento do **sitemap.xml** dinâmico e do **robots.txt** servidos pelo BFF na raiz do site, para indexação e SEO.

## ADDED Requirements

### Requirement: Sitemap dinâmico gerado pelo BFF

O sistema **deve** (SHALL) expor um endpoint GET **/sitemap.xml** no BFF que gera XML no formato [sitemaps.org](https://www.sitemaps.org/protocol.html) (urlset com xmlns). O sitemap **deve** incluir: (a) a URL da raiz do site (/); (b) a URL da página Artigos (/posts); (c) a URL do Índice da História (/indice); (d) para cada post **publicado**, uma entrada \<url\> com \<loc\> apontando para /post/{slug}. Cada \<loc\> **deve** ser uma URL absoluta usando o scheme e o host do pedido HTTP. O sitemap **pode** incluir \<lastmod\> para cada URL quando a API fornecer data de publicação ou atualização. A resposta **deve** ter Content-Type application/xml e codificação UTF-8.

#### Scenario: Sitemap inclui páginas estáticas e posts publicados

- **Dado** que existem 2 posts publicados com slugs "primeira-aventura" e "segundo-capitulo"
- **Quando** um cliente faz GET /sitemap.xml no BFF (ex.: com Host exemplo.com)
- **Então** a resposta é XML válido (urlset) com pelo menos as URLs: https://exemplo.com/, https://exemplo.com/posts, https://exemplo.com/indice, https://exemplo.com/post/primeira-aventura, https://exemplo.com/post/segundo-capitulo
- **E** o Content-Type é application/xml

#### Scenario: Sitemap usa o host do pedido para URLs absolutas

- **Quando** o pedido GET /sitemap.xml tem Host blog.dominio.com e scheme https
- **Então** todas as \<loc\> no XML começam por https://blog.dominio.com/

### Requirement: robots.txt servido pelo BFF com linha Sitemap

O sistema **deve** (SHALL) expor um endpoint GET **/robots.txt** no BFF que devolve texto plano com: (a) regras de User-agent (ex.: Googlebot, Bingbot, User-agent *) e Allow: /; (b) uma linha **Sitemap:** com a URL absoluta do sitemap (ex.: Sitemap: https://{host}/sitemap.xml). A URL do Sitemap **deve** usar o scheme e o host do pedido HTTP. A resposta **deve** ter Content-Type text/plain.

#### Scenario: robots.txt contém Allow e Sitemap

- **Quando** um cliente faz GET /robots.txt no BFF
- **Então** a resposta contém "User-agent" e "Allow: /"
- **E** a resposta contém uma linha "Sitemap: " seguida da URL absoluta do sitemap (ex.: https://exemplo.com/sitemap.xml)

#### Scenario: URL do Sitemap reflete o host do pedido

- **Quando** o pedido GET /robots.txt tem Host meu-blog.com e scheme https
- **Então** a linha Sitemap na resposta é Sitemap: https://meu-blog.com/sitemap.xml
