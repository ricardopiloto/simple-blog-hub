# Proposal: Story order resilience — next available for Novo Post and warning when order is far out

## Summary

Two related improvements for **story_order** (ordem na história) on the Artigos / post form:

1. **Next available for "Novo Post"**: When the author clicks **Novo Post**, the form SHALL always be pre-filled with the **next available** sequence number in the story. Today the API returns `max(story_order)` among **published** posts + 1. That can leave a gap: e.g. author A has published 1,2,3 and author B creates a draft with order 30 (part of the story); the next "Novo Post" would still suggest 4. To avoid that, the **next suggested** SHALL be **max(story_order) over posts that are part of the story** (IncludeInStoryOrder == true), both published and draft, + 1. So "Novo Post" always gets the next free slot in the story sequence (e.g. 31 after 30). Posts that are not part of the story (IncludeInStoryOrder == false) are excluded from this max, so the suggested number is the next position in the Índice da História.

2. **Resilience warning when order is far out**: When the author **manually enters** a story_order (in new or edit form) that is **too far** above the suggested next or above the current max (e.g. they type 30 when the suggested next is 3), the system SHALL **alert** the author (e.g. inline message: "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X."). The field remains editable and the author can still save (override) if they intend to leave a gap; the goal is to avoid accidental large jumps. Optionally the frontend can obtain the current max or suggested next when editing so it can show the warning whenever `storyOrder > suggestedNext + threshold` (e.g. threshold 5 or 10).

## Goals

- **Guarantee**: "Novo Post" always gets the **next available** story_order in the story sequence (max over posts with IncludeInStoryOrder == true + 1), so we never suggest 2 when there is already a story post with 30. Drafts count for this max.
- **Alert**: If the author types an order number that is "too far" ahead of the current sequence (e.g. more than N above the suggested next), show a clear warning so they can correct or confirm.
- **No breaking change**: Existing behaviour (user can still edit the order field and save any value) remains; we only change how the suggested value is computed and add a warning.

## Scope

- **In scope**: (1) **API**: Change GET /api/posts/next-story-order (and BFF proxy) so that the next value is `max(story_order)` over posts with **IncludeInStoryOrder == true** (published and draft) + 1, instead of only published. This aligns with the story-index semantics (only story posts) and avoids the gap when a draft has a high order. (2) **Frontend**: In the post form (new and edit), when the user has entered a story_order that is more than a defined threshold (e.g. 5) above the suggested next (for new post, use the value from next-story-order; for edit, optionally fetch current max or use a known value), show an inline warning (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X."). The form still allows save; the warning is advisory. (3) **Spec deltas**: post-edit-form (or story-index) — next is next available globally; add requirement and scenario for the warning when order is far out.
- **Out of scope**: Blocking save when order is "too far" (we only warn); changing the Índice da História reorder flow; backend validation that rejects story_order above a cap.

## Affected code and docs

- **backend/api/Controllers/PostsController.cs**: In GetNextStoryOrder, compute `maxOrder` over posts with IncludeInStoryOrder == true (published and draft), not only published — so the next suggested is the next position in the story sequence.
- **frontend/src/pages/PostEdit.tsx**: For new post, we already have `nextStoryOrder`; for edit we have the post's current order. Call fetchNextStoryOrder when editing too (it returns max+1 over story posts); if storyOrder > nextStoryOrder + threshold, show warning. Or we could pass the max from the list. Simplest: when in new post, suggested = nextStoryOrder; when in edit, we could still call next-story-order (returns global max+1) and if the user's entered value is > that value (or > that - 1 + threshold), show warning. Actually: "far out" means the value they typed is much larger than the "natural" next. So: suggested next = from API (global max+1). If they type storyOrder >= suggestedNext + threshold (e.g. 5), show warning. For edit form we need suggestedNext: we can fetch next-story-order in edit mode too (it's global max+1), and if the user changes the field to something > suggestedNext + threshold, show warning. So enable fetchNextStoryOrder for both isNew and edit, and use it as the "current suggested next" (meaning: the next free slot). Then warning when storyOrder > nextStoryOrder + threshold (e.g. 5).
- **openspec/changes/add-story-order-resilience-and-next-available/specs/post-edit-form/spec.md**: MODIFIED requirement for next suggested (all posts); ADDED requirement for warning when order far out.

## Dependencies and risks

- **None**: Small API change (remove Published filter) and frontend warning. Existing posts and orders unchanged.

## Success criteria

- "Novo Post" form always shows next = max(posts with IncludeInStoryOrder).story_order + 1.
- When the author enters an order number more than a threshold (e.g. 5) above that suggested next, a warning is shown; save still allowed.
- Spec deltas and `openspec validate add-story-order-resilience-and-next-available --strict` pass.
