# post-cover-display — delta for add-cover-size-guidance-and-framing

## ADDED Requirements

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
