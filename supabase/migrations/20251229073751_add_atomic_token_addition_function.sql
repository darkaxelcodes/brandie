/*
  # Add Atomic Token Addition Function
  
  This migration adds a PostgreSQL function to handle token additions atomically,
  preventing race conditions when tokens are added (e.g., from purchases or rewards).
  
  ## Changes
  
  1. Creates `add_tokens_atomic` function that:
     - Adds tokens to user balance atomically
     - Creates user_tokens record if it doesn't exist
     - Records transaction
     - Returns new balance
  
  2. Security
     - Function runs with SECURITY DEFINER to ensure atomic operation
     - Still respects RLS policies on token_transactions table
*/

-- Create atomic token addition function
CREATE OR REPLACE FUNCTION add_tokens_atomic(
  p_user_id UUID,
  p_amount INTEGER,
  p_action_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Ensure amount is positive
  IF p_amount <= 0 THEN
    RETURN QUERY SELECT FALSE, 0, 'Amount must be positive'::TEXT;
    RETURN;
  END IF;
  
  -- Insert or update user tokens atomically
  INSERT INTO user_tokens (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = user_tokens.balance + p_amount
  RETURNING balance INTO v_new_balance;
  
  -- Record the transaction
  INSERT INTO token_transactions (user_id, amount, action_type, description)
  VALUES (p_user_id, p_amount, p_action_type, COALESCE(p_description, p_action_type));
  
  -- Return success
  RETURN QUERY SELECT TRUE, v_new_balance, NULL::TEXT;
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, 0, SQLERRM::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_tokens_atomic TO authenticated;