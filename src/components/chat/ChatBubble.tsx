import React from 'react';
import { VoiceChat } from './VoiceChat';

interface ChatBubbleProps {
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ className = '' }) => {
  return <VoiceChat />;
};