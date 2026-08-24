-- Add sort_order column to categories table
ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Initialize existing categories with an incremental sort order
WITH numbered AS (
  SELECT id, row_number() OVER (ORDER BY name ASC) as rn
  FROM categories
)
UPDATE categories
SET sort_order = numbered.rn
FROM numbered
WHERE categories.id = numbered.id;
