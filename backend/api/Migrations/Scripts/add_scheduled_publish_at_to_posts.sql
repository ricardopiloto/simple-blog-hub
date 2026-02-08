-- Manual migration: add ScheduledPublishAt to Posts (for upgrades from a version without scheduled publish).
-- Equivalent to EF Core migration AddScheduledPublishAtToPost.
-- Run once. If the column already exists (e.g. EF Core migration was applied), SQLite will error; skip or ignore.
-- Example: sqlite3 /path/to/blog.db < backend/api/Migrations/Scripts/add_scheduled_publish_at_to_posts.sql

ALTER TABLE Posts ADD COLUMN ScheduledPublishAt TEXT;
