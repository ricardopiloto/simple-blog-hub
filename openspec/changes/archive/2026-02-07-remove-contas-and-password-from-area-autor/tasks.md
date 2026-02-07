# Tasks: remove-contas-and-password-from-area-autor

## 1. Remove Contas button from Área do Autor

- [x] 1.1 In `frontend/src/pages/AreaAutor.tsx`, remove the "Contas" button (the `<Button variant="outline" asChild><Link to="/area-autor/contas">Contas</Link></Button>` and its wrapper) from the dashboard actions, so that Contas is reached only via the header.

## 2. Remove "Alterar minha senha" section from Área do Autor

- [x] 2.1 In `frontend/src/pages/AreaAutor.tsx`, remove the entire "Alterar minha senha" block (heading, help text, form with new password and confirm password fields, submit button, success/error messages). Remove the related state (`newPassword`, `confirmPassword`), mutation (`changePasswordMutation`), and handler (`handleChangePassword`). Remove any imports that become unused (e.g. `Input`, `Label`, `updateUser`, `PASSWORD_CRITERIA_HELP`, `isValidPassword` if only used there; remove `setMustChangePassword` from useAuth destructuring if only used in the removed mutation).

## 3. Spec delta (auth)

- [x] 3.1 Add in `openspec/changes/remove-contas-and-password-from-area-autor/specs/auth/spec.md` one **ADDED** requirement: the **Área do Autor** dashboard page SHALL NOT display a "Contas" button (access to Contas is only via the main navigation / header). The Área do Autor SHALL NOT display an "Alterar minha senha" section; changing password SHALL be done in the Contas screen (edit user form). Add one scenario: when an authenticated author opens the Área do Autor, they see only the list of posts and the "Novo post" action; they use the header to open Contas to edit their profile or password.

## 4. Validation

- [x] 4.1 Run `openspec validate remove-contas-and-password-from-area-autor --strict` and resolve any issues.
