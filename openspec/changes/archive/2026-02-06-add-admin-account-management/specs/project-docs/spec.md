# project-docs (delta)

## ADDED Requirements

### Requirement: README documents Admin email configuration

The README SHALL document how to configure the Admin account for the system. It SHALL state which environment variable (or configuration key) sets the Admin email (e.g. `Admin__Email` for the API) and SHALL give an example value (e.g. `ac.ricardosobral@gmail.com`). It SHALL explain that only the user with that email can create, update, and delete other user accounts, and that other authors can only change their own password.

#### Scenario: Operator configures Admin

- **WHEN** an operator reads the README to set up the blog
- **THEN** they find a section or table describing the Admin email configuration (variable name and example)
- **AND** they can set the variable (e.g. in .env or environment) so the system identifies the Admin account correctly
