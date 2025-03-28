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
import { sendChatMessage, ChatMessage, getChatHistory } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { content: 'Hello! I am Edenz AI. How can I help you with your study abroad journey today?', sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch chat history when widget opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      loadChatHistory();
    }
  }, [isOpen, isInitialized]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const history = await getChatHistory();
      
      if (history && history.length > 0) {
        setMessages(history);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Keep default welcome message
    } finally {
      setIsLoading(false);
    }
  };

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
      
      // Add bot response
      const botMessage: ChatMessage = { 
        content: response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Check if conversation is about booking
      const userMessages = [...messages, userMessage]
        .filter(msg => msg.sender === 'user')
        .map(msg => msg.content);
        
      if (detectBookingIntent(userMessages) && !response.includes("booking has been confirmed")) {
        // Optionally suggest a booking form for a smoother experience
        if (Math.random() > 0.5 && !response.includes("booking")) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              content: "If you'd like to book a consultation, I can help you with that. Just let me know your name, email, phone number, and when you'd prefer to meet.",
              sender: 'bot'
            }]);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      // Add error message
      const errorMessage: ChatMessage = { 
        content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later or contact us directly through the contact form.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Couldn't connect to the chat server. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                    {msg.content}
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
