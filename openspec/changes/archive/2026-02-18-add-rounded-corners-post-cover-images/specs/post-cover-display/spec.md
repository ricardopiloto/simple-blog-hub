# post-cover-display — delta for add-rounded-corners-post-cover-images

## ADDED Requirements

### Requirement: Imagens de capa exibidas com bordas arredondadas (SHALL)

When the frontend displays a post **cover image** (with a valid cover_image URL or path), the image **SHALL** be displayed with **rounded corners** (border-radius) in **all** contexts: homepage featured block, post list cards, story index (grid view and list/reorder view), and single post page. The container that clips the image SHALL use a consistent rounding value (e.g. Tailwind `rounded-lg` or `rounded-xl`) and **overflow-hidden** so that the visible edges of the image follow the border-radius. This applies to both URL-based and uploaded cover images.

#### Scenario: Capas com bordas arredondadas em todos os contextos

- **GIVEN** a post has a valid cover_image and is displayed in one of: homepage (featured or card), post list, story index (grid or list/reorder view), or single post page
- **WHEN** the user views the cover image
- **THEN** the image is displayed with **rounded corners** (no sharp square corners)
- **AND** the rounding is consistent with the design (e.g. rounded-lg or rounded-xl) across contexts
