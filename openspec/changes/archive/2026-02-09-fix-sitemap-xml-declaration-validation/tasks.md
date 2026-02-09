# Tasks: fix-sitemap-xml-declaration-validation

## 1. BFF: UTF-8 sem BOM na resposta do sitemap

- [x] 1.1 Em `backend/bff/Controllers/SeoController.cs`, na ação `SitemapXml`, alterar o `return Content(...)` para usar um encoding UTF-8 **sem BOM**: em vez de `Encoding.UTF8`, usar `new UTF8Encoding(false)` (ou equivalente) como terceiro argumento de `Content()`, de forma a que o corpo da resposta não inclua a BOM (0xEF 0xBB 0xBF) antes do XML.

## 2. BFF: Declaração XML com espaço antes de ?>

- [x] 2.1 No `SeoController.SitemapXml`, configurar o `XmlWriterSettings` com `OmitXmlDeclaration = true` para que o `XmlWriter` não escreva a declaração.
- [x] 2.2 Após construir o XML em `StringBuilder` (após o `using` do writer), prepend ao resultado a string exata `<?xml version="1.0" encoding="UTF-8" ?>\n` (com espaço antes de `?>` e newline), e passar essa string completa ao `Content()`.

## 3. Spec delta seo-sitemap-robots

- [x] 3.1 Em `openspec/changes/fix-sitemap-xml-declaration-validation/specs/seo-sitemap-robots/spec.md`, ADDED (ou MODIFIED) requirement: a resposta GET /sitemap.xml **deve** ser XML bem formado cuja **primeira linha** seja a declaração XML no formato `<?xml version="1.0" encoding="UTF-8" ?>` (com espaço antes de `?>`) e o corpo **não** deve começar com BOM (Byte Order Mark) UTF-8, de forma a que validadores externos (ex.: xml-sitemaps.com) aceitem o documento. Incluir cenário: quando um validador XML de sitemap (ex.: validate-xml-sitemap) analisa a URL do sitemap, não reporta erros na declaração XML na linha 1.

## 4. Validação

- [x] 4.1 Executar `openspec validate fix-sitemap-xml-declaration-validation --strict` e corrigir falhas.
