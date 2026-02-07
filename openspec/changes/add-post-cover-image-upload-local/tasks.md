# Tasks: add-post-cover-image-upload-local

## 1. Repository folder and config

- [x] 1.1 Create folder **`frontend/public/images/posts`** in the repository and add a `.gitkeep` (or README) so the directory is versioned. Document in README or project.md that uploaded cover images are stored under `images/posts` and that in production a configurable path may be used (served at `/images/posts`).

- [x] 1.2 Add configuration (e.g. in API or BFF) for the physical path where uploaded cover images are saved (e.g. `Uploads__ImagesPath` or `ContentRoot`-relative). In development it can point to `frontend/public/images/posts`; in production to a directory that the web server serves at `/images/posts`.

## 2. Backend upload endpoint

- [x] 2.1 Implement an authenticated upload endpoint (e.g. POST multipart) in the BFF or API that: accepts an image file; validates content type (e.g. image/jpeg, image/png, image/webp) and size (e.g. max 5 MB); saves the file to the configured `images/posts` directory with a safe unique filename (e.g. GUID + extension); returns the public URL path (e.g. `/images/posts/xyz.jpg`). Enforce authentication (JWT) so only logged-in authors can upload.

## 3. Frontend upload option

- [x] 3.1 In the post edit form (`PostEdit.tsx`), add an option to **upload** an image (e.g. file input or "Enviar imagem" button). On file selection (or submit): call the upload endpoint with the file; on success, set the cover field to the returned path and show a preview. Keep the existing URL text field so the author can still paste a URL. Optionally show both: "URL da imagem de capa" and "Ou envie um ficheiro".

## 4. Production serving (docs)

- [x] 4.1 Document in DEPLOY-DOCKER-CADDY.md (or ATUALIZAR-SERVIDOR-DOCKER-CADDY.md) that if local cover uploads are used, the server must serve the upload directory at `/images/posts` (e.g. Caddyfile `handle /images/*` from the configured upload path, or a volume in Docker). Ensure the upload path is persistent across deploys (e.g. not inside `dist`).

## 5. Spec deltas

- [x] 5.1 Add in `openspec/changes/add-post-cover-image-upload-local/specs/post-cover-display/spec.md` (or post-edit-form) an **ADDED** requirement: the system SHALL allow the author to set the post cover image either by **URL** (existing) or by **uploading an image file**. Uploaded images SHALL be stored locally in a folder **`images/posts`** (in the repo: `frontend/public/images/posts`; at runtime a configurable path served as `/images/posts`). The upload endpoint SHALL require authentication and SHALL validate file type and size. Add at least one scenario: author uploads an image in the post form and the cover is set to the local path and displayed correctly.

- [x] 5.2 If needed, add a short project-docs delta requiring that the deploy documentation describe how to configure and serve the upload directory for cover images.

## 6. Validation

- [x] 6.1 Run `openspec validate add-post-cover-image-upload-local --strict` and resolve any issues.
