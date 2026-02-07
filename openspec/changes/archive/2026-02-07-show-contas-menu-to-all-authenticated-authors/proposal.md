# Proposal: Show "Contas" menu to all authenticated authors (not only Admin)

## Summary

**Problem**: When logged in as a **non-admin** author, the user cannot find the "Contas" menu entry. The Contas screen is where any author can edit their own profile (author name, author bio, password); non-admin see only their own user there. The spec (add-non-admin-contas-own-profile-and-bio) already requires that non-admin can access Contas and edit their own bio/name — but the **UI** was hiding the Contas entry from non-admin in two places: (1) the **desktop** header navigation showed only "Área do autor" and "Sair" for authenticated users (the "Contas" link existed only in the mobile menu); (2) on the **Área do autor** dashboard page, the "Contas" button was rendered only when `isAdmin` is true.

**Solution**: Show the "Contas" link to **any authenticated author** (Admin and non-admin) in both the desktop header navigation and on the Área do autor dashboard. No change to the Contas page behavior: Admin continues to see all accounts; non-admin continue to see only their own profile.

## Goals

- **Discoverability**: Any logged-in author can find "Contas" from the main header (desktop and mobile) and from the Área do autor dashboard.
- **Consistency with spec**: The auth spec already states that any authenticated author SHALL be able to access the Contas screen; the frontend SHALL expose that access via a visible menu/link for all authenticated users.

## Scope

- **In scope**: (1) In the desktop header nav (`Header.tsx`), add the "Contas" link for authenticated users (same as already present in mobile menu). (2) In `AreaAutor.tsx`, show the "Contas" button for any authenticated author, not only when `isAdmin` (e.g. remove the `isAdmin &&` wrapper around the Contas link). (3) Add a spec delta (auth) requiring that the frontend SHALL display the Contas entry (link or button) to all authenticated authors in the main navigation and in the author area dashboard.
- **Out of scope**: Changing the Contas page logic (non-admin vs Admin view), API, or BFF.

## Affected code and docs

- **frontend/src/components/layout/Header.tsx**: In the desktop nav block (`hidden md:flex`), add a "Contas" link between "Área do autor" and "Sair" when `isAuthenticated`.
- **frontend/src/pages/AreaAutor.tsx**: Show the Contas button for any authenticated author (remove the `isAdmin &&` condition so the link is always visible when on the author dashboard).
- **openspec/changes/show-contas-menu-to-all-authenticated-authors/specs/auth/spec.md**: ADDED or MODIFIED requirement that the frontend SHALL show the Contas menu/link to all authenticated authors (not only Admin) in the main navigation and in the author area dashboard. Scenario: non-admin author sees "Contas" in the header and on the dashboard and can open it to reach their profile.

## Dependencies and risks

- **No risk**: UI-only change; Contas page and API already support non-admin (single profile, edit own bio/name/password).

## Success criteria

- Desktop header shows "Contas" when the user is authenticated (Admin or not).
- Área do autor dashboard shows the "Contas" button for any authenticated author.
- Spec delta includes requirement and scenario; `openspec validate show-contas-menu-to-all-authenticated-authors --strict` passes.
