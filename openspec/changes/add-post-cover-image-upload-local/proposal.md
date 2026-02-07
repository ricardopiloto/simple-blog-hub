# Proposal: Option to upload post cover image and store locally (frontend/images/posts)

## Summary

Add the option to **upload an image file** for the post cover (in addition to the existing "URL da imagem de capa" field). Uploaded images SHALL be stored **locally on the server** in a dedicated folder. That folder SHALL be **`images/posts`** under the frontend tree: in the repository, create **`frontend/public/images/posts`** (and keep files there); at runtime, the backend (API or BFF) SHALL save uploaded files to a path that is exposed as **`/images/posts/`** by the web server so that the cover_image value can be a local path (e.g. `/images/posts/abc123.jpg`). The author can choose either to paste a URL (current behaviour) or to upload a file; if they upload, the file is saved under `images/posts` and the post's `cover_image` is set to the resulting URL path.

## Goals

- **Dual input for cover**: Keep the existing URL field and add an upload option (e.g. file input or "Enviar imagem"). When the user uploads a file, the system saves it and sets the cover to the local path.
- **Storage location**: All uploaded cover images live under **`images/posts`**: in the repo, the folder is **`frontend/public/images/posts`**; in production (e.g. Docker/Caddy), the backend saves to a configured directory that the web server serves at `/images/posts` (e.g. a sibling of the frontend document root so that deploy does not overwrite uploads).
- **No breaking change**: Existing posts with external URLs continue to work; `cover_image` remains a string (URL or path).

## Scope

- **In scope**: (1) Backend: add an upload endpoint (e.g. POST multipart) that accepts an image file, validates type/size, saves it to the configured `images/posts` directory with a safe filename (e.g. unique id + extension), and returns the public URL path (e.g. `/images/posts/xyz.jpg`). The BFF MAY proxy the upload to the API or handle it and write to disk; the API MAY implement the save and the BFF forwards the request. (2) Configuration: a setting for the physical path where to store uploads (e.g. `Uploads__ImagesPath` or path relative to frontend public root) so that in production it can point to a directory served by Caddy (or the app) as `/images/posts`. (3) Repository: create **`frontend/public/images/posts`** (e.g. with a `.gitkeep`) so the folder exists and is part of the frontend build; document that in production the same path or a separate writable directory must be used and served at `/images/posts`. (4) Frontend: in the post edit form, add an option to upload an image (file input); on submit of the file, call the upload endpoint, then set the cover field to the returned path and optionally show preview. (5) Spec deltas: post-cover-display and/or post-edit-form and project-docs as needed.
- **Out of scope**: Image transformation (resize, crop), multiple images per post, deletion of old file when cover is changed (can be a later improvement).

## Affected code and docs

- **backend/api** or **backend/bff**: New endpoint for image upload; save to disk under `images/posts`; configuration for upload root path.
- **frontend/public/images/posts**: New folder (e.g. `.gitkeep`); in production, uploads may go to a different writable path that is served as `/images/posts`.
- **frontend/src/pages/PostEdit.tsx**: Add upload option (file input), call upload API, set `cover_image` to returned path.
- **DEPLOY / Caddy**: Document that if using local uploads, the server must serve the upload directory (e.g. Caddyfile `handle /images/*` from the upload path) or the app serves it.
- **openspec/changes/add-post-cover-image-upload-local/specs/**: Deltas for post-cover-display (or post-edit-form) and optionally project-docs.

## Dependencies and risks

- **Deploy**: Production must expose the upload directory at `/images/posts` (e.g. Caddy or static middleware). With Docker, a volume or host path can be used for persistence across deploys.
- **Security**: Validate file type (e.g. image only) and size limit; use safe filenames to avoid path traversal.

## Success criteria

- Author can upload an image in the post form; the file is stored under `images/posts` and the post's cover_image is set to the local path (e.g. `/images/posts/xxx.jpg`).
- The folder `frontend/public/images/posts` exists in the repo.
- Spec deltas and `openspec validate add-post-cover-image-upload-local --strict` pass.
