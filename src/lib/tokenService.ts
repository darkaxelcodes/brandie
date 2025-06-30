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
        .single();

      if (error) {
        // If no record exists, create one with default balance
        if (error.code === 'PGRST116') {
          const { data: newData, error: createError } = await supabase
            .from('user_tokens')
            .insert([{ user_id: userId, balance: 15 }])
            .select()
            .single();

          if (createError) throw createError;
          return newData?.balance || 0;
        }
        throw error;
      }

      return data?.balance || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  },

  // Use a token for an AI action
  async useToken(userId: string, actionType: string, description?: string): Promise<boolean> {
    try {
      // First, get current balance
      const currentBalance = await this.getTokenBalance(userId);
      
      // Check if user has enough tokens
      if (currentBalance < 1) {
        throw new Error('User has insufficient tokens');
      }
      
      // Update balance
      const { data: updateData, error: updateError } = await supabase
        .from('user_tokens')
        .update({ balance: currentBalance - 1 })
        .eq('user_id', userId)
        .select();
        
      if (updateError) throw updateError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('token_transactions')
        .insert([{
          user_id: userId,
          amount: -1,
          action_type: actionType,
          description: description || actionType
        }]);
        
      if (transactionError) throw transactionError;
      
      return true;
    } catch (error) {
      console.error('Error using token:', error);
      throw error;
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

  // Add tokens to user's balance (e.g., after purchase)
  async addTokens(userId: string, amount: number, description: string): Promise<number> {
    try {
      // First, get current balance
      const currentBalance = await this.getTokenBalance(userId);
      
      // Update the user's balance
      const { data: updateData, error: updateError } = await supabase
        .from('user_tokens')
        .update({ balance: currentBalance + amount })
        .eq('user_id', userId)
        .select();

      if (updateError) throw updateError;
      
      // Record the transaction
      const { error: transactionError } = await supabase
        .from('token_transactions')
        .insert([{
          user_id: userId,
          amount: amount,
          action_type: 'purchase',
          description
        }]);
        
      if (transactionError) throw transactionError;

      return (updateData && updateData[0]?.balance) || (currentBalance + amount);
    } catch (error) {
      console.error('Error adding tokens:', error);
      throw error;
    }
  }
};