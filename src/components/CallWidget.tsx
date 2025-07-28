import { useState } from 'react';
import { Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

const phoneNumbers = [
  { label: '+923334228697 ', number: '00923334228697' },
  { label: '+923002578697', number: '00923002578697' },
];

const CallWidget = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="fixed bottom-5 right-24 z-50 flex flex-col items-end space-y-2">
      {showOptions && (
        <div className="bg-white shadow-xl rounded-xl p-2 space-y-2 animate-fade-in-up">
          {phoneNumbers.map((item, idx) => (
            <a
              key={idx}
              href={`tel:${item.number}`}
              className="flex items-center space-x-2 text-sm text-primary hover:text-white hover:bg-primary px-3 py-2 rounded-md transition-colors"
              onClick={() => setShowOptions(false)}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}

      <Button
        onClick={() => setShowOptions(prev => !prev)}
        className="rounded-full h-14 w-14 p-0 bg-green-600 hover:bg-green-700 shadow-lg animate-pulse-slow hover:animate-none transition-all duration-300 hover:scale-110"
      >
        <Phone className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default CallWidget;
