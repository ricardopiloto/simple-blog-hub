# auth — delta for remove-contas-and-password-from-area-autor

## ADDED Requirements

### Requirement: Área do Autor dashboard does not duplicate Contas or password change

The **Área do Autor** (author dashboard) page SHALL NOT display a **"Contas"** button; access to the Contas screen SHALL be only via the **main navigation** (header), for all authenticated authors. The Área do Autor SHALL NOT display an **"Alterar minha senha"** section; changing the user's password SHALL be done in the **Contas** screen (edit user form). The dashboard SHALL remain focused on listing and managing posts (Novo post, Editar, Excluir), while profile and password are managed in Contas.

#### Scenario: Author uses header for Contas; dashboard shows only posts

- **GIVEN** the user is logged in as an author (Admin or non-admin)
- **WHEN** they open the Área do Autor page
- **THEN** they see only the list of posts and the "Novo post" action (and per-post Editar/Excluir as applicable)
- **AND** they do NOT see a "Contas" button or an "Alterar minha senha" section on that page
- **AND** they can open Contas via the header (menu superior) to edit their profile (author name, author bio) or change their password
