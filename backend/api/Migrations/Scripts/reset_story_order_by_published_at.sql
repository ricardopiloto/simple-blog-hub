-- Reset StoryOrder of all posts based on PublishedAt (first published = 1, then 2, 3, ...).
-- Drafts (PublishedAt IS NULL) are ordered after published posts, by CreatedAt.
-- Run from repo root: sqlite3 backend/api/blog.db < backend/api/Migrations/Scripts/reset_story_order_by_published_at.sql
-- Or from backend/api: sqlite3 blog.db < Migrations/Scripts/reset_story_order_by_published_at.sql

WITH Ordered AS (
  SELECT
    Id,
    ROW_NUMBER() OVER (
      ORDER BY
        CASE WHEN PublishedAt IS NULL THEN 1 ELSE 0 END,  -- published first
        PublishedAt ASC,
        CreatedAt ASC,
        Id
    ) AS NewOrder
  FROM Posts
)
UPDATE Posts
SET StoryOrder = (SELECT Ordered.NewOrder FROM Ordered WHERE Ordered.Id = Posts.Id);
