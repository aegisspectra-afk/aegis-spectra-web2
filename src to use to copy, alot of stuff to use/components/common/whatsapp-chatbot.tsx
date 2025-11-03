'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Camera, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
  action?: 'redirect' | 'phone' | 'form';
  actionData?: any;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'שלום! 👋 אני כאן לעזור לך לבחור את מערכת האבטחה המתאימה. איך אני יכול לעזור?',
    isBot: true,
    timestamp: new Date(),
    quickReplies: [
      'אני רוצה הצעת מחיר',
      'איזה מצלמות יש לכם?',
      'כמה זמן לוקחת התקנה?',
      'אני רוצה לדבר עם נציג'
    ]
  }
];

const botResponses = {
  'אני רוצה הצעת מחיר': {
    text: 'מעולה! כדי לתת לך הצעת מחיר מדויקת, אני צריך לדעת כמה נקודות אבטחה אתה צריך. כמה מצלמות אתה רוצה?',
    quickReplies: ['1-2 מצלמות', '3-4 מצלמות', '5-8 מצלמות', '9+ מצלמות', 'לא יודע']
  },
  '1-2 מצלמות': {
    text: 'מצוין! עבור 1-2 מצלמות אני ממליץ על חבילת Home Cam שלנו. המחיר: 1,990₪ כולל התקנה ואחריות. רוצה שאני אשלח לך פרטים נוספים?',
    quickReplies: ['כן, שלח פרטים', 'איך מתקדמים?', 'אני רוצה לדבר עם נציג']
  },
  '3-4 מצלמות': {
    text: 'מעולה! עבור 3-4 מצלמות אני ממליץ על חבילת Business Cam שלנו. המחיר: 3,490₪ כולל התקנה, הדרכה ואחריות. רוצה שאני אשלח לך פרטים נוספים?',
    quickReplies: ['כן, שלח פרטים', 'איך מתקדמים?', 'אני רוצה לדבר עם נציג']
  },
  '5-8 מצלמות': {
    text: 'מצוין! עבור 5-8 מצלמות נצטרך לבנות חבילה מותאמת אישית. המחיר יהיה בין 4,000-6,000₪ בהתאם לצרכים. רוצה שאני אשלח לך נציג שיעזור לך?',
    quickReplies: ['כן, שלח נציג', 'איך מתקדמים?', 'אני רוצה לדבר עכשיו']
  },
  '9+ מצלמות': {
    text: 'מעולה! עבור 9+ מצלמות נבנה לך מערכת מקצועית מותאמת אישית. המחיר יהיה בין 6,000-12,000₪ בהתאם לצרכים. רוצה שאני אשלח לך נציג מקצועי?',
    quickReplies: ['כן, שלח נציג', 'איך מתקדמים?', 'אני רוצה לדבר עכשיו']
  },
  'לא יודע': {
    text: 'זה בסדר! אני אשלח לך נציג מקצועי שיעשה איתך ביקור מדידה חינם ויעזור לך לתכנן את המערכת המושלמת. איך זה נשמע?',
    quickReplies: ['כן, אני מעוניין', 'איך מתקדמים?', 'אני רוצה לדבר עכשיו']
  },
  'איזה מצלמות יש לכם?': {
    text: 'יש לנו מגוון רחב של מצלמות: מצלמות 4MP בסיסיות, מצלמות 4K מתקדמות, מצלמות PTZ עם סיבוב, ומצלמות עם זיהוי פנים. איזה סוג מעניין אותך?',
    quickReplies: ['מצלמות 4MP', 'מצלמות 4K', 'מצלמות PTZ', 'מצלמות עם זיהוי פנים', 'אני רוצה לראות הכל']
  },
  'כמה זמן לוקחת התקנה?': {
    text: 'התקנה לוקחת בדרך כלל 3-6 שעות עבור 2-4 מצלמות. עבור מערכות גדולות יותר זה יכול לקחת יום-יומיים. אנחנו מגיעים עם כל הציוד והכלים הנדרשים!',
    quickReplies: ['מעולה!', 'איך מתקדמים?', 'אני רוצה לדבר עם נציג']
  },
  'אני רוצה לדבר עם נציג': {
    text: 'מצוין! אני אעביר אותך לנציג מקצועי שלנו. הוא יוכל לעזור לך עם כל השאלות ולתת לך הצעה מותאמת אישית.',
    action: 'phone',
    actionData: { phone: '972559737025' }
  },
  'אני רוצה לדבר עכשיו': {
    text: 'מעולה! אני אעביר אותך לנציג מקצועי שלנו עכשיו.',
    action: 'phone',
    actionData: { phone: '972559737025' }
  },
  'כן, שלח פרטים': {
    text: 'מעולה! אני אשלח לך פרטים מלאים על החבילה. איך אתה מעדיף לקבל את הפרטים?',
    quickReplies: ['WhatsApp', 'אימייל', 'טלפון', 'אני רוצה לדבר עם נציג']
  },
  'כן, שלח נציג': {
    text: 'מצוין! אני אשלח לך נציג מקצועי שיעזור לך לתכנן את המערכת המושלמת. איך אתה מעדיף ליצור קשר?',
    quickReplies: ['WhatsApp', 'טלפון', 'אימייל', 'אני רוצה לדבר עכשיו']
  },
  'כן, אני מעוניין': {
    text: 'מעולה! אני אשלח לך נציג מקצועי שיעשה איתך ביקור מדידה חינם. איך אתה מעדיף ליצור קשר?',
    quickReplies: ['WhatsApp', 'טלפון', 'אימייל', 'אני רוצה לדבר עכשיו']
  },
  'איך מתקדמים?': {
    text: 'מעולה! כדי להתקדם, אני צריך את הפרטים שלך. איך אתה מעדיף ליצור קשר?',
    quickReplies: ['WhatsApp', 'טלפון', 'אימייל', 'אני רוצה לדבר עכשיו']
  }
};

export function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = botResponses[text as keyof typeof botResponses];
    
    if (response) {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        quickReplies: 'quickReplies' in response ? response.quickReplies : undefined,
        action: 'action' in response ? (response.action as 'redirect' | 'phone' | 'form') : undefined,
        actionData: 'actionData' in response ? response.actionData : undefined
      };

      setMessages(prev => [...prev, botMessage]);
    } else {
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'אני לא בטוח שהבנתי. אתה יכול לנסות שוב או לדבר עם נציג מקצועי שלנו?',
        isBot: true,
        timestamp: new Date(),
        quickReplies: ['אני רוצה לדבר עם נציג', 'אני רוצה הצעת מחיר', 'איזה מצלמות יש לכם?']
      };

      setMessages(prev => [...prev, fallbackMessage]);
    }

    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleAction = (action: string, actionData: any) => {
    if (action === 'phone') {
      window.open(`tel:${actionData.phone}`, '_self');
    } else if (action === 'redirect') {
      window.open(actionData.url, '_blank');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 left-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Aegis Spectra</h3>
                    <p className="text-xs opacity-90">מענה אוטומטי</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.quickReplies && message.quickReplies.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.quickReplies.map((reply, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickReply(reply)}
                              className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1 transition-colors"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                      {message.action && (
                        <Button
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => handleAction(message.action!, message.actionData)}
                        >
                          {message.action === 'phone' && <Phone className="h-3 w-3 mr-1" />}
                          {message.action === 'redirect' && <ArrowRight className="h-3 w-3 mr-1" />}
                          {message.action === 'phone' ? 'התקשר עכשיו' : 'לחץ כאן'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="הקלד הודעה..."
                    className="flex-1 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(inputValue);
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
