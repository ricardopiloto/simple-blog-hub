-- Manual migration: add StoryType to Posts (tipo de história: Velho Mundo / Idade das Trevas).
-- Equivalent to EF Core migration AddStoryTypeToPost.
-- Run once. If the column already exists (e.g. EF Core migration was applied), SQLite will error; skip or ignore.
-- Example: sqlite3 blog.db < backend/api/Migrations/Scripts/add_story_type_to_posts.sql

ALTER TABLE Posts ADD COLUMN StoryType TEXT NOT NULL DEFAULT 'velho_mundo';
