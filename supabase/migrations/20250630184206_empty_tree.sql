-- Create user_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create token_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  action_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_tokens if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_tokens' 
    AND policyname = 'Users can view their own tokens'
  ) THEN
    CREATE POLICY "Users can view their own tokens"
      ON user_tokens
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_tokens' 
    AND policyname = 'Users can update their own tokens'
  ) THEN
    CREATE POLICY "Users can update their own tokens"
      ON user_tokens
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for token_transactions if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'token_transactions' 
    AND policyname = 'Users can view their own token transactions'
  ) THEN
    CREATE POLICY "Users can view their own token transactions"
      ON token_transactions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'token_transactions' 
    AND policyname = 'Users can create their own token transactions'
  ) THEN
    CREATE POLICY "Users can create their own token transactions"
      ON token_transactions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_tokens_updated_at'
  ) THEN
    CREATE TRIGGER update_user_tokens_updated_at
      BEFORE UPDATE ON user_tokens
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create indexes for better performance if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_user_tokens_user_id'
  ) THEN
    CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_token_transactions_user_id'
  ) THEN
    CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_token_transactions_created_at'
  ) THEN
    CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);
  END IF;
END $$;

-- Add default tokens for existing users
INSERT INTO user_tokens (user_id, balance)
SELECT id, 15
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
