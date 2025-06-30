import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Default voice ID

interface TextToSpeechOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

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

export const elevenlabsService = {
  // Text to speech conversion
  async textToSpeech(
    text: string,
    options: TextToSpeechOptions = {}
  ): Promise<ArrayBuffer> {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('Eleven Labs API key not configured');
    }

    const {
      voiceId = ELEVENLABS_VOICE_ID,
      modelId = 'eleven_monolingual_v1',
      stability = 0.5,
      similarityBoost = 0.75
    } = options;

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: {
              stability,
              similarity_boost: similarityBoost
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Eleven Labs API error: ${errorData.detail || response.statusText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  },

  // Create a blob URL from audio data
  createAudioUrl(audioData: ArrayBuffer): string {
    const blob = new Blob([audioData], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  },

  // Save conversation to database
  async saveConversation(userId: string, messages: Message[]): Promise<string> {
    try {
      const conversationId = uuidv4();
      
      const { error } = await supabase
        .from('conversations')
        .insert([{
          id: conversationId,
          user_id: userId,
          messages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      return conversationId;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  },

  // Update existing conversation
  async updateConversation(conversationId: string, messages: Message[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // Get user conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Get conversation by ID
  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};