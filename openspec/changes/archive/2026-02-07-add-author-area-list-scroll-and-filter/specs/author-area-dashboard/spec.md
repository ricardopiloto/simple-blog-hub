# author-area-dashboard — delta for add-author-area-list-scroll-and-filter

## ADDED Requirements

### Requirement: Área do Autor list has scroll when more than 10 records and dynamic filter

The **Área do Autor** (author dashboard) post list SHALL show a **vertical scrollbar** when the list contains more than **10 records**. The list container SHALL have a maximum height (e.g. equivalent to approximately 10 rows) and `overflow-y: auto` so that when there are more than 10 items (before or after applying the filter), the user can scroll within the container and the scrollbar is visible. When the list has 10 or fewer items, the container may use natural height. The Área do Autor SHALL provide a **dynamic filter** (a single search field) that filters the list **in real time** by **author name**, **title**, and **publication date**. The filter SHALL match the user's input (e.g. case-insensitive substring) against the post's title, the post author's name, and a formatted publication date string (e.g. from `published_at`). An empty search SHALL show all posts. Filtering is performed client-side on the already-loaded list; no new API endpoint is required.

#### Scenario: Scrollbar visible when list has more than 10 posts

- **GIVEN** the Área do Autor has loaded and the list of posts (after any filter) has **more than 10** items
- **WHEN** the user views the list
- **THEN** the list is inside a scrollable container with a visible vertical scrollbar
- **AND** the user can scroll to see all items without the page growing unbounded

#### Scenario: Dynamic filter narrows list by author, title, or date

- **GIVEN** the Área do Autor has loaded with a list of posts
- **WHEN** the user types in the search/filter field (e.g. an author name, part of a title, or a date fragment such as a year or day)
- **THEN** the list updates **immediately** (in real time) to show only posts that match the query in at least one of: author name, title, or publication date
- **AND** when the user clears the search, the full list is shown again
