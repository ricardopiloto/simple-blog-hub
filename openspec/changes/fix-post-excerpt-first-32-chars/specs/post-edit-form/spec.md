## ADDED Requirements

### Requirement: Excerpt auto-filled from first 32 characters of content

In the post creation and edit form, the Excerpt (Resumo) field SHALL be filled automatically with the first 32 characters of the text entered in the Content (Conteúdo) field. When the user types or edits the content, the excerpt SHALL be updated so that it always reflects the first 32 characters of the current content (trimmed if applicable), so that the summary stays in sync with the content and is not limited to a single character.

#### Scenario: Excerpt updates as content is typed

- **WHEN** the user types or edits the Content field
- **THEN** the Excerpt field is set to the first 32 characters of the content (after trim), and updates as the content changes

#### Scenario: Content shorter than 32 characters

- **WHEN** the content has fewer than 32 characters
- **THEN** the excerpt contains the full content (trimmed)
