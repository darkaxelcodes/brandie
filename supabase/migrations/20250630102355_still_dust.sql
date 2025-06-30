/*
  # Add INSERT policy for industry_suggestions table

  1. Security Changes
    - Add policy to allow authenticated users to insert industry suggestions
    - This enables the industry analysis feature to save data properly

  The industry_suggestions table is used to store AI-generated industry analysis
  and suggestions that can be shared across users, so we allow authenticated
  users to contribute new suggestions.
*/

-- Add policy to allow authenticated users to insert industry suggestions
CREATE POLICY "Authenticated users can insert industry suggestions"
  ON industry_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);