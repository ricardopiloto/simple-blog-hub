# auth — delta for add-non-admin-contas-own-profile-and-bio

## ADDED Requirements

### Requirement: Non-admin users see only own profile in Contas and can edit own bio

Any **authenticated author** (Admin or not) SHALL be able to access the **Contas** screen (e.g. `/area-autor/contas`). **Non-admin** users SHALL see **only their own user** (a single profile) on that screen, not the list of all accounts. The API SHALL provide a "current user" endpoint (e.g. GET /api/users/me or equivalent via BFF) that returns the authenticated user's profile (id, email, author name, author bio) so the frontend can display a single-profile view for non-admin. On the Contas screen, non-admin users SHALL be able to **edit their own author name**, **author bio** (descrição do autor, breve frase exibida na página do artigo), and **password**. The API SHALL allow PUT (or equivalent) on the user resource for the **own** user id (when the authenticated author's user id matches the target id) to update author name, author bio, and password; only the Admin SHALL be allowed to update other users or to update email. The Admin SHALL continue to see the list of all users and to create, edit, reset-password, and delete other accounts.

#### Scenario: Non-admin opens Contas and sees only own profile

- **GIVEN** the user is logged in and is **not** the Admin (their email does not match the configured Admin email)
- **WHEN** they navigate to the Contas screen (e.g. `/area-autor/contas`)
- **THEN** the screen SHALL display only **one** profile (their own: their email, author name, author bio if set)
- **AND** the screen SHALL NOT display the list of other users or the "Nova conta" (create user) action
- **AND** they SHALL see an "Editar" (or equivalent) action to edit that single profile

#### Scenario: Non-admin edits own author bio and change persists

- **GIVEN** the user is logged in as a non-admin author
- **WHEN** they open Contas, click Editar on their profile, change the **author bio** (descrição do autor) field, and save
- **THEN** the API SHALL accept the update (PUT or equivalent for their own user id with the bio field)
- **AND** the new bio SHALL be persisted and SHALL appear in the author's profile and in the post page (author description) when that author has published posts
- **AND** the user SHALL be able to edit their own author name and password in the same way (own profile only)

#### Scenario: Admin sees list of all users in Contas

- **GIVEN** the user is logged in as the Admin (email matches configured Admin email)
- **WHEN** they navigate to the Contas screen
- **THEN** the screen SHALL display the **list of all users** (all accounts)
- **AND** the Admin SHALL see actions to create new users, edit any user (including email, author name, author bio, password), reset password, and delete users (subject to existing policy, e.g. not delete self if applicable)
