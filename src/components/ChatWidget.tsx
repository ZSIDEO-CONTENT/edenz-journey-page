
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Detect booking intent in conversation
  const detectBookingIntent = (userMessage: string): boolean => {
    const bookingKeywords = ['book', 'consult', 'appointment', 'schedule', 'meet', 'talk', 'with doctor', 'with dr'];
    return bookingKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
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
      // Check if message contains booking intent
      if (detectBookingIntent(userInput)) {
        // Add bot response suggesting booking
        setTimeout(() => {
          setMessages(prev => [...prev, {
            content: "I'd be happy to help you book a consultation with Dr. Taimoor Ali Ahmad. Would you like to go to our booking page now?",
            sender: 'bot'
          }]);
          setIsLoading(false);
        }, 1000);
      } else {
        // Send message to API for regular queries
        const response = await sendChatMessage(userInput);
        
        // Add bot response
        setMessages(prev => [...prev, { 
          content: response.response,
          sender: 'bot'
        }]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      setMessages(prev => [...prev, { 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact us directly through the contact form.",
        sender: 'bot'
      }]);
      
      toast({
        title: "Connection Error",
        description: "Couldn't connect to the chat server. Please try again later.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };

  const handleBookingRedirect = () => {
    navigate('/book-consultation');
    setIsOpen(false);
  };

  // Process messages to add booking button when appropriate
  const processMessage = (content: string) => {
    // If message suggests booking, add a button
    if (content.includes("booking page") || 
        (content.includes("consultation") && content.includes("Dr. Taimoor"))) {
      return (
        <div>
          {content}
          <div className="mt-3">
            <Button
              onClick={handleBookingRedirect}
              size="sm"
              className="bg-primary text-white"
            >
              Go to Booking Page
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
