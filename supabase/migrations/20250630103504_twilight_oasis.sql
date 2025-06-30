/*
  # Fix Industry Suggestions Policy

  1. Changes
    - Add policy to allow authenticated users to insert industry suggestions
    - Check if policy exists before creating it to avoid errors
*/

-- Check if policy exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'industry_suggestions' 
    AND policyname = 'Authenticated users can insert industry suggestions'
  ) THEN
    -- Add policy to allow authenticated users to insert industry suggestions
    EXECUTE 'CREATE POLICY "Authenticated users can insert industry suggestions"
      ON industry_suggestions
      FOR INSERT
      TO authenticated
      WITH CHECK (true)';
  END IF;
END $$;