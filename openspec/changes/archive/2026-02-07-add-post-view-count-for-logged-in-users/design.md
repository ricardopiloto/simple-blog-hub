# Design: Post view count for logged-in users

## Context

Only **logged-in users** (autores) may see how many times a post has been viewed. The count is shown in two places: (1) in the **author area** next to the "Publicado" / "Rascunho" indicator, and (2) on the **article page** on the same line as the author and publication date, with an icon.

## Storage and increment

- **API**: Add a `ViewCount` column (integer, default 0) to the `Post` entity. Persist in SQLite via a new EF Core migration.
- **Increment**: When a post is read via the **public** endpoint (GET /api/posts/{slug}), increment that post’s `ViewCount` once per request. No deduplication (e.g. by session) in this version; refinements (e.g. cap per IP/session) can be added later.

## When to expose view count

- **API**: The API always has access to `ViewCount` and can include it in `PostDto` when building responses. To enforce “only logged-in users see it”, the API will only add `view_count` to the DTO when the request is **authenticated** (e.g. call has `X-Author-Id` or a dedicated “include view count” path used by the BFF only for authenticated calls). Simpler alternative: API always includes `view_count` in every post response; **BFF** only forwards `view_count` to the client when the incoming request has a valid JWT. That way the API stays simple and the BFF enforces visibility.
- **Chosen approach**: API stores and returns `view_count` in post responses. BFF, when proxying to the client, **includes** `view_count` only when the request is **authenticated** (Bearer token present and valid). For unauthenticated public GET post-by-slug, BFF strips or omits `view_count` from the response. For author-area (always authenticated), BFF includes `view_count`. For GET /bff/posts/:slug with auth, BFF includes `view_count`.
- **Frontend**: Renders view count only when the payload contains `view_count` (i.e. when the user is logged in and the BFF included it). No extra auth check needed for display.

## UI placement

- **Author area** (list of posts): In the card subtitle line that already shows "Publicado" or "Rascunho", add the view count **next to** that indicator (e.g. "· Publicado · 42 visualizações" or with a small icon). Always shown in author area because the user is always logged in there.
- **Article page** (`/post/:slug`): On the **same line** as the author name and publication date (the `flex` row with avatar, author, bullet, date), add the view count with an **icon** (e.g. eye icon from Lucide) so it sits inline with author and date. Shown only when the response includes `view_count` (logged-in user).

## BFF changes

- **GET /bff/posts/author-area**: Response already comes from an authenticated context; include `view_count` for each post (BFF calls API and maps through `view_count`).
- **GET /bff/posts/:slug** (public and authenticated): When the request carries a valid JWT, BFF requests the post from the API (which returns `view_count`) and forwards `view_count` to the client. When the request is unauthenticated, BFF either calls an API endpoint that does not return view count, or strips `view_count` from the response before sending to the client. Easiest: BFF always calls the same API endpoint; API returns `view_count` in the DTO; BFF omits `view_count` in the JSON response to the client when the client is not authenticated.

## Summary

| Layer   | Change |
|--------|--------|
| API     | Add `ViewCount` to `Post`; migration; increment on GET by slug; add `view_count` to `PostDto`; return in all post responses. |
| BFF     | When forwarding post(s) to client, include `view_count` only if the request is authenticated; otherwise omit it. |
| Frontend| Author area: show view count next to Publicado/Rascunho. Article page: show view count with icon on the author/date line when `view_count` is present. |
