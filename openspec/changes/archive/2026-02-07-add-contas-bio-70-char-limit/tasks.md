# Tasks: add-contas-bio-70-char-limit

## 1. Frontend: limit and feedback

- [x] 1.1 In `frontend/src/pages/AreaContas.tsx`, on the "Descrição do autor" (Bio) input, set `maxLength={70}`. Optionally add a short hint or character counter (e.g. "Máx. 70 caracteres" or "X/70") so the user sees the limit.

## 2. API: validation

- [x] 2.1 In the API endpoint that updates the user (e.g. `PUT /api/users/{id}`), when the request includes a Bio value, validate that the trimmed length is at most 70 characters. If greater than 70, return 400 Bad Request (and optionally a message such as "Bio must be at most 70 characters"). Apply the same rule when the caller is Admin updating any user or a user updating their own profile.

## 3. Spec delta (auth)

- [x] 3.1 Add in `openspec/changes/add-contas-bio-70-char-limit/specs/auth/spec.md` one **ADDED** requirement: the **author bio** (descrição do autor) in the Contas screen SHALL be limited to **70 characters**. The frontend SHALL enforce this (e.g. input maxLength and/or visible counter). The API SHALL reject (e.g. 400) any update that sets the bio to a value longer than 70 characters (after trimming). Add one scenario: when the user enters or pastes more than 70 characters in the Bio field, they cannot submit beyond 70 (frontend) or the API returns an error (backend).

## 4. Validation

- [x] 4.1 Run `openspec validate add-contas-bio-70-char-limit --strict` and resolve any issues.
