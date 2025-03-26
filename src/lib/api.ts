
/**
 * API utility functions for form submissions and chat
 */

// Type definitions
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ConsultationBookingData {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  service: string;
  destination?: string;
  message?: string;
}

export interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}

/**
 * Submits contact form data
 */
export const submitContactForm = async (data: ContactFormData): Promise<void> => {
  // Log the submission data
  console.log('Contact form submission:', data);
  
  // In a real application, this would be an API call to your backend
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      try {
        // Simulate server response
        // For production, replace with actual API call
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Failed to submit form'));
        }
      } catch (error) {
        reject(error);
      }
    }, 1500);
  });
};

/**
 * Submits consultation booking data
 */
export const submitConsultationBooking = async (data: ConsultationBookingData): Promise<void> => {
  // Log the booking data
  console.log('Consultation booking:', data);
  
  // In a real application, this would be an API call to your backend
  return new Promise((resolve, reject) => {
    // Simulate API request delay
    setTimeout(() => {
      try {
        // Simulate server response
        // For production, replace with actual API call
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Failed to book consultation'));
        }
      } catch (error) {
        reject(error);
      }
    }, 1500);
  });
};

// Store chat session ID in localStorage
const CHAT_SESSION_KEY = 'edenz_chat_session_id';

/**
 * Get or create a chat session ID
 */
const getChatSessionId = (): string => {
  let sessionId = localStorage.getItem(CHAT_SESSION_KEY);
  if (!sessionId) {
    // Generate a random session ID if none exists
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(CHAT_SESSION_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Send a message to the chat API
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const sessionId = getChatSessionId();
    
    // Get the API URL from environment or default to localhost in development
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    // Send the message to the FastAPI backend
    const response = await fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        session_id: sessionId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    
    // Update session ID if a new one is provided
    if (data.session_id) {
      localStorage.setItem(CHAT_SESSION_KEY, data.session_id);
    }
    
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};

/**
 * Get chat history for the current session
 */
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  try {
    const sessionId = getChatSessionId();
    if (!sessionId) {
      return [];
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/chat/history/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }
    
    const data = await response.json();
    return data.messages.map((msg: any) => ({
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};
