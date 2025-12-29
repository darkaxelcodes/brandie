import { supabase } from './supabase';

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  action_type: string;
  description?: string;
  created_at: string;
}

export const tokenService = {
  // Get user's token balance
  async getTokenBalance(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // If no record exists, create one with default balance
        const { data: newData, error: createError } = await supabase
          .from('user_tokens')
          .insert([{ user_id: userId, balance: 15 }])
          .select()
          .maybeSingle();

        if (createError) throw createError;
        return newData?.balance || 0;
      }

      return data?.balance || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  },

  // Use a token for an AI action (atomic operation to prevent race conditions)
  async useToken(userId: string, actionType: string, description?: string): Promise<boolean> {
    try {
      // Use atomic database function to prevent race conditions
      const { data, error } = await supabase.rpc('use_token_atomic', {
        p_user_id: userId,
        p_action_type: actionType,
        p_description: description || actionType
      });

      if (error) {
        console.error('Error calling use_token_atomic:', error);
        return false;
      }

      // Check if the operation was successful
      if (!data || data.length === 0) {
        console.error('No data returned from use_token_atomic');
        return false;
      }

      const result = data[0];
      if (!result.success) {
        console.error('Token usage failed:', result.error_message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error using token:', error);
      return false;
    }
  },

  // Get token transaction history
  async getTransactionHistory(userId: string): Promise<TokenTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  },

  // Add tokens to user's balance (e.g., after purchase) - atomic operation
  async addTokens(userId: string, amount: number, description: string): Promise<number> {
    try {
      // Use atomic database function to prevent race conditions
      const { data, error } = await supabase.rpc('add_tokens_atomic', {
        p_user_id: userId,
        p_amount: amount,
        p_action_type: 'purchase',
        p_description: description
      });

      if (error) {
        console.error('Error calling add_tokens_atomic:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from add_tokens_atomic');
      }

      const result = data[0];
      if (!result.success) {
        throw new Error(result.error_message || 'Failed to add tokens');
      }

      return result.new_balance;
    } catch (error) {
      console.error('Error adding tokens:', error);
      throw error;
    }
  }
};