# Tasks: add-author-area-list-scroll-and-filter

## 1. Dynamic filter (search by author, title, date)

- [x] 1.1 In `frontend/src/pages/AreaAutor.tsx`, add state for the filter query (e.g. `filterQuery`, `setFilterQuery`). Add a search input above the post list with a placeholder such as "Pesquisar por autor, título ou data". Filter the displayed posts client-side: include a post if the query (trimmed, lowercased) is empty or if it is contained in (a) post title (lowercase), (b) post author name (lowercase), or (c) a formatted publication date string (e.g. format `published_at` to locale date or ISO date so the user can search by year, month, or day). Use the filtered array for rendering the list.

## 2. Scrollable container when more than 10 records

- [x] 2.1 In `frontend/src/pages/AreaAutor.tsx`, wrap the post list (`<ul>`) in a container div. When the **filtered** list length is greater than 10, apply a max height (e.g. equivalent to ~10 rows, such as `max-height: 32rem` or `520px`) and `overflow-y: auto` so a vertical scrollbar appears. When 10 or fewer items, the container may use natural height (no max-height or same container without forcing scroll). Ensure the scrollbar is visible when there are more than 10 items in the list.

## 3. Spec delta (author-area-dashboard)

- [x] 3.1 Add in `openspec/changes/add-author-area-list-scroll-and-filter/specs/author-area-dashboard/spec.md` one **ADDED** requirement: the Área do Autor post list SHALL display a vertical scrollbar when the list contains more than 10 records (the list container SHALL have a maximum height and overflow-y auto in that case). The Área do Autor SHALL provide a **dynamic filter** (single search field) that filters the list in real time by **author name**, **title**, and **publication date**. Add scenarios: (1) when the list has more than 10 posts, the user sees a scrollable area with a scrollbar; (2) when the user types in the filter, the list updates immediately to show only posts matching the query in author, title, or date.

## 4. Validation

- [x] 4.1 Run `openspec validate add-author-area-list-scroll-and-filter --strict` and resolve any issues.
