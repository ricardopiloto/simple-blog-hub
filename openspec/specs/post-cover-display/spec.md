# post-cover-display Specification

## Purpose
TBD - created by archiving change add-default-post-cover-image. Update Purpose after archive.
## Requirements
### Requirement: Default cover image when post has no cover

When a post has no cover image (cover_image is null or empty string), the frontend SHALL display a default cover image so that the cover block is always shown and the page layout remains consistent. The same default image SHALL be used across the homepage (featured post and cards), post list, single post page, and story index.

#### Scenario: Post without cover on homepage

- **WHEN** a post has no cover_image (null or empty) and is displayed on the homepage (featured or in the grid)
- **THEN** the cover area shows the default image and the layout is the same as for posts with a cover

#### Scenario: Post without cover on single post page

- **WHEN** a post has no cover_image and is displayed on the post detail page
- **THEN** the cover area shows the default image

#### Scenario: Post with cover unchanged

- **WHEN** a post has a valid cover_image URL
- **THEN** that URL is used and the default image is not shown

### Requirement: Post cover can be set by URL or by uploading an image (stored locally)

The system SHALL allow the author to set the post **cover image** in two ways: (1) **URL** — pasting a URL in the existing "URL da imagem de capa" field (unchanged); (2) **Upload** — selecting an image file to upload. When the author uploads a file, the system SHALL save it **locally on the server** in a folder **`images/posts`**. In the repository, this folder SHALL exist as **`frontend/public/images/posts`** (so that the path is part of the frontend tree and can be served at `/images/posts/`). At runtime, the backend (BFF or API) SHALL save uploaded files to a configurable path that is exposed by the web server as **`/images/posts/`**, so that the stored `cover_image` value can be a local path (e.g. `/images/posts/unique-name.jpg`). The upload endpoint SHALL require **authentication** (only logged-in authors can upload) and SHALL validate file type (e.g. image/jpeg, image/png, image/webp) and a maximum file size to avoid abuse. Uploaded filenames SHALL be safe (e.g. unique id + extension) to prevent path traversal or overwrites. The frontend post edit form SHALL offer both the URL input and an upload option (e.g. file input or "Enviar imagem"); when upload succeeds, the cover field SHALL be set to the returned path and the image SHALL be displayed in the same way as a URL-based cover.

#### Scenario: Author uploads cover image and it is stored and displayed

- **GIVEN** the author is logged in and editing a post (new or existing)
- **WHEN** they choose the upload option and select an image file (e.g. JPEG or PNG within size limit)
- **THEN** the system saves the file to the `images/posts` directory (under the configured path, served as `/images/posts/`)
- **AND** the post's cover_image is set to the local path (e.g. `/images/posts/abc123.jpg`)
- **AND** the cover is displayed correctly in the edit form preview and on the public post page (and in cards/list) as for any cover_image URL

#### Scenario: Author can still use URL for cover

- **WHEN** the author pastes a URL in the "URL da imagem de capa" field (existing behaviour)
- **THEN** the post uses that URL as cover_image and no upload is required
- **AND** the existing default-cover behaviour when cover_image is null or empty continues to apply

