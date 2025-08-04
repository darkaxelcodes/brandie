import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, RefreshCw } from 'lucide-react';
import { useTokens } from '../../contexts/TokenContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';

interface TokenDisplayProps {
  collapsed?: boolean;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ collapsed = false }) => {
  const { tokenBalance, isLoading, refreshTokenBalance } = useTokens();
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    await refreshTokenBalance();
  };

  const handleBuyTokens = () => {
    navigate('/tokens/purchase');
  };

  if (collapsed) {
    return (
      <div 
        className="relative flex justify-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-accent-gold-500 to-accent-gold-600 rounded-xl shadow-luxury">
          <Coins className="w-6 h-6 text-white" />
        </div>
        
        {/* Token count badge */}
        <div className="absolute -top-1 -right-1 bg-gradient-luxury text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-luxury">
          {isLoading ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            tokenBalance
          )}
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 text-sm py-2 px-3 rounded-lg shadow-luxury-lg z-50 whitespace-nowrap">
            {tokenBalance} AI Tokens
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-accent-gold-500 to-accent-gold-600 rounded-xl shadow-luxury">
          <Coins className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">AI Tokens</p>
          <p className="text-lg font-semibold text-secondary-900 dark:text-white">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin inline" />
            ) : (
              tokenBalance
            )}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBuyTokens}
        className="flex items-center space-x-1"
      >
        <Plus className="w-3 h-3" />
        <span>Buy</span>
      </Button>
    </div>
  );
};