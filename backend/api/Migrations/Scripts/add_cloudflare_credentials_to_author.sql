-- Add Cloudflare credential columns to Authors (Geração de Imagem).
-- Run once from backend/api: sqlite3 blog.db < Migrations/Scripts/add_cloudflare_credentials_to_author.sql
-- Or from repo root: sqlite3 backend/api/blog.db < backend/api/Migrations/Scripts/add_cloudflare_credentials_to_author.sql
-- If a column already exists, SQLite returns an error; safe to ignore on re-run.

ALTER TABLE Authors ADD COLUMN CloudflareAccountId TEXT NULL;
ALTER TABLE Authors ADD COLUMN CloudflareApiTokenEncrypted TEXT NULL;
