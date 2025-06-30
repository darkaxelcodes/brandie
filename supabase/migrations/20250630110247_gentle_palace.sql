/*
  # Fix Industry Suggestions Policy

  1. Problem
    - Need to add a policy to allow authenticated users to insert industry suggestions
    - Need to avoid error if policy already exists

  2. Solution
    - Use a DO block to check if the policy exists before creating it
    - Only create the policy if it doesn't already exist
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