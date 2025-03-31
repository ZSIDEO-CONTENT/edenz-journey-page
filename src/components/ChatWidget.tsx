
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
        className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 shadow-lg animate-bounce"
        onClick={goToChat}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default ChatWidget;
