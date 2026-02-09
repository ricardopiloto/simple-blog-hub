# seo-sitemap-robots — delta for fix-sitemap-xml-declaration-validation

## ADDED Requirements

### Requirement: Sitemap XML com declaração válida e sem BOM

A resposta GET **/sitemap.xml** **deve** (SHALL) ser um documento XML bem formado que **não** comece com **BOM (Byte Order Mark)** UTF-8, e cuja **primeira linha** seja a declaração XML no formato `<?xml version="1.0" encoding="UTF-8" ?>` (com **espaço** antes de `?>`), seguida de newline e do elemento raiz `<urlset>`. O objetivo é que validadores externos de sitemap (ex.: [XML-Sitemaps Validate XML Sitemap](https://www.xml-sitemaps.com/validate-xml-sitemap.html)) aceitem o documento sem erros na declaração (ex.: "Blank needed here", "'?>' expected on line 1"). O Content-Type **deve** continuar a ser `application/xml; charset=utf-8`.

#### Scenario: Validador externo aceita o sitemap sem erros na linha 1

- **Dado** que o BFF serve GET /sitemap.xml com o conteúdo do urlset
- **Quando** um validador de sitemap XML (ex.: xml-sitemaps.com/validate-xml-sitemap) analisa a URL do sitemap
- **Então** o validador **não** reporta erros na declaração XML na linha 1 (ex.: "Blank needed here", "parsing XML declaration: '?>' expected")
- **E** o corpo da resposta começa por `<?xml` (sem bytes de BOM antes) e a primeira linha termina com `?>` com espaço antes

#### Scenario: Resposta não inclui BOM

- **Quando** um cliente faz GET /sitemap.xml e inspeciona os primeiros bytes do corpo da resposta
- **Então** o primeiro byte é `0x3C` ('<') ou os bytes da string `<?xml` (0x3C 0x3F 0x78 0x6D 0x6C)
- **E** não há sequência BOM UTF-8 (0xEF 0xBB 0xBF) antes do início do XML
