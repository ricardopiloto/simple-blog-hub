# posts-list — delta for add-date-filter-and-autocomplete-posts-author-area

## ADDED Requirements

### Requirement: Filtro por data com calendário (data única ou intervalo) na página Artigos (SHALL)

A página **Artigos** (`/posts`) SHALL provide a **date filter** next to the text search field. When the user interacts with the date control (e.g. clicks it), a **calendar** (date picker) SHALL open allowing the user to choose **a single date** or a **date range** (start and end date). By **default**, no date filter SHALL be applied — the list shows all published posts with existing pagination. When the user selects a date or range, the list SHALL be filtered to posts whose **publication date** (`published_at`) falls on that date or within that range (inclusive). Pagination SHALL apply to the filtered result; when the date filter changes, the page SHALL reset to 1. The API/BFF SHALL support optional query parameters (e.g. `fromDate`, `toDate` in ISO date format) for the paginated public list so that filtering by date is performed server-side.

#### Scenario: No date filter by default

- **GIVEN** the user is on the Artigos page
- **WHEN** they have not selected any date
- **THEN** the list shows all published posts (with pagination)
- **AND** no date filter is applied

#### Scenario: User selects a single date

- **GIVEN** the user opens the date picker next to the search field
- **WHEN** they select a single date (e.g. 15/02/2025)
- **THEN** the list shows only posts whose publication date is on that day
- **AND** pagination applies to this filtered result
- **AND** the current page is reset to 1

#### Scenario: User selects a date range

- **GIVEN** the user opens the date picker
- **WHEN** they select a start date and an end date (range)
- **THEN** the list shows only posts whose publication date is between those dates (inclusive)
- **AND** pagination applies to this filtered result
- **AND** the current page is reset to 1

#### Scenario: Calendar opens on interaction

- **GIVEN** the user is on the Artigos page
- **WHEN** they click (or focus) the date filter control
- **THEN** a calendar is displayed allowing selection of one date or a range of dates

### Requirement: Auto-complete no campo de pesquisa da página Artigos (SHALL)

The **search field** on the Artigos page SHALL show **suggestions** (auto-complete) as the user types. Suggestions SHALL include options that match the current input (e.g. author names, post titles that contain the typed text, case-insensitive). The list of suggestions SHALL update as the user types (e.g. typing "D" shows matches for "D"; "Do" narrows to "Do"; "Dora" to "Dora"). The user MAY select a suggestion to apply that value to the search field and filter the list, or continue typing. The implementation MAY derive suggestions from the first page of search results or from a dedicated suggestions endpoint; the UI SHALL present a dropdown (or equivalent) with the matching options while the user types.

#### Scenario: Suggestions appear as user types

- **GIVEN** the user is on the Artigos page and the search field is focused or has focus after typing
- **WHEN** they type a character or substring (e.g. "Do")
- **THEN** a dropdown (or list) of suggestions is shown with options that match the current text (e.g. author names or titles containing "Do")
- **AND** the suggestions update as the user continues typing

#### Scenario: Selecting a suggestion applies the filter

- **GIVEN** the suggestions dropdown is visible with at least one option
- **WHEN** the user selects one suggestion (e.g. an author name or title)
- **THEN** the search field is filled with that value (or the filter is applied with that value)
- **AND** the list is filtered accordingly and pagination applies to the result

## MODIFIED Requirements

### Requirement: Filtro de pesquisa dinâmico por título, autor e data

**Scope update:** The existing text search filter SHALL remain; in addition, the page SHALL provide the **date filter** (see ADDED requirement "Filtro por data com calendário") and **auto-complete** (see ADDED requirement "Auto-complete no campo de pesquisa"). The dynamic text filter SHALL continue to consider title, author name, and date string as today; the new date filter is separate and applies by publication date (single date or range). The new auto-complete SHALL suggest author names and titles that match the current input.

No change to the existing scenarios for search by title, author, or date string; they still apply. The following scenario is added:

#### Scenario: Filtro de texto e filtro de data em conjunto

- **GIVEN** the user has entered text in the search field and optionally selected a date or date range
- **WHEN** the list is displayed
- **THEN** the result is filtered by both: (1) text match on title, author, or date string, and (2) publication date within the selected date or range (if any)
- **AND** pagination applies to the combined filtered result
