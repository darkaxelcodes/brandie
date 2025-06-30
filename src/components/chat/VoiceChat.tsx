import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Loader, 
  ChevronDown, 
  ChevronUp,
  List,
  Pause,
  Play
} from 'lucide-react';
import { Button } from '../ui/Button';
import { elevenlabsService } from '../../lib/elevenlabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audio_url?: string;
}

interface VoiceChatProps {
  initialMessages?: Message[];
  conversationId?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ 
  initialMessages = [],
  conversationId
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

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

  // Ensure transcript scrolls to bottom when new messages are added
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, isTranscriptOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsTranscriptOpen(false);
    }
  };

  const toggleTranscript = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTranscriptOpen(!isTranscriptOpen);
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
        
        // In a real implementation with Eleven Labs, we would:
        // 1. Send the audio to Eleven Labs Speech-to-Text API
        // 2. Get the transcription back
        // 3. Use the transcription for the AI response
        
        setIsProcessing(true);
        setTranscribedText("Processing your message...");
        
        try {
          // Simulate sending to Eleven Labs API
          // In a real implementation, replace this with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simulate a transcription result
          // This would be replaced with the actual transcription from Eleven Labs
          const transcription = "How can you help me with my brand strategy?";
          
          setTranscribedText(transcription);
          handleSendMessage(transcription);
        } catch (error) {
          console.error('Error processing speech:', error);
          showToast('error', 'Failed to process speech');
          setIsProcessing(false);
          setTranscribedText("");
        }
      };
      
      mediaRecorder.start();
      setIsListening(true);
      setCurrentMessage("I'm listening...");
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('error', 'Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
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
    setIsProcessing(true);
    setCurrentMessage("Thinking...");
    
    try {
      // Get AI response
      const response = await getAIResponse(messageText);
      setCurrentMessage(response);
      
      // Generate audio if enabled
      let audioUrl;
      if (audioEnabled) {
        try {
          // Use Eleven Labs for text-to-speech
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
      setIsProcessing(false);
      setTranscribedText("");
    }
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    // In a real implementation, this would call an API
    // For now, we'll simulate a response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAudioEnabled(!audioEnabled);
    
    if (currentAudio && isSpeaking) {
      currentAudio.pause();
      currentAudio.src = '';
      setIsSpeaking(false);
    }
  };

  const pauseResumeAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAudio) return;
    
    if (isSpeaking) {
      currentAudio.pause();
      setIsSpeaking(false);
    } else {
      currentAudio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsSpeaking(true);
    }
  };

  return (
    <>
      {/* Voice Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Voice Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-20 flex">
            {/* Transcript Panel - Left Position */}
            <AnimatePresence>
              {isTranscriptOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '280px' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mr-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 bg-blue-600 text-white">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm flex items-center space-x-1">
                        <List className="w-4 h-4 mr-1" />
                        <span>Conversation History</span>
                      </h4>
                      <button 
                        className="text-white hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessages([]);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    ref={transcriptRef}
                    className="h-[350px] overflow-y-auto p-3 space-y-3"
                    style={{ maxHeight: '350px' }}
                  >
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-sm">
                        No messages yet
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="pb-2 border-b border-gray-100 last:border-0">
                          <div className="font-medium text-gray-900 text-sm">
                            {message.role === 'user' ? 'You' : 'Assistant'}:
                          </div>
                          <p className="text-gray-700 text-sm">{message.content}</p>
                          {message.audio_url && message.role === 'assistant' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playAudio(message.audio_url!);
                              }}
                              className="text-xs text-blue-600 flex items-center mt-1"
                            >
                              <Volume2 className="w-3 h-3 mr-1" />
                              <span>Play audio</span>
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Voice Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              {/* Voice Chat Header */}
              <div 
                className="p-4 bg-blue-600 text-white flex items-center justify-between cursor-pointer"
                onClick={toggleTranscript}
              >
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5" />
                  <h3 className="font-semibold">Voice Assistant</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleAudio}
                    className="p-1 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    {audioEnabled ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5" />
                    )}
                  </button>
                  <button className="p-1 hover:bg-blue-700 rounded-full transition-colors">
                    {isTranscriptOpen ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Voice Chat Main Interface */}
              <div className="p-6 flex flex-col items-center justify-center text-center">
                {/* Status Indicator */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  isListening 
                    ? 'bg-red-100 animate-pulse' 
                    : isSpeaking 
                    ? 'bg-green-100 animate-pulse' 
                    : 'bg-blue-100'
                }`}>
                  {isListening ? (
                    <Mic className="w-10 h-10 text-red-600" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-10 h-10 text-green-600" />
                  ) : isProcessing ? (
                    <Loader className="w-10 h-10 text-blue-600 animate-spin" />
                  ) : (
                    <Mic className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                {/* Status Text */}
                <div className="mb-6">
                  {isListening ? (
                    <h3 className="font-medium text-gray-900">Listening...</h3>
                  ) : isSpeaking ? (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Speaking</h3>
                      <button 
                        onClick={pauseResumeAudio}
                        className="inline-flex items-center space-x-1 text-blue-600 text-sm"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </button>
                    </div>
                  ) : isProcessing ? (
                    <h3 className="font-medium text-gray-900">Processing...</h3>
                  ) : (
                    <h3 className="font-medium text-gray-900">Tap to speak</h3>
                  )}
                  
                  {transcribedText && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{transcribedText}"</p>
                  )}
                  
                  {currentMessage && !isListening && !isProcessing && (
                    <p className="text-sm text-gray-700 mt-4 max-h-24 overflow-y-auto">
                      {currentMessage}
                    </p>
                  )}
                </div>

                {/* Mic Button */}
                <Button
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 mt-4">
                  {isListening ? 'Tap to stop' : 'Tap to speak'}
                </p>
              </div>

              {/* Footer with Text Input Option */}
              <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <button 
                  className="text-xs text-blue-600"
                  onClick={() => window.open('/chat', '_blank')}
                >
                  Full Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};