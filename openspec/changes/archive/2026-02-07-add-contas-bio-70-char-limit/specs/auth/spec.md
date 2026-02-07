# auth — delta for add-contas-bio-70-char-limit

## ADDED Requirements

### Requirement: Author bio in Contas limited to 70 characters

The **author bio** (descrição do autor) field in the **Contas** screen SHALL be limited to **70 characters**. The frontend SHALL enforce this limit in the edit form (e.g. by setting `maxLength={70}` on the input and optionally showing a character counter or hint such as "Máx. 70 caracteres"). The API SHALL reject any attempt to set the bio to a value longer than 70 characters (after trimming): when the request includes a Bio field and its trimmed length is greater than 70, the API SHALL return 400 Bad Request (or equivalent) and SHALL NOT persist the value. This limit applies to both Admin editing any user and to a user editing their own profile. The purpose is to keep the bio as a short tagline displayed on the post page and in the profile.

#### Scenario: User cannot exceed 70 characters in Bio

- **GIVEN** the user is on the Contas screen editing their profile (or the Admin is editing a user)
- **WHEN** they enter or paste text in the "Descrição do autor" (Bio) field
- **THEN** the frontend SHALL prevent input beyond 70 characters (e.g. input maxLength or truncation)
- **AND** if a longer value is somehow submitted (e.g. from another client), the API SHALL reject it with 400 and the bio SHALL NOT be updated
- **AND** a saved bio of at most 70 characters SHALL be displayed correctly in the profile and on the post page
