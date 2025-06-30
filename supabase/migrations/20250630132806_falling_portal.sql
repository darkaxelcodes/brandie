/*
  # Fix Industry Suggestions Policy

  1. Problem
    - The industry_suggestions table has a policy that allows authenticated users to read
      but not insert new suggestions
    - This is causing errors when trying to save industry analysis data

  2. Solution
    - Drop existing policies
    - Create new policies that allow authenticated users to both read and insert
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read industry suggestions" ON industry_suggestions;
DROP POLICY IF EXISTS "Authenticated users can insert industry suggestions" ON industry_suggestions;

-- Create new policies
CREATE POLICY "Anyone can read industry suggestions"
  ON industry_suggestions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert industry suggestions"
  ON industry_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);