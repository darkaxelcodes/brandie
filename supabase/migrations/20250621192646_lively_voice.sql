/*
  # Fix brands table RLS policy

  1. Security Updates
    - Fix RLS policy for brands table to use auth.uid() correctly
    - Ensure proper user isolation

  2. Changes
    - Update brands table RLS policies to use correct Supabase auth function
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own brands" ON brands;
DROP POLICY IF EXISTS "Users can delete own brands" ON brands;
DROP POLICY IF EXISTS "Users can read own brands" ON brands;
DROP POLICY IF EXISTS "Users can update own brands" ON brands;

-- Create corrected policies using auth.uid()
CREATE POLICY "Users can create own brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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