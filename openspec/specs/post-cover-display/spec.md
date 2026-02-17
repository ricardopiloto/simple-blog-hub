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

### Requirement: Cover image displayed with fixed aspect ratio and centered framing

When the frontend displays a post **cover image** (with a valid cover_image URL or path), it SHALL use a **fixed aspect ratio** of **16:9** in the following contexts: single post page (article header), post list cards, and story index cards. The image SHALL be rendered with **object-fit: cover** and **object-position: center** (or equivalent) so that the image fills the display area and is centered when cropped, ensuring consistent and predictable framing within the visible bounds. Other contexts (e.g. homepage featured block) MAY use a different aspect ratio (e.g. 4:3) but SHALL still use object-fit cover and object-position center for consistency. Authors who provide images in 16:9 proportion will see the full image without cropping in the main display contexts.

#### Scenario: Cover on single post page uses 16:9 and centered framing

- **GIVEN** a post has a valid cover_image and is displayed on the post detail page
- **WHEN** the user views the cover area
- **THEN** the cover is displayed in a container with aspect ratio 16:9
- **AND** the image uses object-fit cover and object-position center so that it is correctly framed within the container

#### Scenario: Cover in list and story index cards uses 16:9 and centered framing

- **GIVEN** a post with a valid cover_image is shown in a card (post list or story index)
- **WHEN** the user views the card
- **THEN** the cover image is displayed in a 16:9 aspect container with object-fit cover and object-position center
- **AND** the framing is consistent with the single post page so that the same image does not appear arbitrarily cropped in different places

#### Scenario: Image in 16:9 proportion is not cropped in main contexts

- **GIVEN** the post cover image has proportion 16:9 (e.g. 1200×675 px)
- **WHEN** the cover is displayed on the post page, in the list, or in the story index
- **THEN** the full image is visible (no cropping) because the display aspect matches the image aspect
- **AND** object-position center has no visible effect when the image exactly fills the container

### Requirement: Na página do artigo a capa é exibida com object-contain para caber sem cortar

Na **página do artigo** (single post page, vista de leitura), a imagem de capa **deve** (SHALL) ser exibida com **object-fit: contain** (ou classe equivalente, ex.: `object-contain`) dentro de um contentor com aspect ratio 16:9, de forma que imagens **fora do padrão 16:9** sejam **redimensionadas** (escala) para **caber inteiramente** no contentor, **sem cortar** partes da imagem. O contentor **deve** ter **fundo transparente** nas faixas (letterboxing ou pillarboxing) quando a imagem não preenche todo o 16:9, em vez de fundo neutro (ex.: bg-muted). Em listas, cards e índice da história mantém-se object-cover para consistência visual dos blocos.

#### Scenario: Imagem não 16:9 na página do artigo aparece inteira

- **Dado** que um post tem uma imagem de capa com proporção diferente de 16:9 (ex.: 4:3 ou 1:1)
- **Quando** o utilizador abre a página do artigo (post detail)
- **Então** a capa é exibida com object-contain dentro do contentor 16:9
- **E** a imagem completa é visível (redimensionada para caber, sem corte)
- **E** qualquer espaço vazio (faixas) tem **fundo transparente**

#### Scenario: Imagem 16:9 na página do artigo preenche o contentor

- **Dado** que um post tem uma imagem de capa em proporção 16:9
- **Quando** o utilizador abre a página do artigo
- **Então** a capa preenche o contentor 16:9 (object-contain com imagem 16:9 não gera faixas visíveis)
- **E** o aspecto é o de uma capa preenchida, sem faixas

### Requirement: Cover image MAY be resized and compressed on upload (SHALL when implemented)

After validating the uploaded file (magic bytes, type, size), the BFF MAY **resize** the image to a configurable maximum dimension (e.g. width in pixels) and **compress** it with configurable quality before saving to disk. When this behaviour is implemented, the BFF SHALL read configuration (e.g. `Uploads:MaxWidth`, `Uploads:JpegQuality`) and SHALL store only the optimized version (or the original if optimization is disabled or not implemented). The purpose is to reduce the amount of data transferred to the end user and improve load times. Existing behaviour (save path, public URL, format) remains; the stored file may be smaller and at a lower resolution than the original upload.

#### Scenario: Upload produces optimized file

- **GIVEN** the BFF has image optimization enabled (e.g. ImageSharp and config MaxWidth / quality set)
- **WHEN** an author uploads a cover image (e.g. large JPEG)
- **THEN** the file saved to disk is resized (e.g. max width 1200 px) and compressed (e.g. JPEG quality 85%)
- **AND** the returned URL points to this optimized file
- **AND** the frontend and readers receive the smaller file when loading the cover

### Requirement: Cover images below the fold MAY use lazy loading (SHALL when implemented)

The frontend MAY use the HTML attribute **loading="lazy"** for post **cover images** that are displayed **below the fold** (e.g. in post list cards, story index cards). Cover images that are **above the fold** (e.g. the main cover on the single post page, the featured post block on the home page) MAY keep the default loading behaviour (eager) so that the largest contentful paint (LCP) is not delayed. When lazy loading is implemented for a given context, the corresponding `<img>` SHALL include `loading="lazy"`.

#### Scenario: Lazy loading in list and index

- **GIVEN** the user is on the post list page or the story index page
- **WHEN** cover images are rendered in cards (e.g. PostCard, StoryIndex grid)
- **THEN** those images use `loading="lazy"`
- **AND** the browser may defer loading them until they are near the viewport
- **AND** the initial page load transfers less data for off-screen images

#### Scenario: Eager loading for main and featured cover

- **GIVEN** the user is on the single post page or the home page (featured post block)
- **WHEN** the main cover image is rendered (article header or featured block)
- **THEN** that image does not use `loading="lazy"` (or uses default eager behaviour)
- **AND** the main cover is loaded immediately for better LCP and perceived performance

