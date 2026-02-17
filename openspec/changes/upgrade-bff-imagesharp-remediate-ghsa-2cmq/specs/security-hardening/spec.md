# security-hardening — delta for upgrade-bff-imagesharp-remediate-ghsa-2cmq

## ADDED Requirements

### Requirement: BFF ImageSharp version SHALL remediate known vulnerabilities (GHSA-2cmq-823j-5qj8 and GHSA-rxmq-m78w-7wmc)

The **BFF** uses the **SixLabors.ImageSharp** package for image processing (e.g. resize and compression on cover uploads). The project SHALL use a version of ImageSharp that is **not affected by known unpatched high- or moderate-severity vulnerabilities** reported by NuGet (NU1903, NU1902). In particular, the version SHALL remediate: (1) **GHSA-2cmq-823j-5qj8** (Out-of-bounds Write in the GIF decoder, high severity); (2) **GHSA-rxmq-m78w-7wmc** (Infinite Loop in GIF decoder when skipping malformed comment extension blocks, moderate severity; https://github.com/advisories/GHSA-rxmq-m78w-7wmc). For the 3.x line, the minimum recommended version is **3.1.11**. This ensures that the build does not report NU1903 or NU1902 and that image processing is not exposed to these vulnerabilities.

#### Scenario: BFF ImageSharp version does not report NU1903 or NU1902

- **GIVEN** the BFF project references SixLabors.ImageSharp
- **WHEN** the project is built (`dotnet build` in `backend/bff`) or checked for vulnerable packages (e.g. `dotnet list package --vulnerable`)
- **THEN** the ImageSharp package version in use is **not** reported as affected by GHSA-2cmq-823j-5qj8 or GHSA-rxmq-m78w-7wmc (and neither NU1903 nor NU1902 appears)
- **AND** the version is at least 3.1.11 (or equivalent fix version for the 3.x line)
