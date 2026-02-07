# Tasks: show-contas-menu-to-all-authenticated-authors

## 1. Header desktop nav

- [x] 1.1 In `frontend/src/components/layout/Header.tsx`, in the desktop navigation block (authenticated branch), add a "Contas" link to `/area-autor/contas` between "Área do autor" and "Sair", so that any authenticated user (Admin or non-admin) sees it on desktop.

## 2. Área do autor dashboard

- [x] 2.1 In `frontend/src/pages/AreaAutor.tsx`, show the "Contas" button/link for any authenticated author: remove the `isAdmin &&` condition that currently hides it from non-admin, so both Admin and non-admin see the Contas entry on the dashboard.

## 3. Spec delta (auth)

- [x] 3.1 Add in `openspec/changes/show-contas-menu-to-all-authenticated-authors/specs/auth/spec.md` one **ADDED** requirement: the frontend SHALL display the "Contas" menu entry (link or button) to **all authenticated authors** (Admin and non-admin) in (1) the main navigation (header, both desktop and mobile) and (2) the Área do autor dashboard, so that non-admin authors can discover and open Contas to edit their own profile (author name, author bio, password). Add one scenario: when a non-admin author is logged in, they SHALL see "Contas" in the header and on the Área do autor page and SHALL be able to open it to reach their profile (single-user view).

## 4. Validation

- [x] 4.1 Run `openspec validate show-contas-menu-to-all-authenticated-authors --strict` and resolve any issues.
