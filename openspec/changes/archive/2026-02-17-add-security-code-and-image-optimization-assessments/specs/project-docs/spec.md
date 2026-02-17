# project-docs — delta for add-security-code-and-image-optimization-assessments

## ADDED Requirements

### Requirement: Documentos de avaliação para segurança, código e imagens (SHALL)

The repository SHALL contain **assessment documents** with actionable recommendations for: (a) **security follow-up** — recommendations beyond the hardening already applied (e.g. Content-Security-Policy, dependency auditing, log review), in a dedicated document (e.g. **docs/security/SECURITY-ASSESSMENT-FOLLOW-UP.md**); (b) **code optimization** — recommendations for code simplification and reuse (e.g. shared structures, reduction of duplication), in a document under docs (e.g. **docs/improvements/CODE-OPTIMIZATION-RECOMMENDATIONS.md**), which MAY extend or reference CODE-IMPROVEMENTS.md; (c) **image optimization** — recommendations for reducing data transferred to the end user and improving load times (e.g. compression on upload, resizing, lazy loading, responsive images), in a dedicated document (e.g. **docs/improvements/IMAGE-OPTIMIZATION.md**). Each document SHALL describe the **current state** and **prioritized recommendations** that can be implemented in future OpenSpec changes. The repository MAY satisfy (b) or (c) by updating or extending an existing document (e.g. CODE-IMPROVEMENTS.md) instead of creating a new one, as long as the content is findable and the recommendations are clearly stated.

#### Scenario: Developer finds assessment documents for security, code and images

- **GIVEN** a developer or operator wants to plan security improvements, code refactoring or image optimization
- **WHEN** they look in docs/security or docs/improvements (or the README points to these areas)
- **THEN** they find at least one document that describes security follow-up recommendations (e.g. CSP, dependency audit) with current state and prioritization
- **AND** they find at least one document that describes code optimization recommendations (e.g. frontend client refactor, Data Annotations) with current state and prioritization
- **AND** they find at least one document that describes image optimization recommendations (e.g. compression on upload, lazy loading) with current state and prioritization
- **AND** they can use these recommendations to plan or implement future changes (e.g. OpenSpec changes) without having to re-derive the analysis from scratch
