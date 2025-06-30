/*
  # Fix Token Allocation for New Users

  1. Problem
    - The user_tokens table already exists with policies
    - Need to update the default token balance from 50 to 15
    - Need to ensure new users get tokens automatically

  2. Solution
    - Update the default balance in the user_tokens table
    - Add a trigger to create tokens for new users
    - Avoid recreating existing policies
*/

-- Update default balance for user_tokens table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_tokens' AND column_name = 'balance'
  ) THEN
    -- Update the default value for the balance column
    ALTER TABLE user_tokens 
    ALTER COLUMN balance SET DEFAULT 15;
  END IF;
END $$;

-- Add default tokens for existing users who don't have tokens yet
INSERT INTO user_tokens (user_id, balance)
SELECT id, 15
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_tokens)
ON CONFLICT (user_id) DO NOTHING;

-- Create a function to automatically add tokens for new users
CREATE OR REPLACE FUNCTION add_tokens_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_tokens (user_id, balance)
  VALUES (NEW.id, 15)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'add_tokens_for_new_user_trigger'
  ) THEN
    CREATE TRIGGER add_tokens_for_new_user_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION add_tokens_for_new_user();
  END IF;
END $$;