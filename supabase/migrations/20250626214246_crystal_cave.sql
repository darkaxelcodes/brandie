/*
  # Add completed_tours column to user_preferences

  1. Changes
    - Add `completed_tours` column to `user_preferences` table
    - Column type: text[] (array of text) to store tour IDs
    - Default value: empty array
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'completed_tours'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN completed_tours text[] DEFAULT '{}';
  END IF;
END $$;