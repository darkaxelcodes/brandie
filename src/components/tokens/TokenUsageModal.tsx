import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, AlertCircle, Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTokens } from '../../contexts/TokenContext';

interface TokenUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  description: string;
  onConfirm: () => Promise<void>;
}

export const TokenUsageModal: React.FC<TokenUsageModalProps> = ({
  isOpen,
  onClose,
  actionType,
  description,
  onConfirm
}) => {
  const { tokenBalance, isLoading } = useTokens();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (tokenBalance <= 0) {
      setError('You don\'t have enough tokens. Please purchase more tokens to continue.');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      await onConfirm();
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error during token usage:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="AI Token Usage"
    >
      <div className="space-y-4">
        {!success ? (
          <>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full">
                <Coins className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Use 1 AI Token</h3>
                <p className="text-sm text-gray-600">
                  This action will use 1 token from your balance
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Current Balance:</span>
                <span className="font-semibold text-gray-900">
                  {isLoading ? 'Loading...' : `${tokenBalance} tokens`}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">After this action:</span>
                <span className="font-semibold text-gray-900">
                  {isLoading ? 'Loading...' : `${tokenBalance - 1} tokens`}
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">Action Details</h4>
              <p className="text-blue-800 text-sm">{description}</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {tokenBalance <= 3 && !error && (
              <div className="bg-amber-50 text-amber-800 p-4 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Your token balance is running low. Consider purchasing more tokens soon.</p>
              </div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1"
                loading={processing}
                disabled={isLoading || tokenBalance <= 0}
              >
                Confirm
              </Button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">
              1 token has been used for this action.
            </p>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};