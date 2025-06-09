
// Simple AI chat service that simulates responses
// In a real implementation, this would connect to your FastAPI backend

interface ChatResponse {
  response: string;
  session_id?: string;
  action?: string;
}

const STUDY_ABROAD_RESPONSES = [
  "I'd be happy to help you with your study abroad journey! What specific information are you looking for?",
  "That's a great question about studying abroad. Let me provide you with some detailed information.",
  "Based on your query, I can offer several options for your international education plans.",
  "I understand you're interested in studying abroad. Here are some key points to consider.",
  "Great! Let me help you explore the best study abroad options for your academic goals."
];

const COUNTRY_INFO = {
  usa: "The United States offers world-class education with over 4,000 universities. Popular programs include Computer Science, Business, and Engineering. Average tuition ranges from $25,000-$60,000 per year.",
  uk: "The UK provides excellent education with shorter program durations. Top universities include Oxford, Cambridge, and Imperial College. Tuition ranges from £10,000-£38,000 per year.",
  canada: "Canada offers affordable quality education with post-graduation work permits. Top universities include University of Toronto and UBC. Tuition ranges from CAD 20,000-40,000 per year.",
  australia: "Australia combines high-quality education with excellent lifestyle. Universities like Melbourne and ANU are highly ranked. Tuition ranges from AUD 20,000-45,000 per year.",
  germany: "Germany offers free or low-cost education at public universities. Strong in engineering and research. Many English-taught programs available.",
  newzealand: "New Zealand provides safe, welcoming environment with practical learning. Post-study work visa available for up to 3 years."
};

const VISA_INFO = {
  student: "Student visa requirements typically include: acceptance letter, proof of financial support, English language proficiency, and medical examinations.",
  work: "Post-study work visas allow graduates to gain valuable work experience. Duration varies by country: US (1-3 years), Canada (up to 3 years), Australia (2-4 years).",
  requirements: "General visa requirements include passport, photographs, application forms, financial documents, and academic transcripts."
};

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific country queries
  if (lowerMessage.includes('usa') || lowerMessage.includes('america') || lowerMessage.includes('united states')) {
    return `${COUNTRY_INFO.usa}\n\nWould you like to know more about specific universities or programs in the US?`;
  }
  
  if (lowerMessage.includes('uk') || lowerMessage.includes('britain') || lowerMessage.includes('england')) {
    return `${COUNTRY_INFO.uk}\n\nI can provide more details about UK universities and application processes.`;
  }
  
  if (lowerMessage.includes('canada')) {
    return `${COUNTRY_INFO.canada}\n\nCanada is particularly welcoming to international students with pathways to permanent residency.`;
  }
  
  if (lowerMessage.includes('australia')) {
    return `${COUNTRY_INFO.australia}\n\nWould you like information about specific Australian universities or cities?`;
  }
  
  if (lowerMessage.includes('germany')) {
    return `${COUNTRY_INFO.germany}\n\nGermany is an excellent choice for students seeking quality education with minimal financial burden.`;
  }
  
  if (lowerMessage.includes('new zealand')) {
    return `${COUNTRY_INFO.newzealand}\n\nNew Zealand offers a unique blend of academic excellence and natural beauty.`;
  }
  
  // Check for visa-related queries
  if (lowerMessage.includes('visa')) {
    if (lowerMessage.includes('student')) {
      return VISA_INFO.student;
    } else if (lowerMessage.includes('work')) {
      return VISA_INFO.work;
    } else {
      return VISA_INFO.requirements;
    }
  }
  
  // Check for IELTS/test preparation queries
  if (lowerMessage.includes('ielts') || lowerMessage.includes('toefl') || lowerMessage.includes('test')) {
    return "We offer comprehensive test preparation for IELTS, TOEFL, PTE, GRE, and GMAT. Our experienced instructors help students achieve their target scores through personalized coaching and practice materials.\n\nWould you like to know more about our test preparation programs?";
  }
  
  // Check for scholarship queries
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('funding')) {
    return "There are various scholarship opportunities available:\n\n• Merit-based scholarships from universities\n• Government scholarships (Fulbright, Chevening, etc.)\n• Country-specific scholarships\n• Field-specific scholarships\n\nI can help you identify scholarships that match your profile and academic goals.";
  }
  
  // Check for cost/fees queries
  if (lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('expense')) {
    return "Study abroad costs vary by country and program:\n\n• USA: $25,000-$60,000/year\n• UK: £10,000-£38,000/year\n• Canada: CAD 20,000-40,000/year\n• Australia: AUD 20,000-45,000/year\n• Germany: €0-€3,000/year (public universities)\n\nThis includes tuition fees. Living expenses are additional. Would you like a detailed breakdown for a specific country?";
  }
  
  // Check for application process queries
  if (lowerMessage.includes('application') || lowerMessage.includes('apply') || lowerMessage.includes('admission')) {
    return "The application process typically involves:\n\n1. Research and shortlist universities\n2. Prepare required documents (transcripts, SOP, LORs)\n3. Take standardized tests (IELTS/TOEFL, GRE/GMAT)\n4. Submit applications before deadlines\n5. Apply for student visa\n6. Arrange accommodation and travel\n\nI can guide you through each step. Which stage are you currently at?";
  }
  
  // Check for consultation/booking intent
  if (lowerMessage.includes('consultation') || lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('meet')) {
    return "I'd be happy to help you book a consultation with our expert counselors! Our consultations include:\n\n• Personalized university recommendations\n• Application strategy and timeline\n• Scholarship guidance\n• Visa assistance\n• Test preparation advice\n\nConsultation fee: 5000 PKR\n\nWould you like to schedule a consultation with our team?";
  }
  
  // General greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to Edenz Consultant. I'm here to help you with your study abroad journey. I can provide information about:\n\n• Study destinations and universities\n• Visa requirements and processes\n• Test preparation (IELTS, TOEFL, GRE, GMAT)\n• Scholarships and funding\n• Application procedures\n\nWhat would you like to know about?";
  }
  
  // Default responses for general queries
  const randomResponse = STUDY_ABROAD_RESPONSES[Math.floor(Math.random() * STUDY_ABROAD_RESPONSES.length)];
  
  return `${randomResponse}\n\nI can help you with:\n• University selection and applications\n• Visa guidance\n• Test preparation\n• Scholarship information\n• Country-specific requirements\n\nWhat specific aspect of studying abroad interests you most?`;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const response = generateResponse(message);
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
