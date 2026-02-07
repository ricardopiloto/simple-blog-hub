# Tasks: add-post-view-count-for-logged-in-users

## 1. API: model and migration

- [x] 1.1 Add `ViewCount` property (int, default 0) to `Post` in `backend/api/Models/Post.cs`.
- [x] 1.2 Create and apply an EF Core migration that adds the `ViewCount` column to the Posts table (e.g. `AddViewCountToPost`).

## 2. API: DTO and increment

- [x] 2.1 Add `view_count` (snake_case in JSON) to `PostDto` in `backend/api/Models/PostDto.cs`; map from `Post.ViewCount` in `ToDto`.
- [x] 2.2 In `PostsController.GetBySlug`, after loading the post and before returning, increment the post's `ViewCount` and save (e.g. `post.ViewCount++`; `SaveChangesAsync`). Ensure new posts created in `CreatePost` set `ViewCount = 0` (or rely on default).

## 3. BFF: expose view_count only when authenticated

- [x] 3.1 For GET /bff/posts/author-area: ensure the response to the client includes `view_count` for each post (BFF already uses authenticated context; forward `view_count` from API response).
- [x] 3.2 For GET /bff/posts/:slug: when the request has a valid JWT, include `view_count` in the response; when unauthenticated, omit `view_count` from the JSON sent to the client (e.g. strip the field or call a response shape that excludes it).

## 4. Frontend: types and author area

- [x] 4.1 Add optional `view_count?: number` to the `Post` type in `frontend/src/api/types.ts`.
- [x] 4.2 In the author area (e.g. `AreaAutor.tsx`), in the card subtitle line that shows "Publicado" / "Rascunho", display the view count next to that indicator when `post.view_count != null` (e.g. "· Publicado · N visualizações" or with a small icon). Use a neutral label (e.g. "visualizações").

## 5. Frontend: article page

- [x] 5.1 In the article page (`PostPage.tsx`), on the metadata row that shows the author and publication date (same line), add the view count with an icon (e.g. Lucide `Eye`) when `post.view_count != null`. Keep the layout inline (e.g. author · date · icon + count).

## 6. Documentation and validation

- [x] 6.1 Update `openspec/project.md` (or relevant docs) to mention that logged-in users can see post view counts in the author area and on the article page; view count is only exposed when authenticated.
- [x] 6.2 Run `openspec validate add-post-view-count-for-logged-in-users --strict` and resolve any issues.
