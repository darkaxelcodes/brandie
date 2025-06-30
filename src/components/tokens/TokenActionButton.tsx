import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTokens } from '../../contexts/TokenContext';
import { TokenUsageModal } from './TokenUsageModal';

interface TokenActionButtonProps {
  actionType: string;
  description: string;
  onAction: () => Promise<void>;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const TokenActionButton: React.FC<TokenActionButtonProps> = ({
  actionType,
  description,
  onAction,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false
}) => {
  const { tokenBalance } = useTokens();
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      await onAction();
    } catch (error) {
      console.error('Error during token action:', error);
    } finally {
      setProcessing(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled || loading || processing || tokenBalance <= 0}
        className={`relative ${className}`}
      >
        {children}
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          1
        </div>
      </Button>

      <TokenUsageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        actionType={actionType}
        description={description}
        onConfirm={handleConfirm}
      />
    </>
  );
};