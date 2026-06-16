-- Add Cloudflare image model column to Authors (configurable Workers AI model per author).
-- Run once against blog.db if EF migration was not applied automatically.
-- Safe to ignore "duplicate column" errors if the column already exists.

ALTER TABLE Authors ADD COLUMN CloudflareImageModel TEXT NULL;
