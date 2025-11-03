'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    
    try {
      // Send to Google Sheets via Apps Script
      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET,
          name: 'Newsletter Subscriber',
          phone: '',
          city: 'לא צוין',
          type: 'newsletter',
          points: 'לא רלוונטי',
          notes: `Email: ${data.email}`,
          source: 'newsletter'
        }),
        mode: 'no-cors'
      });

      // Since we're using no-cors mode, we can't check response status
      // But we'll assume success if no error is thrown
      
      toast.success('✅ נרשמת בהצלחה לניוזלטר!', {
        description: 'תקבל עדכונים על השירותים והטיפים החדשים שלנו.',
      });
      
      reset();
    } catch (error) {
      toast.error('שגיאה ברישום לניוזלטר', {
        description: 'אנא נסה שוב מאוחר יותר או צור קשר איתנו ישירות.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        variant="aegis"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe to Newsletter'
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}