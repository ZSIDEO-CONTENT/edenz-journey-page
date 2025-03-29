import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { sendChatMessage, ChatMessage } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: 'Hello! I am Edenz AI. How can I help you with your study abroad journey today?', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Help functions to detect booking patterns in the conversation
  const detectBookingIntent = (userMessages: string[]): boolean => {
    const bookingKeywords = ['book', 'consult', 'appointment', 'schedule', 'meet', 'talk'];
    const lastFewMessages = userMessages.slice(-3).join(' ').toLowerCase();
    
    return bookingKeywords.some(keyword => lastFewMessages.includes(keyword));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { content: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading
    const userInput = message;
    setMessage('');
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendChatMessage(userInput);
      
      if (response.success === false) {
        // Reset error count on success
        setErrorCount(0);
        
        // If using a fallback response, show a toast
        toast({
          title: "Using Offline Mode",
          description: "We're having trouble connecting to our AI. Using simplified responses for now.",
          variant: "default"
        });
      }
      
      // Add bot response
      const botMessage: ChatMessage = { 
        content: response.response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Handle booking confirmation
      if (response.action === "booking_confirmed" && response.booking_data) {
        // Show a success toast
        toast({
          title: "Consultation Booked!",
          description: "Your consultation has been scheduled. We'll be in touch soon!",
          variant: "default"
        });
        
        // Display booking confirmation details
        if (response.booking_data.date && response.booking_data.time) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              content: `Thank you, ${response.booking_data.name}! Your consultation is confirmed for ${response.booking_data.date} at ${response.booking_data.time}. We've sent a confirmation to ${response.booking_data.email}. You can manage your booking in your account or contact us for any changes.`,
              sender: 'bot'
            }]);
          }, 1000);
        }
      }
      // Handle partial booking data
      else if (response.action === "booking_started") {
        // The agent will handle asking for the needed details in its response
        console.log("Booking process started, waiting for complete details");
      }
      // Check if conversation is about booking
      else {
        const userMessages = [...messages, userMessage]
          .filter(msg => msg.sender === 'user')
          .map(msg => msg.content);
          
        if (detectBookingIntent(userMessages) && !response.response.includes("booking has been confirmed")) {
          // Suggest booking form
          setTimeout(() => {
            setMessages(prev => [...prev, {
              content: "If you'd like to book a consultation right now, you can also use our booking form. Would you like me to take you there?",
              sender: 'bot'
            }]);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setErrorCount(prev => prev + 1);
      
      // Add error message
      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly through the contact form.";
      
      if (errorCount > 2) {
        errorMessage = "Our AI assistant is currently unavailable. Please use our booking form or contact us directly for assistance.";
      }
      
      setMessages(prev => [...prev, { 
        content: errorMessage,
        sender: 'bot'
      }]);
      
      if (errorCount > 3) {
        // After multiple errors, suggest using the booking form directly
        setTimeout(() => {
          setMessages(prev => [...prev, {
            content: "Would you like to go to our booking form to schedule a consultation with a human expert?",
            sender: 'bot'
          }]);
        }, 1000);
      }
      
      toast({
        title: "Connection Error",
        description: "Couldn't connect to the chat server. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingRedirect = () => {
    navigate('/book-consultation');
    setIsOpen(false);
  };

  // Function to process messages for booking intent
  const processMessage = (content: string) => {
    // Check if message suggests redirect to booking form
    if (content.includes("booking form") && (content.includes("take you there") || content.includes("go to our booking form"))) {
      return (
        <div>
          {content}
          <div className="mt-3">
            <Button
              onClick={handleBookingRedirect}
              size="sm"
              className="bg-primary text-white"
            >
              Go to Booking Form
            </Button>
          </div>
        </div>
      );
    }
    
    // Regular message
    return content;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="sm:max-w-[400px] h-[500px] rounded-t-xl mx-auto sm:mr-4 mb-0 p-0 border border-primary/20 shadow-xl">
          <div className="flex flex-col h-full">
            <SheetHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row justify-between items-center">
              <SheetTitle className="text-left text-white">Chat with Edenz AI</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-primary/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-xl ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-secondary text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'bot' ? processMessage(msg.content) : msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground p-3 rounded-xl rounded-tl-none max-w-[85%] flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-primary text-white"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatWidget;
