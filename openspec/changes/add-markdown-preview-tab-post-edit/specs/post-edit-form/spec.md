# post-edit-form — delta for add-markdown-preview-tab-post-edit

## ADDED Requirements

### Requirement: Campo Conteúdo (Markdown) com abas Escrever e Preview (SHALL)

The **new post** and **edit post** form SHALL provide, for the **Content (Markdown)** field, **two tabs**: (1) **Escrever** (or "Markdown") — the text area where the author writes and edits the post body in Markdown; (2) **Preview** — a view of how the current content will appear when published, i.e. the Markdown converted to HTML and displayed with the same typography as the main text area on the article page (e.g. prose styles). The Preview SHALL show **only** the content area (no cover image, no article header, no author block); it SHALL be updated when the author switches to the Preview tab so that it reflects the current value of the content field. The **Preview container** SHALL have the **same size** (height and width) as the write-mode text area; when the content is long, it SHALL show a **scrollbar** so the author can scroll within the same fixed area, in the same way as when editing in the text area. The frontend MAY convert Markdown to HTML in the client for the Preview (e.g. using a library such as marked) and SHALL sanitize the resulting HTML (e.g. with DOMPurify) before rendering.

#### Scenario: Autor alterna para Preview e vê o conteúdo renderizado

- **GIVEN** the author is on the new post or edit post form and has entered some text in the Content (Markdown) field
- **WHEN** they click the "Preview" tab (or equivalent) next to the Conteúdo (Markdown) label
- **THEN** they see the current content rendered as HTML with the same typography as the article body (e.g. prose)
- **AND** no cover image or article header is shown in the Preview
- **AND** they can switch back to the "Escrever" tab to continue editing

#### Scenario: Preview reflete o conteúdo atual ao mudar de aba

- **GIVEN** the author is on the edit post form and changes the text in the Content field (Escrever tab)
- **WHEN** they switch to the Preview tab
- **THEN** the Preview shows the updated content (the value currently in the content state)
- **AND** formatting such as headings, bold, lists, and links is rendered as it would appear on the article page

#### Scenario: Preview mantém o mesmo tamanho da área de escrita e barra de rolagem

- **GIVEN** the author is on the new post or edit post form
- **WHEN** they switch to the "Preview" tab
- **THEN** the Preview container has the same height and width as the "Escrever" text area (same box size)
- **AND** when the content is long, a vertical scrollbar appears so the author can scroll within that area, in the same way as when the area is the write-mode text area
