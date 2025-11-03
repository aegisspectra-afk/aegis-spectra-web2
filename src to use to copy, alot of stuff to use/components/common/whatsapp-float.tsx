'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-3">
        {/* WhatsApp Button */}
        <Button
          asChild
          size="lg"
          className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg animate-pulse"
        >
          <a
            href="https://wa.me/972559737025?text=שלום, אני מעוניין בהצעת מחיר למערכת אבטחה"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            title="צור קשר ב-WhatsApp"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </a>
        </Button>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0 bg-gray-200 hover:bg-gray-300"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}