# Tasks: add-non-admin-contas-own-profile-and-bio

## 1. Spec delta (auth)

- [x] 1.1 Add in `openspec/changes/add-non-admin-contas-own-profile-and-bio/specs/auth/spec.md` one **ADDED** requirement: non-admin users SHALL be able to access the Contas screen (`/area-autor/contas`) and SHALL see only their **own** user (single profile), not the list of all accounts. On that screen, non-admin users SHALL be able to edit their own **author name**, **author bio** (descrição do autor), and **password**. The API SHALL expose a "current user" endpoint (e.g. GET /api/users/me) so the frontend can load the single profile for non-admin, and SHALL allow PUT /api/users/{id} for the authenticated user's own id to update author name, bio, and password (and only the Admin may update email or other users' data). Add scenarios: (1) non-admin opens Contas and sees only one profile (their own); (2) non-admin edits their own author bio (and optionally name/password) and the change persists; (3) Admin continues to see the list of all users and full management actions.

## 2. Validation

- [x] 2.1 Run `openspec validate add-non-admin-contas-own-profile-and-bio --strict` and resolve any issues.
