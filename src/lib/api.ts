/**
 * API utility functions for form submissions and chat
 */

import { createClient } from '@supabase/supabase-js';

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
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
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

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vxievjimtordkobtuink.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aWV2amltdG9yZGtvYnR1aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTEyNDEsImV4cCI6MjA1ODY2NzI0MX0.h_YWBX9nhfGlq6MaR3jSDu56CagNpoprBgqiXwjhJAI';
const supabase = createClient(supabaseUrl, supabaseKey);

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
 * Admin login using Supabase Auth
 */
export const adminLogin = async (credentials: AdminCredentials): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

/**
 * Logout admin
 */
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get all consultations (admin only)
 */
export const getConsultations = async (): Promise<Consultation[]> => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data as Consultation[];
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
    const { error } = await supabase
      .from('consultations')
      .update({ status })
      .eq('id', consultationId);
      
    if (error) {
      throw error;
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
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }
    
    return data.users.map(user => ({
      id: user.id,
      email: user.email || '',
      role: user.role || 'user',
      created_at: user.created_at || new Date().toISOString()
    }));
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
    const { error } = await supabase.auth.admin.createUser({
      email: credentials.email,
      password: credentials.password,
      email_confirm: true
    });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};
