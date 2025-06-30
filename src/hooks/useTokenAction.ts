import { useState } from 'react';
import { useTokens } from '../contexts/TokenContext';
import { useToast } from '../contexts/ToastContext';

export const useTokenAction = () => {
  const { useToken } = useTokens();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: string;
    description: string;
    callback: () => Promise<void>;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTokenAction = async (
    actionType: string,
    description: string,
    callback: () => Promise<void>
  ) => {
    setCurrentAction({
      type: actionType,
      description,
      callback
    });
    setIsModalOpen(true);
  };

  const confirmTokenAction = async () => {
    if (!currentAction) return;
    
    setIsProcessing(true);
    try {
      // First use the token
      const success = await useToken(currentAction.type, currentAction.description);
      
      if (success) {
        // If token usage was successful, execute the callback
        await currentAction.callback();
        showToast('success', 'Action completed successfully');
      } else {
        // Token usage failed
        showToast('error', 'Failed to use token for this action');
      }
    } catch (error) {
      console.error('Error executing token action:', error);
      showToast('error', 'An error occurred while performing this action');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  return {
    executeTokenAction,
    confirmTokenAction,
    isModalOpen,
    setIsModalOpen,
    currentAction,
    isProcessing
  };
};