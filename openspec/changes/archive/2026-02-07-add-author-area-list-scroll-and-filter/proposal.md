# Proposal: Scroll and dynamic filter for Área do Autor post list

## Summary

Add two UX improvements to the **Área do Autor** (author dashboard) post list: (1) a **scrollbar** that becomes visible when the list has more than **10 records** — the list container SHALL have a maximum height (e.g. equivalent to about 10 rows) and `overflow-y: auto` so a vertical scrollbar appears when there are more than 10 items; (2) a **dynamic search/filter** — a single search input that filters the list in real time by **author name**, **title**, or **publication date** (e.g. formatted date string). Filtering is client-side (no new API); the existing `fetchAllPostsForAuthorArea()` returns all posts and the frontend filters by the current query. When there are 10 or fewer records, the scrollbar is not required (container can use natural height); when there are more than 10, the scrollable container and scrollbar SHALL be shown.

## Goals

- **Scroll**: When the Área do Autor list has more than 10 posts (or more than 10 after filtering), the list is placed in a scrollable container with a visible scrollbar so the page does not grow unbounded.
- **Filter**: The author can type in a search field and see the list narrow in real time by matching **author** (post author name), **title**, or **publication date** (formatted, e.g. locale date or ISO substring). One input, one combined filter across these three fields.

## Scope

- **In scope**: (1) In `frontend/src/pages/AreaAutor.tsx`, wrap the post list in a container that has a max height (e.g. fitting ~10 rows) and `overflow-y: auto` when the list has more than 10 items (use the filtered list length for this so scroll appears when filtered result has >10). (2) Add a search/filter input above the list; on change, filter the displayed posts client-side by matching the query (case-insensitive) against post title, post author name, and formatted publication date (e.g. `published_at` formatted to a readable date string). Empty query shows all posts. (3) Add a spec delta for a new or existing capability (e.g. **author-area-dashboard**) requiring the Área do Autor list to have scroll when >10 records and a dynamic filter by author, title, and publication date.
- **Out of scope**: Server-side search or pagination; changing the API or BFF.

## Affected code and docs

- **frontend/src/pages/AreaAutor.tsx**: Add state for filter query (e.g. `filterQuery`); add an `<input>` (or controlled Input) for search, placed above the list; derive `filteredPosts` from `posts` by filtering where title, author.name, or formatted published_at includes the query (normalize to lowercase for text); render `filteredPosts` in the list; wrap the list in a div with conditional max-height and overflow-y auto when `filteredPosts.length > 10`. Optionally show a short label or placeholder "Pesquisar por autor, título ou data".
- **openspec/changes/add-author-area-list-scroll-and-filter/specs/author-area-dashboard/spec.md**: New capability delta: ADDED requirement that the Área do Autor post list SHALL show a vertical scrollbar when the list has more than 10 records (scrollable container with max height), and SHALL provide a dynamic filter (single search field) that filters by author name, title, and publication date. Scenarios: (1) list with >10 posts shows scrollbar; (2) user types in filter and list updates in real time by author/title/date.

## Dependencies and risks

- **None**: Client-side only; Post type already has `title`, `author.name`, `published_at`.

## Success criteria

- When the list has more than 10 items (before or after filter), a scrollbar is visible and the list scrolls.
- A search input filters the list dynamically by author, title, and publication date.
- Spec delta and `openspec validate add-author-area-list-scroll-and-filter --strict` pass.
