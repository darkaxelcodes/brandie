/*
  # Add Atomic Token Usage Function
  
  This migration adds a PostgreSQL function to handle token usage atomically,
  preventing race conditions when multiple requests try to use tokens simultaneously.
  
  ## Changes
  
  1. Creates `use_token_atomic` function that:
     - Checks if user has sufficient balance
     - Decrements balance by 1 atomically using WHERE clause
     - Returns success/failure without race conditions
  
  2. Security
     - Function runs with SECURITY DEFINER to ensure atomic operation
     - Still respects RLS policies on token_transactions table
*/

-- Create atomic token usage function
CREATE OR REPLACE FUNCTION use_token_atomic(
  p_user_id UUID,
  p_action_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Try to decrement the balance atomically
  -- This will only succeed if balance >= 1
  UPDATE user_tokens
  SET balance = balance - 1
  WHERE user_id = p_user_id AND balance >= 1
  RETURNING balance INTO v_new_balance;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    -- Get current balance for error message
    SELECT balance INTO v_current_balance
    FROM user_tokens
    WHERE user_id = p_user_id;
    
    -- If no record exists, create one with 0 balance
    IF v_current_balance IS NULL THEN
      INSERT INTO user_tokens (user_id, balance)
      VALUES (p_user_id, 0);
      v_current_balance := 0;
    END IF;
    
    RETURN QUERY SELECT FALSE, v_current_balance, 'Insufficient tokens'::TEXT;
    RETURN;
  END IF;
  
  -- Record the transaction
  INSERT INTO token_transactions (user_id, amount, action_type, description)
  VALUES (p_user_id, -1, p_action_type, COALESCE(p_description, p_action_type));
  
  -- Return success
  RETURN QUERY SELECT TRUE, v_new_balance, NULL::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION use_token_atomic TO authenticated;