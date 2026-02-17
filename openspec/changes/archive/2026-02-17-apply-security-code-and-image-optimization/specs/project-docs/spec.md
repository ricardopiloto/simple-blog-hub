# project-docs — delta for apply-security-code-and-image-optimization

## ADDED Requirements

### Requirement: Documento de configuração para CSP, imagens e auditoria (SHALL)

The repository SHALL contain a **configuration and migration document** in **docs/deploy** that describes how to use the **new configuration options** introduced by the implementation of the security, code and image optimization assessments: (1) **Content-Security-Policy** — configuration keys (e.g. `Security:CspHeader`, `Security:CspReportOnly`), example policies, environment variables, and how to test in Report-Only mode first; (2) **Image processing on upload** — configuration keys (e.g. `Uploads:MaxWidth`, `Uploads:JpegQuality`), behaviour before and after (original vs optimized file), and where to set them (appsettings or env); (3) **Dependency audit** — commands to check for vulnerable packages (`dotnet list package --vulnerable`, `npm audit`) and where to run them; reference to the assessment documents (SECURITY-ASSESSMENT-FOLLOW-UP, CODE-OPTIMIZATION-RECOMMENDATIONS, IMAGE-OPTIMIZATION). The document MAY note that operators can copy relevant sections to **docs/local** for server-specific notes (docs/local is gitignored). The document SHALL have a clear name (e.g. **CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md**) so that operators and developers can find the migration path for these new settings.

#### Scenario: Operator finds configuration guide for new settings

- **GIVEN** an operator or developer wants to enable CSP, adjust image processing, or run dependency audits
- **WHEN** they look in docs/deploy (or follow references from README or assessment docs)
- **THEN** they find a document that describes Security:CspHeader, Security:CspReportOnly, Uploads:MaxWidth, Uploads:JpegQuality
- **AND** they find the commands for dotnet and npm vulnerability checks and references to the assessment documents
- **AND** they can apply or migrate to the new configuration without re-deriving the steps from the codebase
