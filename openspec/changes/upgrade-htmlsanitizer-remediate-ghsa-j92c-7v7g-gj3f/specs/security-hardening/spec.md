# security-hardening — delta for upgrade-htmlsanitizer-remediate-ghsa-j92c-7v7g-gj3f

## ADDED Requirements

### Requirement: Dependência HtmlSanitizer SHALL be free of known unpatched vulnerabilities (SHALL)

The backend API uses the **HtmlSanitizer** package (e.g. in `MarkdownService`) to sanitize HTML content and mitigate XSS. The project SHALL use a version of HtmlSanitizer that is **not affected by known unpatched moderate-or-higher severity vulnerabilities**. In particular, the version SHALL remediate advisory **GHSA-j92c-7v7g-gj3f** (template-tag bypass, moderate severity) or any successor advisory that applies to the same or later package versions. The recommended approach is to use a stable version that is explicitly listed as not vulnerable (e.g. HtmlSanitizer 9.0.892 or later stable release as indicated by NuGet and the package maintainers).

#### Scenario: HtmlSanitizer version does not report known moderate vulnerability

- **GIVEN** the API project references the HtmlSanitizer NuGet package
- **WHEN** the project is checked for vulnerable dependencies (e.g. `dotnet list package --vulnerable`, or the advisory GHSA-j92c-7v7g-gj3f)
- **THEN** the HtmlSanitizer package version in use is **not** reported as affected by GHSA-j92c-7v7g-gj3f (or by an equivalent unpatched moderate-or-higher vulnerability)
- **AND** the MarkdownService continues to sanitize post HTML for public reading as required by the existing sanitization requirement

#### Scenario: Sanitization behavior preserved after upgrade

- **GIVEN** the HtmlSanitizer package has been updated to a version that remediates GHSA-j92c-7v7g-gj3f
- **WHEN** the API serves post content for public reading (Markdown or HTML pass-through)
- **THEN** the content is still sanitized (script, iframe, on*, javascript: etc. removed) as before
- **AND** the existing scenarios for "Conteúdo HTML de posts MUST ser sanitizado" still hold
