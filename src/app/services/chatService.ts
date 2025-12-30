// Chat Service - Handles communication with backend /chat/ endpoint
// Uses Ollama AI (llama3 model) for intelligent responses

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.primecomputerdz.dz';

export interface ChatMessage {
  id?: string;
  message: string;
  response?: string;
  timestamp?: number;
  isLoading?: boolean;
  error?: string;
}

export interface ChatRequest {
  message: string;
  model?: string; // defaults to llama3
}

export interface ChatResponse {
  response: string;
  model?: string;
  timestamp?: number;
}

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL || 'https://pcprimedz.onrender.com';
  }

  /**
   * Send a message to the chatbot and get AI response
   * Session ID is handled via cookies automatically
   */
  async sendMessage(message: string, model: string = 'llama3'): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Send cookies for session management
        body: JSON.stringify({
          message,
          model,
        } as ChatRequest),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Chat API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
          url: `${this.baseUrl}/chat/`,
        });
        throw new Error(`Chat API error: ${response.status} ${response.statusText}\nDetails: ${errorBody}`);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Chat service error details:', error);
      throw error;
    }
  }

  /**
   * Save conversation history to localStorage
   */
  saveHistory(messages: ChatMessage[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  /**
   * Load conversation history from localStorage
   */
  loadHistory(): ChatMessage[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('chatHistory');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chatHistory');
      }
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }
}

export default new ChatService();
