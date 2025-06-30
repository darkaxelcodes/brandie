-- Add completed_tours column to user_preferences table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_preferences' AND column_name = 'completed_tours'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN completed_tours text[] DEFAULT '{}';
  END IF;
END $$;