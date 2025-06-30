import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Trash, 
  Clock, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { elevenlabsService } from '../../lib/elevenlabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface Conversation {
  id: string;
  user_id: string;
  messages: any[];
  created_at: string;
  updated_at: string;
}

interface ConversationHistoryProps {
  onSelectConversation: (conversation: Conversation) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onSelectConversation,
  className = '',
  style = {}
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await elevenlabsService.getUserConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      showToast('error', 'Failed to load conversation history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await elevenlabsService.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      showToast('success', 'Conversation deleted');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      showToast('error', 'Failed to delete conversation');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation.id);
    onSelectConversation(conversation);
  };

  const getConversationPreview = (conversation: Conversation): string => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'Empty conversation';
    }
    
    // Get the last user message, or the first message if no user messages
    const lastUserMessage = [...conversation.messages]
      .reverse()
      .find(msg => msg.role === 'user');
    
    return lastUserMessage 
      ? lastUserMessage.content.substring(0, 40) + (lastUserMessage.content.length > 40 ? '...' : '')
      : conversation.messages[0].content.substring(0, 40) + (conversation.messages[0].content.length > 40 ? '...' : '');
  };

  const filteredConversations = conversations.filter(conversation => {
    // Search in all messages
    return conversation.messages.some(message => 
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <Card className={`p-6 ${className}`} style={{ height: '400px', ...style }}>
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`} style={{ height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column', ...style }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Conversation History</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadConversations}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h4>
            <p className="text-gray-500">
              Your conversations with the AI assistant will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedConversation === conversation.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">
                      Conversation {new Date(conversation.created_at).toLocaleDateString()}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate max-w-[80%]">
                    {getConversationPreview(conversation)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{new Date(conversation.updated_at).toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleSelectConversation(conversation)}
                    className="text-xs text-blue-600 flex items-center"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};