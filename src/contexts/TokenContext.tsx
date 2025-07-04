import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { tokenService } from '../lib/tokenService';

interface TokenContextType {
  tokenBalance: number;
  isLoading: boolean;
  useToken: (actionType: string, description?: string) => Promise<boolean>;
  refreshTokenBalance: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      refreshTokenBalance();
    } else {
      setTokenBalance(0);
      setIsLoading(false);
    }
  }, [user]);

  const refreshTokenBalance = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // First, check if the user has a token record
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (tokenError) {
        // If no record exists, create one with default balance
        if (tokenError.code === 'PGRST116') {
          const { data: newTokenData, error: createError } = await supabase
            .from('user_tokens')
            .insert([{ user_id: user.id, balance: 15 }])
            .select()
            .single();

          if (createError) throw createError;
          setTokenBalance(newTokenData?.balance || 0);
        } else {
          throw tokenError;
        }
      } else {
        setTokenBalance(tokenData?.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      showToast('error', 'Failed to load token balance');
    } finally {
      setIsLoading(false);
    }
  };

  const useToken = async (actionType: string, description?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Use the tokenService to handle token usage
      const success = await tokenService.useToken(user.id, actionType, description);
      
      // Refresh the token balance after usage
      await refreshTokenBalance();
      
      return success;
    } catch (error: any) {
      console.error('Error using token:', error);
      
      if (error.message?.includes('insufficient tokens')) {
        showToast('error', 'Insufficient tokens. Please purchase more tokens to continue.');
      } else {
        showToast('error', 'Failed to use token');
      }
      
      return false;
    }
  };

  return (
    <TokenContext.Provider value={{ tokenBalance, isLoading, useToken, refreshTokenBalance }}>
      {children}
    </TokenContext.Provider>
  );
};