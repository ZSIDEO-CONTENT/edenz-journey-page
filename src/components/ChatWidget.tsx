
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatWidget = () => {
  const navigate = useNavigate();

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button 
        className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 shadow-lg animate-pulse-slow hover:animate-none transition-all duration-300 hover:scale-110"
        onClick={goToChat}
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-slow">1</span>
      </Button>
    </div>
  );
};

export default ChatWidget;
