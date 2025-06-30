import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  ArrowLeft, 
  Bot, 
  Settings, 
  Info,
  HelpCircle,
  X,
  Send,
  Loader,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConversationHistory } from '../components/chat/ConversationHistory';
import { useAuth } from '../contexts/AuthContext';
import { elevenlabsService } from '../lib/elevenlabs';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { TourButton } from '../components/ui/TourButton';
import { useToast } from '../contexts/ToastContext';

interface Conversation {
  id: string;
  user_id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audio_url?: string;
}

const ChatAssistant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check for initial message from chat bubble
  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSendMessage(location.state.initialMessage);
      // Clear the state to prevent resubmission on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
      stopRecording();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(messageText);
      
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
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        audio_url: audioUrl
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation if user is logged in
      if (user) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        
        if (selectedConversation) {
          await elevenlabsService.updateConversation(selectedConversation.id, updatedMessages);
        } else {
          const conversationId = await elevenlabsService.saveConversation(user.id, updatedMessages);
          // In a real app, we would update the selectedConversation here
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      showToast('error', 'Failed to get AI response');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
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
    audio.onerror = () => setIsSpeaking(false);
    
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // In a real implementation, you would send this to a speech-to-text API
        // For now, we'll simulate it with a timeout
        setIsLoading(true);
        setTimeout(() => {
          // Simulate transcription
          const transcription = "This is a simulated transcription of voice input.";
          setInput(transcription);
          setIsLoading(false);
        }, 1000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('error', 'Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 chat-header"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-600" />
              AI Assistant
            </h1>
            <p className="text-gray-600 mt-1">
              Get help with your branding questions and tasks
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TourButton tourId="chat" />
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 conversation-history"
        >
          <ConversationHistory onSelectConversation={handleSelectConversation} />
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 chat-interface"
        >
          <Card className="p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Brand Assistant</h2>
                  <p className="text-sm text-gray-500">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  className="text-gray-500"
                  title={audioEnabled ? "Disable voice" : "Enable voice"}
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                {selectedConversation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(null);
                      setMessages([]);
                    }}
                    className="text-gray-500"
                  >
                    New Chat
                  </Button>
                )}
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
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
                          <Volume2 className="w-3 h-3 mr-1" />
                          <span>Play audio</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message or click the mic to speak..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleRecording}
                  className={isRecording ? "bg-red-100 text-red-600" : ""}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assistant Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Voice Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="default">Default Voice</option>
                      <option value="male">Male Voice</option>
                      <option value="female">Female Voice</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speech Rate
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Behavior Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Auto-play voice responses
                    </label>
                    <button
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${audioEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${audioEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Save conversation history
                    </label>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Help Panel */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl flex-shrink-0">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">About the AI Assistant</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-gray-700 mb-4">
                  Our AI assistant is designed to help you with all aspects of brand building. You can ask questions about branding concepts, get help with specific features of our platform, or request guidance on your brand strategy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Example Questions</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• "What makes a good brand strategy?"</li>
                      <li>• "How do I create a color palette?"</li>
                      <li>• "What's the difference between a logo and a brand mark?"</li>
                      <li>• "Can you explain brand archetypes?"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Voice responses with Eleven Labs</li>
                      <li>• Voice input for hands-free interaction</li>
                      <li>• Conversation history</li>
                      <li>• Brand-specific knowledge</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ChatAssistant;