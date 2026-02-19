# post-edit-form — delta for move-story-type-error-below-form-buttons

## ADDED Requirements

### Requirement: Alerta de validação do campo História abaixo dos botões (SHALL)

When the user submits the **New post** or **Edit post** form without having selected the **História** (Velho Mundo or Idade das Trevas), the system SHALL prevent submit and SHALL indicate the error in two ways: (1) the **toggle box** (ToggleGroup) for the História field SHALL display a **red border** (e.g. `border-destructive`) so the field is visually marked as invalid; (2) the **validation message** (e.g. "Deve escolher a história" or equivalent) SHALL be displayed **below the form action buttons** (Criar post / Salvar and Cancelar), not next to the História field. This keeps the error message at the bottom of the form, immediately below the primary actions, while the red border on the toggle continues to identify which control needs correction.

#### Scenario: Alerta de História obrigatório aparece abaixo dos botões

- **GIVEN** the user is on the "Novo post" or "Editar post" form
- **WHEN** they submit without selecting Velho Mundo or Idade das Trevas
- **THEN** the submit is prevented
- **AND** the toggle (História) displays a **red border** to indicate the field is in error
- **AND** the validation message (e.g. "Deve escolher a história") is shown **below** the "Criar post" and "Cancelar" buttons (or "Salvar" and "Cancelar" on Edit post), not directly under the toggle
