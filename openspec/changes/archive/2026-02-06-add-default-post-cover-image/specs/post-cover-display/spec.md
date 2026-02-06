## ADDED Requirements

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
