# Proposal: Corrigir vulnerabilidade HtmlSanitizer (GHSA-j92c-7v7g-gj3f)

## Summary

O pacote **HtmlSanitizer** na versão **8.1.870** usado pela API tem uma vulnerabilidade de severidade moderada conhecida: **GHSA-j92c-7v7g-gj3f** (https://github.com/advisories/GHSA-j92c-7v7g-gj3f). A vulnerabilidade está relacionada com bypass via tag `template`: quando a tag é permitida, o seu conteúdo pode não ser sanitizado corretamente, permitindo ataques XSS por mutation ou pelo atributo `shadowrootmode`. O HtmlSanitizer é utilizado no `MarkdownService` da API para sanitizar o HTML dos posts antes de ser servido ao cliente (mitigação de XSS). Este change propõe **atualizar o pacote HtmlSanitizer** para uma versão que não seja afetada por esta vulnerabilidade (ex.: **9.0.892**, estável e sem aviso de vulnerabilidade no NuGet), mantendo o comportamento de sanitização já exigido pelo spec de security-hardening.

## Goals

- **Remediar GHSA-j92c-7v7g-gj3f**: Atualizar a referência ao pacote HtmlSanitizer no projeto da API para uma versão em que esta vulnerabilidade esteja corrigida. A versão alvo recomendada é **9.0.892** (última estável no NuGet sem aviso de vulnerabilidade moderada para esta advisory).
- **Manter sanitização XSS**: O `MarkdownService` deve continuar a sanitizar o conteúdo HTML (Markdown→HTML e pass-through) com o mesmo objetivo de mitigar XSS; a alteração é apenas de versão do pacote e, se necessário, ajustes mínimos de código em caso de breaking changes na API pública do HtmlSanitizer.

## Scope

- **In scope**: (1) Alterar `backend/api/BlogApi.csproj` para usar HtmlSanitizer numa versão que remedeie GHSA-j92c-7v7g-gj3f (ex.: 9.0.892). (2) Verificar que a API compila e que os testes existentes passam; se a API pública do HtmlSanitizer tiver mudado entre 8.1 e 9.0, ajustar `MarkdownService.cs` apenas na medida do necessário. (3) Spec delta em security-hardening: requisito que a dependência HtmlSanitizer seja mantida numa versão sem vulnerabilidades conhecidas não corrigidas (referência à advisory).
- **Out of scope**: Alterar a lógica de sanitização (tags/atributos permitidos), alterar o BFF ou o frontend, ou adicionar novas funcionalidades de segurança além da atualização da dependência.

## Affected code and docs

- **backend/api/BlogApi.csproj**: Única referência ao pacote HtmlSanitizer no repositório; alterar `Version="8.1.870"` para a versão escolhida (ex.: `9.0.892`).
- **backend/api/Services/MarkdownService.cs**: Usa `Ganss.Xss.HtmlSanitizer` com `new HtmlSanitizer()` e `Sanitizer.Sanitize(html)`. Se a API do pacote 9.x for compatível, nenhuma alteração de código é necessária; caso contrário, documentar e aplicar o ajuste mínimo.
- **openspec/changes/upgrade-htmlsanitizer-remediate-ghsa-j92c-7v7g-gj3f/specs/security-hardening/spec.md**: Delta ADDED/MODIFIED para exigir que a versão do HtmlSanitizer não seja afetada por vulnerabilidades conhecidas (GHSA-j92c-7v7g-gj3f remediada).

## Dependencies and risks

- **Compatibilidade**: O projeto API targeta .NET 8.0; o pacote HtmlSanitizer 9.0.892 suporta net8.0. O uso atual em MarkdownService é mínimo (instância padrão e `Sanitize(string)`); a API pública do Ganss.Xss costuma manter compatibilidade para este uso. Risco baixo de breaking change; em caso de alteração, o scope limita-se a ajustes em MarkdownService.
- **Sem impacto no BFF**: O BFF não referencia HtmlSanitizer; apenas a API o utiliza.

## Success criteria

- O pacote HtmlSanitizer na API está atualizado para uma versão que remedeie GHSA-j92c-7v7g-gj3f (ex.: 9.0.892).
- A API compila e os testes existentes passam; o MarkdownService continua a sanitizar o HTML conforme o spec de security-hardening.
- O alerta de vulnerabilidade (moderate severity) deixa de ser reportado para esta dependência.
- `openspec validate upgrade-htmlsanitizer-remediate-ghsa-j92c-7v7g-gj3f --strict` passa.
