
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
  destination?: string;
  service: string;
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
