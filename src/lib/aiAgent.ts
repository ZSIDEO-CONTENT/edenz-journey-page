
import OpenAI from 'openai';

// Initialize OpenAI client with error handling
const initializeOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.warn('OpenAI API key not configured. Using fallback responses.');
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

const openai = initializeOpenAI();

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
    // If OpenAI is not configured, use fallback responses
    if (!openai) {
      return this.getFallbackResponse(userMessage);
    }

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
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm Dr. Sarah from Edenz Consultant. I'm here to help you with your study abroad journey. What would you like to know about studying overseas?";
    }
    
    if (lowerMessage.includes('usa') || lowerMessage.includes('america') || lowerMessage.includes('united states')) {
      return "The USA offers excellent education opportunities! Top universities include Harvard, MIT, and Stanford. For Pakistani students, you'll need TOEFL/IELTS, strong academics, and financial proof. Student visas allow part-time work. Would you like specific information about programs or universities?";
    }
    
    if (lowerMessage.includes('canada')) {
      return "Canada is very popular among Pakistani students! It offers post-graduation work permits, affordable education, and pathways to permanent residency. Top universities include University of Toronto and UBC. IELTS is required. What program are you interested in?";
    }
    
    if (lowerMessage.includes('uk') || lowerMessage.includes('united kingdom') || lowerMessage.includes('britain')) {
      return "The UK has world-renowned universities like Oxford, Cambridge, and Imperial College. Programs are typically shorter - 1 year for Masters. You'll need IELTS 6.5+ and strong academics. Post-study work visa allows 2 years to find employment.";
    }
    
    if (lowerMessage.includes('australia')) {
      return "Australia offers excellent education with universities like Melbourne, Sydney, and ANU. Great weather, multicultural environment, and post-study work opportunities. IELTS required, and there are good scholarship opportunities for Pakistani students.";
    }
    
    if (lowerMessage.includes('germany')) {
      return "Germany offers tuition-free education at public universities! You'll need to learn German for most programs, though many English-taught Masters are available. Strong engineering and technology programs. Great for students seeking affordable quality education.";
    }
    
    if (lowerMessage.includes('scholarship') || lowerMessage.includes('funding')) {
      return "Great question about scholarships! There are many options: merit-based university scholarships, government scholarships like Fulbright, and need-based aid. We help students identify and apply for scholarships based on their academic profile and chosen destination.";
    }
    
    if (lowerMessage.includes('ielts') || lowerMessage.includes('test') || lowerMessage.includes('toefl') || lowerMessage.includes('gre') || lowerMessage.includes('gmat')) {
      return "Test preparation is crucial! We offer comprehensive coaching for IELTS, TOEFL, GRE, and GMAT. Most universities require IELTS 6.5-7.0. Our experienced instructors help students improve their scores significantly. Would you like to know about our test prep programs?";
    }
    
    if (lowerMessage.includes('visa') || lowerMessage.includes('immigration')) {
      return "Visa processing is a critical step! Requirements vary by country - student visas, financial proof, health insurance, and proper documentation are essential. We guide students through the entire visa application process to maximize approval chances.";
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('expense')) {
      return "Costs vary significantly by country and program. US: $30-60K/year, UK: £15-35K/year, Canada: CAD 20-40K/year, Australia: AUD 25-45K/year. This includes tuition and living expenses. We help create detailed financial plans and find funding options.";
    }
    
    if (lowerMessage.includes('consultation') || lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('meet')) {
      return "I'd be happy to arrange a personalized consultation! Our expert counselors can discuss your specific goals, academic background, and create a customized plan. You can book a consultation through our website or contact us directly at +92 333 4229697.";
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('requirement')) {
      return "Document requirements typically include: academic transcripts, English proficiency scores, statement of purpose, letters of recommendation, passport, and financial statements. Requirements vary by country and program level. We provide detailed checklists for each destination.";
    }
    
    return "That's a great question about studying abroad! For personalized guidance based on your specific situation, I'd recommend booking a consultation with our expert counselors. We can discuss your goals, academic background, and create a customized plan for your study abroad journey. Contact us at +92 333 4229697 or visit our office in Lahore.";
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
