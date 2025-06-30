import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Loader, 
  ChevronDown, 
  ChevronUp,
  Trash,
  Save
} from 'lucide-react';
import { Button } from '../ui/Button';
import { elevenlabsService } from '../../lib/elevenlabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audio_url?: string;
}

interface ChatBotProps {
  initialMessages?: Message[];
  conversationId?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  initialMessages = [],
  conversationId
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(input);
      
      // Generate audio if enabled
      let audioUrl;
      if (audioEnabled) {
        try {
          const audioData = await elevenlabsService.textToSpeech(response);
          audioUrl = elevenlabsService.createAudioUrl(audioData);
          
          // Play audio
          playAudio(audioUrl);
        } catch (error) {
          console.error('Error generating audio:', error);
          showToast('error', 'Failed to generate audio response');
        }
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        audio_url: audioUrl
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation if user is logged in
      if (user) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        
        if (conversationId) {
          await elevenlabsService.updateConversation(conversationId, updatedMessages);
        } else {
          await elevenlabsService.saveConversation(user.id, updatedMessages);
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      showToast('error', 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    // In a real implementation, this would call an API
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response logic
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      return "Hello! I'm your brand assistant. How can I help you today?";
    }
    
    if (userInput.toLowerCase().includes('brand')) {
      return "I can help you with various aspects of your brand, including strategy, visual identity, and voice. What specific area would you like assistance with?";
    }
    
    if (userInput.toLowerCase().includes('logo')) {
      return "Creating a great logo is essential for your brand identity. I recommend using our AI Logo Generator in the Visual Identity section. Would you like me to explain more about what makes a good logo?";
    }
    
    if (userInput.toLowerCase().includes('color')) {
      return "Colors play a crucial role in brand perception. Our AI Color Intelligence tool can help you select the perfect palette based on color psychology and your brand's personality. Would you like to know more about color theory?";
    }
    
    if (userInput.toLowerCase().includes('help')) {
      return "I'm here to help! I can answer questions about branding, guide you through our platform features, or provide advice on your specific brand challenges. Just let me know what you need assistance with.";
    }
    
    return "I understand you're asking about " + userInput + ". While I'm still learning, I can help with various aspects of branding. Could you provide more details about what you're looking for?";
  };

  const playAudio = (url: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    
    // Create and play new audio
    const audio = new Audio(url);
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => {
      setIsSpeaking(false);
      showToast('error', 'Failed to play audio');
    };
    
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
    });
    
    setCurrentAudio(audio);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (currentAudio && isSpeaking) {
      currentAudio.pause();
      currentAudio.src = '';
      setIsSpeaking(false);
    }
  };

  const clearConversation = async () => {
    setMessages([]);
    
    // Delete conversation from database if it exists
    if (conversationId && user) {
      try {
        await elevenlabsService.deleteConversation(conversationId);
        showToast('success', 'Conversation cleared');
      } catch (error) {
        console.error('Error deleting conversation:', error);
        showToast('error', 'Failed to delete conversation');
      }
    }
  };

  const saveConversation = async () => {
    if (!user || messages.length === 0) return;
    
    try {
      if (conversationId) {
        await elevenlabsService.updateConversation(conversationId, messages);
      } else {
        await elevenlabsService.saveConversation(user.id, messages);
      }
      
      showToast('success', 'Conversation saved');
    } catch (error) {
      console.error('Error saving conversation:', error);
      showToast('error', 'Failed to save conversation');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 z-20"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold">Brand Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleAudio}
                  className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                  title={audioEnabled ? 'Disable audio' : 'Enable audio'}
                >
                  {audioEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={clearConversation}
                  className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                  title="Clear conversation"
                >
                  <Trash className="w-5 h-5" />
                </button>
                {user && (
                  <button
                    onClick={saveConversation}
                    className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                    title="Save conversation"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="w-12 h-12 text-blue-200 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How can I help?</h3>
                  <p className="text-gray-500 text-sm">
                    Ask me anything about branding, or how to use the platform.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="prose prose-sm">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      
                      {message.role === 'assistant' && message.audio_url && (
                        <button
                          onClick={() => playAudio(message.audio_url!)}
                          className="mt-2 text-xs flex items-center space-x-1 text-blue-600"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Play audio</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};