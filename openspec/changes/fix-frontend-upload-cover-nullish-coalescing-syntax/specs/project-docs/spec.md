# project-docs — delta for fix-frontend-upload-cover-nullish-coalescing-syntax

## ADDED Requirements

### Requirement: Frontend build free of nullish-coalescing syntax errors

The frontend codebase SHALL use the nullish coalescing operator (`??`) and logical OR (`||`) in the same expression only when the intended precedence is made explicit with parentheses, so that the build (Vite/react-swc) does not fail with "Nullish coalescing operator(??) requires parens when mixing with logical operators". This applies in particular to error-message handling in API client code (e.g. `uploadCoverImage`) where a fallback chain (e.g. `j.error ?? (text || res.statusText)`) is used.

#### Scenario: Frontend builds after fix

- **GIVEN** the upload cover error handling in `client.ts` uses `j.error ?? (text || res.statusText)`
- **WHEN** the developer runs `npm run build` or `npm run dev` in the frontend
- **THEN** the build completes without syntax errors related to `??` and `||`
- **AND** the error message shown on upload failure still prefers the JSON `error` field when present
