# post-cover-display — delta for increase-upload-max-width-to-2200

## MODIFIED Requirements

### Requirement: Image optimization on upload — default MaxWidth 2200 px

When the BFF performs image optimization on cover upload (resize and compress), the configuration **Uploads:MaxWidth** SHALL have a **default** value of **2200** (pixels). The BFF SHALL read this value (from appsettings or environment) and SHALL resize images that exceed this width to a maximum width of 2200 px (or the configured value) while preserving aspect ratio. Operators MAY override the value (e.g. `Uploads__MaxWidth=1200`) for smaller file sizes. This change updates the default from 1200 to **2200** to allow higher-resolution covers when needed (e.g. for large displays or 16:9 at greater detail).

#### Scenario: Upload of wide image uses default max width 2200

- **GIVEN** the BFF has image optimization enabled and Uploads:MaxWidth is not overridden (default applies)
- **WHEN** an author uploads a cover image with width greater than 2200 px
- **THEN** the saved file is resized to a maximum width of **2200 px** (aspect ratio preserved)
- **AND** the image is compressed according to Uploads:JpegQuality (or equivalent for PNG/WebP)
