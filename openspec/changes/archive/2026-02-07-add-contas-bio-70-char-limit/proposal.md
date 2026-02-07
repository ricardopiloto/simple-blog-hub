# Proposal: Limit author bio (Contas) to 70 characters

## Summary

Add a **character limit of 70** to the **Bio** (descrição do autor) field in the **Contas** screen. The limit SHALL apply in the UI (input max length and/or visual feedback) and SHOULD be enforced by the API so that values longer than 70 characters are rejected. This keeps the bio as a short tagline (e.g. "Sonhador e amante de contos e RPG") and avoids long text in the post page and profile.

## Goals

- **UI**: In the Contas edit form, the "Descrição do autor" (Bio) field SHALL allow at most **70 characters** (e.g. `maxLength={70}` and optionally show a counter "X/70").
- **API**: The API SHALL accept and persist bio only if length ≤ 70; otherwise return validation error (e.g. 400 Bad Request) so the frontend and any other clients respect the limit.
- **Spec**: Document the limit in the auth (or Contas) capability so it is a stated requirement.

## Scope

- **In scope**: (1) Frontend: in `AreaContas.tsx`, set `maxLength={70}` on the Bio input and optionally display "X/70" or a hint that the maximum is 70 characters. (2) API: in the UpdateUser (or equivalent) handler, when `request.Bio` is present, reject with 400 if the trimmed value length is greater than 70. (3) Spec delta: add a requirement that the author bio in Contas SHALL be limited to 70 characters (frontend and API).
- **Out of scope**: Changing the display of bio elsewhere (post page, list); changing the limit value to a configurable setting.

## Affected code and docs

- **frontend/src/pages/AreaContas.tsx**: Bio input `maxLength={70}`; optional character counter or helper text.
- **backend/api** (e.g. UsersController UpdateUser or request model): Validate `request.Bio` length ≤ 70 before persisting; return BadRequest if exceeded.
- **openspec/changes/add-contas-bio-70-char-limit/specs/auth/spec.md**: ADDED requirement and scenario for the 70-character bio limit.

## Dependencies and risks

- **None**: Small, localized change. Existing bios longer than 70 would need to be truncated or edited by the user after deployment (optional one-time migration or leave as-is and only enforce on next edit).

## Success criteria

- In Contas, the Bio field cannot exceed 70 characters (input constraint and/or API validation).
- Spec delta and `openspec validate add-contas-bio-70-char-limit --strict` pass.
