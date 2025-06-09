
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageCircle, Send, Search, BookOpen, Globe, GraduationCap, Sparkles, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { sendChatMessage } from '@/lib/aiAgent';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{sender: string, content: string}[]>([
    { content: 'Hello! I am Dr. Sarah, your AI study abroad consultant from Edenz. How can I help you with your international education journey today?', sender: 'bot' }
  ]);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Loading stages for a more engaging experience
  const loadingStages = [
    { text: "Analyzing your query...", icon: <Search className="animate-pulse" /> },
    { text: "Searching education database...", icon: <BookOpen className="animate-bounce" /> },
    { text: "Finding best recommendations...", icon: <GraduationCap className="animate-spin" /> },
    { text: "Preparing response...", icon: <Bot className="animate-pulse" /> }
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Progress animation during loading
  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      interval = window.setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + 5;
          if (newValue >= 100) {
            window.clearInterval(interval);
            return 100;
          }
          // Change loading stage at certain percentages
          if (newValue > 25 && loadingStage === 0) setLoadingStage(1);
          if (newValue > 50 && loadingStage === 1) setLoadingStage(2);
          if (newValue > 75 && loadingStage === 2) setLoadingStage(3);
          return newValue;
        });
      }, 200);
    } else {
      setProgressValue(0);
      setLoadingStage(0);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isLoading, loadingStage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { content: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation history
    const newHistory = [...conversationHistory, { role: 'user', content: message }];
    setConversationHistory(newHistory);
    
    // Clear input and set loading
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    
    try {
      // Send message to our AI agent
      const response = await sendChatMessage(currentMessage, newHistory);
      
      // Store the session ID for future messages
      if (response.session_id && !sessionId) {
        setSessionId(response.session_id);
      }
      
      // Add bot response
      const botMessage = { 
        content: response.response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Update conversation history with bot response
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response.response }]);
      
      // Handle booking intent if detected
      if (response.action === "booking_intent") {
        setTimeout(() => {
          toast({
            title: "Ready to Book?",
            description: "Schedule a consultation with our expert counselors for personalized guidance.",
            action: (
              <Button 
                onClick={handleBookingRedirect}
                variant="outline"
                size="sm"
              >
                Book Now
              </Button>
            )
          });
        }, 1000);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      setMessages(prev => [...prev, { 
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact us directly for assistance.",
        sender: 'bot'
      }]);
      
      toast({
        title: "Connection Error",
        description: "Couldn't process your message. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };

  const handleBookingRedirect = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/book-consultation');
  };

  // Process messages to add booking button when appropriate
  const processMessage = (content: string) => {
    // Format the message for better readability
    let formattedContent = content
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .split('\n').map(line => line.trim()).filter(Boolean).join('<br/>');
    
    // If message contains booking suggestions, add a booking button
    if (content.toLowerCase().includes('consultation') || 
        content.toLowerCase().includes('book') ||
        content.toLowerCase().includes('schedule')) {
      return (
        <div>
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedContent }}></div>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              <p className="font-medium text-primary">Expert Consultation Available</p>
            </div>
            <p className="mb-2 text-sm text-gray-600">Get personalized guidance from our expert counselors</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-primary">Fee: 5000 PKR</p>
              <Button
                onClick={handleBookingRedirect}
                size="sm"
                className="bg-primary text-white transition-all duration-300 hover:scale-105"
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Regular message with proper formatting
    return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedContent }}></div>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-500 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                <h1 className="text-xl font-bold flex items-center">
                  <Bot className="mr-2 h-5 w-5 animate-pulse" />
                  Chat with Edenz AI Assistant
                  <Sparkles className="ml-2 h-4 w-4 text-yellow-300 animate-pulse" />
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
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-xl ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-white rounded-tr-none shadow-md transition-all duration-300 hover:shadow-lg' 
                            : 'bg-white border border-gray-200 text-foreground rounded-tl-none shadow-sm transition-all duration-300 hover:shadow-md'
                        }`}
                      >
                        {msg.sender === 'bot' ? processMessage(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white border border-gray-200 p-4 rounded-xl rounded-tl-none max-w-[85%] shadow-sm">
                        <div className="flex items-center space-x-3 mb-2">
                          {loadingStages[loadingStage].icon}
                          <div className="font-medium text-primary">{loadingStages[loadingStage].text}</div>
                        </div>
                        <Progress value={progressValue} className="h-2 mb-2" />
                        <div className="flex items-center text-xs text-gray-500">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          <span>Processing your request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2 bg-white">
                <Input
                  type="text"
                  placeholder="Ask about studying abroad, visa requirements, test prep..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="bg-primary text-white transition-all duration-300 hover:scale-110 hover:shadow-md"
                  disabled={isLoading}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              
              <div className="bg-gradient-to-r from-primary/5 to-blue-50 border-t p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-gray-700">Need expert guidance from our counselors?</span>
                </div>
                <Button
                  onClick={handleBookingRedirect}
                  className="bg-primary text-white transition-all duration-300 hover:scale-105"
                  size="sm"
                >
                  Book Expert Consultation (5000 PKR)
                </Button>
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
