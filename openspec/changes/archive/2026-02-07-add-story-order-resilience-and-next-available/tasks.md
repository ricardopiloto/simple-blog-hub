# Tasks: add-story-order-resilience-and-next-available

## 1. API: Next story order over all posts

- [x] 1.1 In the API endpoint GET /api/posts/next-story-order, change the computation of `maxOrder` so that it uses posts with **IncludeInStoryOrder == true** (published and draft), not only published. The next value SHALL be max(story_order) over those posts + 1 (or 1 if none). This ensures "Novo Post" always gets the next available position in the story sequence and aligns with add-post-include-in-story-order.

## 2. Frontend: Fetch next order for edit form (optional but recommended)

- [x] 2.1 In PostEdit, when in **edit** mode, also fetch the next-story-order (or pass a "current max" from context) so we can compare the user's entered story_order to the suggested next and show the warning when applicable. If the API is only called for isNew, consider enabling it for edit too so we have a single "suggested next" value for both flows.

## 3. Frontend: Warning when order is far out

- [x] 3.1 In the post form (new and edit), define a threshold (e.g. 5). When the user's entered `storyOrder` is greater than `suggestedNext + threshold` (where suggestedNext comes from the next-story-order API or equivalent), display an inline warning message (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X."). Do not block submit; the user can still save. Use the existing next-story-order value for new post; for edit, use the same API if called, or the post's current order and max from list as fallback.

## 4. Spec deltas (post-edit-form)

- [x] 4.1 In `openspec/changes/add-story-order-resilience-and-next-available/specs/post-edit-form/spec.md`: (1) **MODIFIED** the requirement "Novo post tem ordem inicial sugerida a partir do último artigo publicado" so that the **next suggested** is max(story_order) over **all** posts (published and draft) + 1, not only published — so "Novo Post" always gets the next available sequence. (2) **ADDED** a requirement: when the author enters a story_order value that is more than a defined threshold (e.g. 5) above the suggested next, the frontend SHALL show a warning (e.g. inline message) so the author is aware; the author MAY still save. Add a scenario: author opens "Novo Post", suggested is 31; they type 50; warning is shown; they can correct to 31 or keep 50 and save.

## 5. Validation

- [x] 5.1 Run `openspec validate add-story-order-resilience-and-next-available --strict` and resolve any issues.
