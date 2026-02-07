-- Manual migration: add ViewCount to Posts (for upgrades from a version without post view count).
-- Run once. If the column already exists (e.g. EF Core migration was applied), SQLite will error; skip or ignore.
-- Example: sqlite3 /path/to/blog.db < backend/api/Migrations/Scripts/add_view_count_to_posts.sql

ALTER TABLE Posts ADD COLUMN ViewCount INTEGER NOT NULL DEFAULT 0;
