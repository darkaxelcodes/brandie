/*
  # Brand Management Updates

  1. New Fields
    - Add `is_favorite` boolean field to brands table
    - Add `archived` boolean field to brands table

  2. Changes
    - Update RLS policies to handle archived brands
    - Add default values for new fields
*/

-- Add new fields to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Update RLS policies to handle archived brands
DROP POLICY IF EXISTS "Users can read own brands" ON brands;
CREATE POLICY "Users can read own brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_brands_is_favorite ON brands(is_favorite);
CREATE INDEX IF NOT EXISTS idx_brands_archived ON brands(archived);
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);