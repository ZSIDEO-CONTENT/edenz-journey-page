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

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  success: boolean;
  action?: string;
  booking_data?: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message?: string;
    service?: string;
  };
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
const AUTH_TOKEN_KEY = 'edenz_admin_token';

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

// Fallback responses when API is unavailable
const fallbackResponses = [
  "I'm here to help you with your study abroad journey. What specific country or program are you interested in?",
  "Edenz Consultants can help you with university selection, visa guidance, and the entire application process. Would you like to know more about any specific aspect?",
  "We specialize in helping students study in the UK, USA, Canada, Australia, and New Zealand. Which country interests you the most?",
  "Our expert counselors can provide personalized guidance for your specific situation. Would you like to book a consultation?",
  "Many of our students have successfully secured scholarships. Your academic background and the destination country are key factors in scholarship eligibility.",
  "I'm having trouble connecting to my full knowledge base, but I'd be happy to arrange a call with one of our education experts who can answer all your questions in detail."
];

/**
 * Get a random fallback response
 */
const getFallbackResponse = (message: string): string => {
  // Simple intent detection for better fallbacks
  const messageText = message.toLowerCase();
  
  if (messageText.includes('hello') || messageText.includes('hi') || messageText.includes('hey')) {
    return "Hello! I'm Edenz AI. How can I help with your study abroad plans today?";
  }
  
  if (messageText.includes('scholarship') || messageText.includes('fund') || messageText.includes('financial')) {
    return "Scholarships vary by country and institution. Many universities offer merit-based scholarships for international students with strong academic records. Would you like to know about specific scholarship opportunities?";
  }
  
  if (messageText.includes('visa') || messageText.includes('permit')) {
    return "Visa requirements differ by country. We provide comprehensive visa application support, including document preparation and interview coaching. Which country's visa process would you like to know more about?";
  }
  
  if (messageText.includes('cost') || messageText.includes('fee') || messageText.includes('expensive')) {
    return "Tuition and living costs vary significantly by country and city. Generally, studying in the US tends to be more expensive than the UK, Canada, or Australia. Would you like a cost breakdown for a specific destination?";
  }
  
  if (messageText.includes('test') || messageText.includes('ielts') || messageText.includes('toefl') || messageText.includes('gre') || messageText.includes('gmat')) {
    return "Most English-speaking universities require English proficiency tests like IELTS or TOEFL. Graduate programs might also require GRE or GMAT. We can help you prepare for these tests and understand the specific requirements for your chosen programs.";
  }
  
  // Default to a random response if no specific intent is detected
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

/**
 * Send a message to the chat API
 */
export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const sessionId = getChatSessionId();
    
    // Get the API URL from environment or default to localhost in development
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    console.log(`Sending message to ${apiUrl}/chat`);
    
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
      console.error('API response not OK:', response.status, response.statusText);
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Update session ID if a new one is provided
    if (data.session_id) {
      localStorage.setItem(CHAT_SESSION_KEY, data.session_id);
    }
    
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    // Return a fallback response when API is unavailable
    return {
      response: getFallbackResponse(message),
      session_id: getChatSessionId(),
      success: false
    };
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
    // Return an empty array if history can't be fetched
    return [];
  }
};

/**
 * Admin login 
 */
export const adminLogin = async (credentials: AdminCredentials): Promise<string> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Invalid username or password');
    }
    
    const data = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
};

/**
 * Logout admin
 */
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Get all consultations (admin only)
 */
export const getConsultations = async (): Promise<Consultation[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/consultations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get consultations');
    }
    
    const data = await response.json();
    return data.consultations;
  } catch (error) {
    console.error('Error getting consultations:', error);
    throw error;
  }
};

/**
 * Update consultation status (admin only)
 */
export const updateConsultationStatus = async (consultationId: string, status: string): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/consultations/${consultationId}?status=${status}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to update consultation status');
    }
  } catch (error) {
    console.error('Error updating consultation status:', error);
    throw error;
  }
};

/**
 * Get all admin users (admin only)
 */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get admin users');
    }
    
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error getting admin users:', error);
    throw error;
  }
};

/**
 * Create a new admin user (admin only)
 */
export const createAdminUser = async (credentials: AdminCredentials): Promise<void> => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create admin user');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};
