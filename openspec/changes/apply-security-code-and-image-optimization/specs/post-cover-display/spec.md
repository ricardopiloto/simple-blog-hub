# post-cover-display — delta for apply-security-code-and-image-optimization

## ADDED Requirements

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
