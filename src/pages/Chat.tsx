
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage, ChatMessage } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
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
  };

  // Process messages to add booking button when appropriate
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
          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-600 font-medium">Consultation Fee: 5000 PKR</p>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <h1 className="text-xl font-bold flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Edenz AI Assistant
                </h1>
                <p className="text-sm opacity-90">
                  Get instant answers about studying abroad or book a consultation with our experts
                </p>
              </div>
              
              <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-xl ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white border border-gray-200 text-foreground rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.sender === 'bot' ? processMessage(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-tl-none max-w-[85%] flex items-center space-x-2 shadow-sm">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2 bg-white">
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
              
              <div className="bg-gray-50 border-t p-4 text-center text-sm text-gray-600">
                <p>For personalized guidance, book a consultation with our experts (5000 PKR)</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
