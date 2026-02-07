# Proposal: Remove Contas button and "Alterar minha senha" from Área do Autor

## Summary

Simplify the **Área do Autor** (author dashboard) page by (1) **removing the "Contas" button** from that page — access to Contas remains only via the **menu superior** (header), for all authenticated authors; (2) **removing the "Alterar minha senha" section** from the Área do Autor — changing password is done in the **Contas** screen (per-user edit form). This avoids duplication and keeps the dashboard focused on managing posts; profile and password are managed in one place (Contas).

## Goals

- **Single entry for Contas**: The link to Contas is shown only in the header (desktop and mobile), not on the Área do Autor dashboard.
- **Single place for password change**: Only the Contas screen offers "alterar senha" (in the edit form for the user); the Área do Autor no longer has a dedicated "Alterar minha senha" block.
- **Lean dashboard**: The Área do Autor page shows only the list of posts and actions (Novo post, Editar, Excluir), without Contas or password UI.

## Scope

- **In scope**: (1) Remove the "Contas" button from `frontend/src/pages/AreaAutor.tsx` (the header already shows Contas to all authenticated users). (2) Remove the entire "Alterar minha senha" section from AreaAutor.tsx (heading, form, state, mutation and handler for password change). Remove any now-unused imports and state (e.g. `newPassword`, `confirmPassword`, `changePasswordMutation`, `handleChangePassword`, `setMustChangePassword` from useAuth if only used there; `updateUser`, `PASSWORD_CRITERIA_HELP`, `isValidPassword`, `Input`, `Label` if only used by that section). (3) Add a spec delta (auth or project-docs) stating that the Área do Autor dashboard SHALL NOT display a Contas button (Contas is reached only via the header) and SHALL NOT display an "Alterar minha senha" section (password change is done in Contas).
- **Out of scope**: Changing the Contas page or the header; adding setMustChangePassword to Contas on password-update success (optional follow-up).

## Affected code and docs

- **frontend/src/pages/AreaAutor.tsx**: Remove the Contas button (the `<Button variant="outline" asChild><Link to="/area-autor/contas">Contas</Link></Button>` block). Remove the "Alterar minha senha" block (section with form and related state/mutation/handler). Remove unused imports and variables.
- **openspec/changes/remove-contas-and-password-from-area-autor/specs/auth/spec.md**: MODIFIED or ADDED requirement that the Área do Autor dashboard SHALL NOT show a Contas button (access only via header) and SHALL NOT show an "Alterar minha senha" section (password change in Contas). One scenario: authenticated author opens Área do Autor and sees only post list and "Novo post"; they use the header to open Contas to edit profile or password.

## Dependencies and risks

- **None**: Contas and password change remain available in Contas; header already exposes Contas to all authenticated authors (change show-contas-menu-to-all-authenticated-authors).

## Success criteria

- Área do Autor has no Contas button and no "Alterar minha senha" section.
- Contas is still reachable from the header for all authenticated authors.
- Spec delta and validation pass.
