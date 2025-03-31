
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ExternalLink } from 'lucide-react';
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { content: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading
    setMessage('');
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendChatMessage(message);
      
      // Add bot response
      setMessages(prev => [...prev, { 
        content: response.response,
        sender: 'bot'
      }]);
      
      setIsLoading(false);
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

  const goToFullChat = () => {
    navigate('/chat');
    setIsOpen(false);
  };

  // Process messages to add booking button when appropriate and format properly
  const processMessage = (content: string) => {
    // Format the message for better readability - replace markdown formatting
    let formattedContent = content
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '')   // Remove italic markers
      .split('\n').map(line => line.trim()).filter(Boolean).join('\n\n'); // Proper line breaks
    
    // If message contains booking suggestions, add a booking button
    if (content.toLowerCase().includes('book') || 
        content.toLowerCase().includes('consultation') ||
        content.toLowerCase().includes('advisor') ||
        content.toLowerCase().includes('expert')) {
      return (
        <div>
          <div className="whitespace-pre-wrap">{formattedContent}</div>
          <div className="mt-3">
            <p className="mb-2 text-sm text-gray-600">Consultation Fee: 5000 PKR</p>
            <Button
              onClick={handleBookingRedirect}
              size="sm"
              className="bg-primary text-white"
            >
              Book Paid Consultation
            </Button>
          </div>
        </div>
      );
    }
    
    // Regular message with proper formatting
    return <div className="whitespace-pre-wrap">{formattedContent}</div>;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 shadow-lg animate-bounce"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="sm:max-w-[400px] h-[500px] rounded-t-xl mx-auto sm:mr-4 mb-0 p-0 border border-primary/20 shadow-xl">
          <div className="flex flex-col h-full">
            <SheetHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row justify-between items-center">
              <SheetTitle className="text-left text-white">Chat with Edenz AI</SheetTitle>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={goToFullChat}
                  className="h-8 w-8 text-white hover:bg-primary/80"
                  title="Open full chat"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white hover:bg-primary/80"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
