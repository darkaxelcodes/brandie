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
      // First execute the callback
      await currentAction.callback();

      // Only consume the token if the action was successful
      const success = await useToken(currentAction.type, currentAction.description);

      if (success) {
        showToast('success', 'Action completed successfully');
      } else {
        // Token usage failed (shouldn't happen normally, but handle it)
        showToast('warning', 'Action completed but failed to record token usage');
      }
    } catch (error) {
      console.error('Error executing token action:', error);
      showToast('error', 'Action failed - no tokens were consumed');
      // Token is NOT consumed when action fails
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