
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

// Study abroad expert agent
class StudyAbroadAgent {
  private systemPrompt = `You are Dr. Sarah, an expert study abroad consultant at Edenz Consultant with 15+ years of experience. 
  You specialize in helping Pakistani students with:
  - University selection and applications
  - Visa guidance and requirements
  - Test preparation (IELTS, TOEFL, GRE, GMAT)
  - Scholarship opportunities
  - Country-specific information
  - Financial planning for studies
  
  Always provide helpful, accurate, and encouraging responses. If you don't know something, suggest booking a consultation with Edenz Consultant.
  Keep responses conversational but professional. Use Pakistani context when relevant.`;

  async generateResponse(userMessage: string, conversationHistory: { role: string; content: string }[] = []): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again or contact our office directly.";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm Dr. Sarah from Edenz Consultant. I'm here to help you with your study abroad journey. What would you like to know about studying overseas?";
    }
    
    if (lowerMessage.includes('usa') || lowerMessage.includes('america')) {
      return "The USA offers excellent education opportunities! Top universities include Harvard, MIT, and Stanford. For Pakistani students, you'll need TOEFL/IELTS, strong academics, and financial proof. Student visas allow part-time work. Would you like specific information about programs or universities?";
    }
    
    if (lowerMessage.includes('canada')) {
      return "Canada is very popular among Pakistani students! It offers post-graduation work permits, affordable education, and pathways to permanent residency. Top universities include University of Toronto and UBC. IELTS is required. What program are you interested in?";
    }
    
    if (lowerMessage.includes('scholarship')) {
      return "Great question about scholarships! There are many options available: merit-based university scholarships, government scholarships like Fulbright, and need-based aid. I'd recommend booking a consultation where we can review your profile and identify the best scholarship opportunities for you.";
    }
    
    if (lowerMessage.includes('ielts') || lowerMessage.includes('test')) {
      return "IELTS preparation is crucial for your study abroad journey! We offer comprehensive coaching with experienced instructors. Most universities require 6.5-7.0 overall. Our students typically improve by 1-2 bands. Would you like to know about our test prep programs?";
    }
    
    return "That's a great question! For personalized guidance based on your specific situation, I'd recommend booking a consultation with our expert counselors. We can discuss your goals, academic background, and create a customized plan for your study abroad journey.";
  }
}

export const studyAbroadAgent = new StudyAbroadAgent();

export interface ChatResponse {
  response: string;
  session_id?: string;
  action?: string;
}

export async function sendChatMessage(message: string, conversationHistory: { role: string; content: string }[] = []): Promise<ChatResponse> {
  const response = await studyAbroadAgent.generateResponse(message, conversationHistory);
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Check if user is asking about booking/consultation
  const lowerMessage = message.toLowerCase();
  const hasBookingIntent = lowerMessage.includes('consultation') || 
                          lowerMessage.includes('appointment') || 
                          lowerMessage.includes('book') || 
                          lowerMessage.includes('meet');
  
  return {
    response,
    session_id: sessionId,
    action: hasBookingIntent ? "booking_intent" : undefined
  };
}
