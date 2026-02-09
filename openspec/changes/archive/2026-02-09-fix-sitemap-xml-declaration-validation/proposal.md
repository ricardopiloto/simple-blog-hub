# Corrigir validação da declaração XML do sitemap

## Summary

O **sitemap.xml** gerado pelo BFF está a falhar em validadores externos (ex.: [XML-Sitemaps Validate XML Sitemap](https://www.xml-sitemaps.com/validate-xml-sitemap.html)) com erros na **linha 1** da declaração XML:

- `[65] Blank needed here on line 1`
- `[57] parsing XML declaration: '?>' expected on line 1`

Estes erros podem ser causados por: (1) **BOM (Byte Order Mark)** UTF-8 no início da resposta — o .NET pode emitir BOM ao serializar a string com `Encoding.UTF8`, fazendo com que o primeiro byte do documento não seja `<?xml`; (2) declaração XML sem **espaço antes de `?>`**, que alguns validadores exigem. O objetivo é que o sitemap seja **válido** segundo validadores comuns (ex.: xml-sitemaps.com) e que a resposta tenha Content-Type application/xml e UTF-8 **sem BOM**.

## Goals

1. **Eliminar BOM na resposta:** Ao devolver o sitemap, usar **UTF-8 sem BOM** para serializar o corpo da resposta (ex.: `new UTF8Encoding(false)` em vez de `Encoding.UTF8` no `Content()`), de forma a que o primeiro byte do corpo seja `<` (0x3C) e não a BOM (0xEF 0xBB 0xBF).
2. **Declaração XML conforme validadores:** Garantir que a declaração na primeira linha segue o formato aceite por validadores estritos — por exemplo `<?xml version="1.0" encoding="UTF-8" ?>` com **espaço antes de `?>`**. Implementação: usar `OmitXmlDeclaration = true` no `XmlWriterSettings`, gerar o resto do XML como hoje, e **prepend** manualmente a string `<?xml version="1.0" encoding="UTF-8" ?>\n` ao XML gerado antes de devolver na resposta.
3. **Spec e documentação:** Refletir no spec seo-sitemap-robots que o sitemap deve ser válido perante validadores XML comuns (declaração correta, sem BOM). Opcional: referência ao validador em documentação (ex.: README ou DEPLOY).

## Out of scope

- Alterar o conteúdo do urlset (URLs, lastmod) ou o protocolo sitemaps.org.
- Adicionar testes de integração que chamem validadores externos; testes unitários que verifiquem o início do corpo (sem BOM, declaração com espaço) são aceitáveis.

## Success criteria

- GET /sitemap.xml devolve um corpo cujo primeiro byte é `0x3C` (`<`) ou os bytes da declaração `<?xml` sem BOM à frente.
- A primeira linha do corpo é exatamente `<?xml version="1.0" encoding="UTF-8" ?>` (com espaço antes de `?>`) seguida de newline e do elemento `<urlset`.
- O validador [xml-sitemaps.com/validate-xml-sitemap](https://www.xml-sitemaps.com/validate-xml-sitemap.html) não reporta erros na declaração (linha 1).
- Content-Type continua a ser `application/xml; charset=utf-8`.
- `openspec validate fix-sitemap-xml-declaration-validation --strict` passa.
