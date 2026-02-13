# author-area-dashboard — delta for add-date-filter-and-autocomplete-posts-author-area

## ADDED Requirements

### Requirement: Filtro por data com calendário (data única ou intervalo) na secção Publicações (SHALL)

The **Publicações** section (author area post list at /area-autor) SHALL provide a **date filter** next to the text search field. When the user interacts with the date control (e.g. clicks it), a **calendar** (date picker) SHALL open allowing the user to choose **a single date** or a **date range** (start and end date). By **default**, no date filter SHALL be applied — the list shows all posts (subject to other filters: status, story type, text). When the user selects a date or range, the list SHALL be filtered client-side to posts whose **publication date** (`published_at`, or `created_at` when not published) falls on that date or within that range (inclusive). The date filter SHALL apply in conjunction with the existing filters (status, story type, text search).

#### Scenario: No date filter by default in Publicações

- **GIVEN** the user is on the Publicações section (/area-autor)
- **WHEN** they have not selected any date
- **THEN** the list shows all posts (according to other filters)
- **AND** no date filter is applied

#### Scenario: User selects a date range in Publicações

- **GIVEN** the user opens the date picker next to the search field in Publicações
- **WHEN** they select a start date and an end date (range)
- **THEN** the list shows only posts whose publication (or creation) date is between those dates (inclusive)
- **AND** the result respects the other active filters (status, story type, text)

#### Scenario: Calendar opens on interaction in Publicações

- **GIVEN** the user is in the Publicações section
- **WHEN** they click (or focus) the date filter control
- **THEN** a calendar is displayed allowing selection of one date or a range of dates

### Requirement: Auto-complete no campo de pesquisa da secção Publicações (SHALL)

The **search/filter field** in the Publicações section SHALL show **suggestions** (auto-complete) as the user types. Suggestions SHALL be derived from the **loaded list** of posts and SHALL include options that match the current input: e.g. **author names** and **post titles** that contain the typed text (case-insensitive). The list of suggestions SHALL update as the user types (e.g. typing "D" shows matches for "D"; "Do" narrows to "Do"; "Dora" to "Dora"). The user MAY select a suggestion to apply that value to the search field and filter the list, or continue typing. The UI SHALL present a dropdown (or equivalent) with the matching options while the user types.

#### Scenario: Suggestions appear as user types in Publicações

- **GIVEN** the Publicações section has loaded and the user focuses or types in the search field
- **WHEN** they type a character or substring (e.g. "Do")
- **THEN** a dropdown (or list) of suggestions is shown with options that match the current text (e.g. author names or titles from the loaded list containing "Do")
- **AND** the suggestions update as the user continues typing

#### Scenario: Selecting a suggestion applies the filter in Publicações

- **GIVEN** the suggestions dropdown is visible with at least one option
- **WHEN** the user selects one suggestion (e.g. an author name or title)
- **THEN** the search field is filled with that value (or the filter is applied with that value)
- **AND** the list is filtered accordingly

## MODIFIED Requirements

### Requirement: Área do Autor list has scroll when more than 10 records and dynamic filter

**Scope update:** The existing dynamic text filter SHALL remain; in addition, the Publicações section SHALL provide the **date filter** (see ADDED requirement "Filtro por data com calendário na secção Publicações") and **auto-complete** (see ADDED requirement "Auto-complete no campo de pesquisa da secção Publicações"). The date filter SHALL be applied client-side together with the existing text filter (author, title, publication date string). The new auto-complete SHALL suggest author names and titles from the loaded list that match the current input.

The following scenario is added:

#### Scenario: Filtro de texto e filtro de data em conjunto na Publicações

- **GIVEN** the user has entered text in the search field and optionally selected a date or date range
- **WHEN** the list is displayed in Publicações
- **THEN** the result is filtered by both: (1) text match on title, author name, or date string, and (2) publication (or creation) date within the selected date or range (if any)
- **AND** the existing filters (status, story type) continue to apply
