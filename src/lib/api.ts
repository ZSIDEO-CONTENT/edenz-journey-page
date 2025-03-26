
/**
 * API utility functions for form submissions
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

/**
 * Send a message to the chat API
 */
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    // For development, you may need to update this URL based on where your FastAPI server is running
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
