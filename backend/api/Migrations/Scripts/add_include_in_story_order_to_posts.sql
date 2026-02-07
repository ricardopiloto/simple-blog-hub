-- Add IncludeInStoryOrder column to Posts (default 1 = true).
-- Equivalent to EF Core migration AddIncludeInStoryOrderToPost.
-- Run once. If the column already exists, SQLite will error; ignore and do not re-run.

ALTER TABLE Posts ADD COLUMN IncludeInStoryOrder INTEGER NOT NULL DEFAULT 1;
