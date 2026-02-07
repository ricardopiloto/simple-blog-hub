# Proposal: Add post view count for logged-in users

## Summary

Add a **view count** per post so that **only logged-in users** (autores) can see how many times a post has been viewed. The count is displayed in two places: (1) in the **author area** (Área do autor), next to the "Publicado" / "Rascunho" indicator on each post card, and (2) on the **article page** (`/post/:slug`), on the same line as the author and publication date, with an icon (e.g. eye). Anonymous readers do not see the count; the API/BFF expose it only when the request is authenticated.

## Goals

- **Storage**: Persist a view count per post (e.g. `ViewCount` column on `Post`); increment when the post is viewed via the public GET-by-slug flow.
- **Visibility**: Only authenticated users see the count: BFF includes `view_count` in post responses only when the client sends a valid JWT; frontend shows the count only when present in the response.
- **UI – Author area**: Display the view count on each post card next to the "Publicado" / "Rascunho" label (e.g. "· Publicado · 42 visualizações" or with icon).
- **UI – Article page**: Display the view count with an icon on the same line as the author name and publication date (metadata row at the top of the article).

## Scope

- **In scope**: API model and migration (`ViewCount` on `Post`), increment on public GET by slug, `PostDto.view_count`; BFF logic to include `view_count` only for authenticated requests; frontend types, author-area card subtitle, and article page metadata row; design note on increment policy (no deduplication in v1).
- **Out of scope**: Deduplication by session/IP, view-count analytics, or showing the count to anonymous users.

## Affected code and docs

- **backend/api**: `Post` entity (+`ViewCount`), new migration, `PostDto` (+`view_count`), `PostsController.GetBySlug` (increment), `ToDto` (map ViewCount).
- **backend/bff**: When returning post(s) to the client, include `view_count` only if the request is authenticated; strip or omit for anonymous.
- **frontend**: `Post` type (+`view_count?: number`), author-area card (subtitle line), `PostPage` (metadata line with icon); optional tooltip/label "visualizações".

## Dependencies and risks

- **Low risk**: Additive feature; anonymous behaviour unchanged. View count is a simple integer increment per public read (no deduplication in this change).
- **Dependency**: Auth (JWT) and existing post-reading and author-area flows.

## Success criteria

- Logged-in users see view count in the author area next to Publicado/Rascunho and on the article page on the author/date line with an icon.
- Anonymous users do not receive or see view count.
- `openspec validate add-post-view-count-for-logged-in-users --strict` passes.
