/*
  # Add Auth Trigger for User Tokens
  
  1. New Functions
    - Creates a trigger function to automatically add tokens for new users
  
  2. Triggers
    - Adds a trigger on auth.users table to call the function when a new user is created
    
  3. Security
    - Ensures new users automatically get tokens upon signup
*/

-- Create a function to add tokens for new users if it doesn't exist
CREATE OR REPLACE FUNCTION add_tokens_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_tokens (user_id, balance)
  VALUES (NEW.id, 15)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add the trigger to the auth.users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION add_tokens_for_new_user();
  END IF;
END $$;

-- Ensure all existing users have token records
INSERT INTO public.user_tokens (user_id, balance)
SELECT id, 15
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_tokens)
ON CONFLICT (user_id) DO NOTHING;