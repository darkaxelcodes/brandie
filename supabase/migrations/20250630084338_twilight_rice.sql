-- Function to use a token and record the transaction
CREATE OR REPLACE FUNCTION use_token(
  p_user_id UUID,
  p_action_type TEXT,
  p_description TEXT DEFAULT NULL
) 
RETURNS TABLE(user_id UUID, balance INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Check if user has tokens
  SELECT balance INTO v_current_balance
  FROM user_tokens
  WHERE user_id = p_user_id;
  
  IF v_current_balance IS NULL THEN
    -- Create a new record if it doesn't exist
    INSERT INTO user_tokens (user_id, balance)
    VALUES (p_user_id, 49) -- Start with 50 and deduct 1
    RETURNING balance INTO v_new_balance;
    
  ELSIF v_current_balance < 1 THEN
    RAISE EXCEPTION 'User has insufficient tokens';
    
  ELSE
    -- Deduct token and update balance
    UPDATE user_tokens
    SET balance = balance - 1
    WHERE user_id = p_user_id
    RETURNING balance INTO v_new_balance;
  END IF;
  
  -- Record the transaction
  INSERT INTO token_transactions (
    user_id,
    amount,
    action_type,
    description
  ) VALUES (
    p_user_id,
    -1,
    p_action_type,
    COALESCE(p_description, p_action_type)
  );
  
  -- Return updated user_id and balance
  RETURN QUERY SELECT p_user_id, v_new_balance;
END;
$$;