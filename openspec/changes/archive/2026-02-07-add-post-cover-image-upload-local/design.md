# Design: Post cover image upload and local storage

## Context

Today the post cover is set only via a **URL** (text field). The user requested an option to **upload an image** and have it saved **locally on the server** in a folder under the frontend: **`/images/posts`**, with files kept there.

## Options

1. **BFF receives upload and writes to disk**  
   BFF has access to a configured path (e.g. same server as the frontend static root or a dedicated upload dir). BFF saves the file and returns the URL path. No change to the internal API for posts; the API continues to store only the `cover_image` string.

2. **API receives upload and writes to disk**  
   API exposes POST /api/uploads/cover (or similar); saves to a configured path. The path must be somewhere the frontend (or web server) can serve—e.g. a shared volume or a directory that Caddy serves. BFF proxies the multipart request to the API.

3. **Frontend writes directly to a backend-served path**  
   Less common: a dedicated upload service or the same app serves a writable directory. Same end result: file ends up under a path served as `/images/posts/`.

**Choice**: Prefer **BFF or API** handling the upload and writing to a **configured directory** that is served as `/images/posts`. The repo contains **`frontend/public/images/posts`** so that in dev (Vite) the folder exists and the app can serve from it if the backend writes there; in production, configuration points to a path that the web server (Caddy) serves at `/images/posts` so that deploy does not overwrite uploads (e.g. a path configurável no host, como uma pasta irmã de DOCUMENT_ROOT: `images/posts`).

## Storage path

- **Repository**: `frontend/public/images/posts/` (create folder + `.gitkeep`). This is the canonical "images/posts" location for the frontend; in dev, if the backend writes here, Vite serves it at `/images/posts/`.
- **Production (e.g. Docker/Caddy)**: Use a **configurable** path (e.g. `Uploads__ImagesPath` pointing to a directory on the host that Caddy serves at `/images/posts`) so that (1) uploads are not inside `dist` (survive deploy), (2) Caddy can serve that path at `handle /images/*` or similar. The `cover_image` value stored in the DB is the **public path** (e.g. `/images/posts/unique-name.jpg`), so the frontend and readers load it from the same origin.

## Security

- Accept only image types (e.g. image/jpeg, image/png, image/webp) and a reasonable max size (e.g. 5 MB).
- Generate safe filenames (e.g. GUID + extension from content type) to avoid path traversal and overwrites.
- Upload endpoint MUST require authentication (JWT); only authenticated authors can upload.

## Flow

1. Author opens post edit, chooses "Enviar imagem" (or similar) and selects a file.
2. Frontend sends multipart/form-data to BFF (e.g. POST /bff/uploads/cover) with the file and optional post context.
3. BFF (or API) validates type/size, saves to the configured `images/posts` directory with a unique name, returns the public path (e.g. `{ "url": "/images/posts/abc.jpg" }`).
4. Frontend sets the cover field to that path and shows preview; on form submit, the post is saved with `cover_image: "/images/posts/abc.jpg"`.
5. Existing behaviour for pasting a URL remains unchanged.
