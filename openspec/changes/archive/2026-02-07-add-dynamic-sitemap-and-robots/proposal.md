# Proposal: Sitemap dinâmico e robots.txt

## Summary

Criar **sitemap.xml** de forma **dinâmica** no código (BFF), com base nos posts publicados e nas páginas estáticas do site, e servir **robots.txt** também pelo BFF, incluindo a linha `Sitemap:` com a URL absoluta do sitemap. Assim, motores de busca podem descobrir e indexar as páginas do blog sem ficheiros estáticos desatualizados.

## Goals

- **Sitemap dinâmico**: O BFF **deve** expor um endpoint (ex.: GET /sitemap.xml) que gera XML no formato [sitemaps.org](https://www.sitemaps.org/protocol.html), incluindo: URL da raiz (/), /posts, /indice e, para cada post **publicado**, a URL do artigo (/post/{slug}). Opcionalmente incluir \<lastmod\> com a data de publicação ou atualização do post. A base da URL **deve** ser derivada do pedido (Host + scheme) para funcionar em qualquer domínio.
- **robots.txt**: O BFF **deve** expor um endpoint (ex.: GET /robots.txt) que devolve texto plano com as regras atuais (User-agent, Allow: /) e uma linha **Sitemap:** com a URL absoluta do sitemap (ex.: `Sitemap: https://{authority}/sitemap.xml`), para que o robots.txt não dependa de ficheiro estático e aponte sempre para o sitemap correto.

## Scope

- **In scope**: (1) **BFF**: Novo endpoint GET /sitemap.xml que obtém da API a lista de posts publicados (sem paginação), constrói o XML do sitemap (urlset com loc e opcional lastmod) e devolve `application/xml`; a base da URL usa o host e o scheme do pedido. (2) **BFF**: Novo endpoint GET /robots.txt que devolve `text/plain` com as regras de User-agent/Allow existentes e a linha Sitemap com a URL absoluta do sitemap. (3) **Documentação**: Atualizar DEPLOY-DOCKER-CADDY.md (e, se aplicável, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) para que o Caddy encaminhe /sitemap.xml e /robots.txt para o BFF (antes do file_server), de modo a que sejam servidos na raiz do domínio. (4) **Frontend**: Remover ou deixar de usar o robots.txt estático em `frontend/public/robots.txt` como fonte de verdade; o robots.txt passará a ser servido pelo BFF. (5) **Spec delta**: Nova capacidade (ex.: seo-sitemap-robots) com requisitos e cenários para sitemap dinâmico e robots.txt.
- **Out of scope**: Sitemap index (múltiplos sitemaps); alteração da API para um endpoint dedicado ao sitemap (o BFF usa a lista pública de posts já existente); suporte a hreflang ou imagens no sitemap.

## Affected code and docs

- **backend/bff**: Novo controller ou endpoints mínimos para GET /sitemap.xml e GET /robots.txt; uso do ApiClient para obter posts publicados; construção do XML (urlset) e do texto do robots.txt; base URL a partir de `HttpContext.Request`.
- **frontend/public/robots.txt**: Pode permanecer como fallback em desenvolvimento (quando o Caddy não está a encaminhar para o BFF) ou ser removido; a proposta assume que em produção o Caddy envia /robots.txt para o BFF.
- **DEPLOY-DOCKER-CADDY.md**, **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md**: Adicionar `handle /sitemap.xml` e `handle /robots.txt` que fazem reverse_proxy para o BFF, antes de `handle /bff/*` e do file_server.
- **openspec/changes/add-dynamic-sitemap-and-robots/specs/seo-sitemap-robots/spec.md**: ADDED requirements e cenários.

## Dependencies and risks

- **Caddy**: Quem faz deploy com Caddy **deve** adicionar os dois blocos handle; sem isso, /sitemap.xml e /robots.txt serão servidos pelo file_server (e o sitemap não existirá no dist; o robots.txt estático não terá a linha Sitemap correta). A documentação de deploy cobre isso.
- **Desenvolvimento local**: Com o frontend em Vite e o BFF em dotnet, ao aceder a https://localhost:5173/robots.txt o Vite serve o estático; para testar o robots.txt e sitemap do BFF, aceder diretamente ao BFF (ex.: http://localhost:5000/robots.txt e http://localhost:5000/sitemap.xml).

## Success criteria

- GET /sitemap.xml no BFF devolve XML válido (urlset) com pelo menos /, /posts, /indice e um \<url\> por post publicado com \<loc\> e opcional \<lastmod\>; a base da URL reflete o Host do pedido.
- GET /robots.txt no BFF devolve texto com regras Allow e uma linha Sitemap com URL absoluta.
- Documentação de deploy (Docker/Caddy) descreve o encaminhamento de /sitemap.xml e /robots.txt para o BFF.
- `openspec validate add-dynamic-sitemap-and-robots --strict` passa.
