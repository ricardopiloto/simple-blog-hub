## ADDED Requirements

### Requirement: Store post content as Markdown

The system SHALL store the main body of each post (Post.Content) as Markdown. New and updated posts SHALL be persisted with content in Markdown. Existing content that was stored as HTML MAY be treated as Markdown (e.g. raw blocks) or migrated; the authoritative format for new writes SHALL be Markdown.

#### Scenario: Create post with Markdown

- **WHEN** the client sends a create or update request with a content field containing Markdown
- **THEN** the API persists the content as Markdown in Post.Content

#### Scenario: Edit endpoint returns Markdown

- **WHEN** the client requests a post for editing (e.g. GET for area autoral)
- **THEN** the response includes the content in Markdown so the editor can display and modify it

### Requirement: Public reading receives HTML

When serving a post for public reading (e.g. GET /api/posts/{slug} or GET /bff/posts/{slug}), the system SHALL convert the stored Markdown to HTML and SHALL include that HTML in the response (e.g. in the content field of the DTO). The frontend for the public site SHALL continue to consume and display this HTML; no change to the public reading contract is required beyond the fact that the stored source is Markdown.

#### Scenario: Public GET returns HTML content

- **WHEN** a client requests a post by slug for public display (unauthenticated or without edit context)
- **THEN** the response contains the post body as HTML (converted from Markdown on the server)

#### Scenario: Conversion on server

- **WHEN** the backend serves a post for public reading
- **THEN** Markdown-to-HTML conversion (e.g. via Markdig) is performed on the server; the client receives only HTML for display

### Requirement: Editor works in Markdown

The area autoral SHALL provide an editor for the post body that works with Markdown. The editor SHALL send and receive content in Markdown when loading and saving posts. The frontend MAY provide a Markdown preview in the editor; the public-facing post page SHALL display the HTML provided by the API and SHALL NOT be required to perform Markdown conversion for the reader.

#### Scenario: Save from editor sends Markdown

- **WHEN** the author saves a post from the area autoral editor
- **THEN** the content sent to the BFF/API is in Markdown

#### Scenario: Load for edit receives Markdown

- **WHEN** the author opens a post for editing in the area autoral
- **THEN** the content loaded into the editor is in Markdown
