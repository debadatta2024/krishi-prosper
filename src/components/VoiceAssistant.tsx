import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  userType: 'farmer' | 'buyer';
}

const VoiceAssistant = ({ userType }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-IN');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceCommand(text);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let response = '';

    if (userType === 'farmer') {
      if (lowerText.includes('crop') || lowerText.includes('fasal')) {
        response = 'I recommend growing wheat and rice based on your region. These crops have good market demand.';
      } else if (lowerText.includes('weather') || lowerText.includes('mausam')) {
        response = 'The weather forecast shows moderate rainfall in the next 7 days. Good conditions for planting.';
      } else if (lowerText.includes('price') || lowerText.includes('daam')) {
        response = 'Current wheat prices are trending upward. Expected to reach 2500 rupees per quintal.';
      } else {
        response = 'I can help you with crop recommendations, weather forecasts, and price predictions. What would you like to know?';
      }
    } else {
      if (lowerText.includes('buy') || lowerText.includes('purchase')) {
        response = 'You can browse fresh produce in the marketplace. We have wheat, rice, and vegetables available.';
      } else if (lowerText.includes('order') || lowerText.includes('delivery')) {
        response = 'Your recent orders are being processed. Expected delivery in 2-3 days.';
      } else {
        response = 'I can help you find products, track orders, and check prices. How can I assist you?';
      }
    }

    speak(response);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = language;
      recognition.start();
      setIsListening(true);
      toast.success('Listening... Speak now');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-IN">English</SelectItem>
          <SelectItem value="hi-IN">हिंदी</SelectItem>
          <SelectItem value="pa-IN">ਪੰਜਾਬੀ</SelectItem>
          <SelectItem value="ta-IN">தமிழ்</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "default"}
        size="icon"
        className="rounded-full"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default VoiceAssistant;
