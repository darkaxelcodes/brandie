import React from 'react';
import { Coins } from 'lucide-react';

interface TokenBadgeProps {
  cost: number;
  className?: string;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({ cost, className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Coins className="w-3 h-3" />
      <span>{cost} token{cost !== 1 ? 's' : ''}</span>
    </div>
  );
};