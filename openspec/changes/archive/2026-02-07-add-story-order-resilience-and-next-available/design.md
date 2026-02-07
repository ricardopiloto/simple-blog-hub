# Design: Story order resilience

## Problem

- **Next suggested** is currently max(story_order) among **published** posts + 1. So if author A has published 1,2,3 and author B creates a draft with order 30, the next "Novo Post" still suggests 4. When B publishes, we have 1,2,3,4 and 30 — "30" is far out. If we instead suggest 31 for the next new post, the sequence stays contiguous (1,2,3,4,...,30,31).
- Authors can type any number in the Ordem field. If they accidentally type 30 instead of 3, we get a large gap and no feedback.

## Decision: Next = max over posts in the story + 1

Compute the **next suggested** as the maximum `story_order` over posts with **IncludeInStoryOrder == true** (published and draft) + 1. That way:
- Every "Novo Post" gets the next free slot in the story sequence (Índice da História). Posts that are not part of the story are excluded from this max.
- No two *story* posts need to share the same number (unless the user explicitly reorders later in the Índice). Drafts count for the max, so we avoid suggesting 4 when there is already a draft with order 30.

## Decision: Warning only (no hard block)

When the author enters a story_order that is **more than a threshold** (e.g. 5) above the suggested next, show an **inline warning** (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X."). Do **not** block save: the author may intend to leave a gap (e.g. for future inserts). The warning is to catch mistakes (e.g. typing 30 instead of 3).

**Threshold**: Use a small constant (e.g. 5). So if suggested next is 6 and they type 12 or more, show the warning. If they type 7–11, no warning (small gap allowed).

## Frontend: When to show warning

- **New post**: Suggested next = value from GET next-story-order (max over story posts + 1). User can edit the field. If `storyOrder > nextStoryOrder + THRESHOLD`, show warning.
- **Edit post**: Call GET next-story-order in edit mode too; it returns max(story posts)+1. If the user's entered `storyOrder` is greater than nextStoryOrder + THRESHOLD, show warning (e.g. they change order from 5 to 50).
