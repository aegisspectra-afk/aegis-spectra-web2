'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CheckCircle, Mail, Phone, Calendar, Gift } from 'lucide-react';
import { contactFormSchema } from '@/lib/validate';
import { type ContactFormData } from '@/types/contact-form';
import { toast } from 'sonner';
import { trackFormSubmission, trackLeadGeneration } from '@/lib/analytics';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const selectedService = watch('service');
  const selectedPoints = watch('points');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Send to Google Sheets via Apps Script
      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET,
          name: data.fullName,
          phone: data.phone,
          city: data.city,
          type: data.service,
          points: data.points,
          notes: data.message || '',
          source: 'אתר'
        }),
        mode: 'no-cors'
      });

      // Send confirmation email to customer
      await fetch('/api/email/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lead_confirmation',
          customerData: data,
        }),
      });

      // Since we're using no-cors mode, we can't check response status
      // But we'll assume success if no error is thrown
      
      // Track successful form submission
      trackFormSubmission('Contact Form', true);
      trackLeadGeneration('Contact Form', 0);
      
      // Show success animation
      setSubmittedData(data);
      setShowSuccess(true);
      
      // Hide success after 5 seconds and reset form
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        setSubmittedData(null);
      }, 5000);
      
    } catch (error) {
      // Track failed form submission
      trackFormSubmission('Contact Form', false);
      toast.error('שגיאה בשליחת הטופס. אנא נסה שוב.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showSuccess && submittedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-lg"
          >
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-green-600 mb-2"
                >
                  ✅ הבקשה נשלחה!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  תודה {submittedData.fullName}! קיבלנו את הפרטים שלך ונחזור אליך עד סוף היום.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 text-sm text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>שלחנו לך מייל אישור</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>נחזור אליך בטלפון: {submittedData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>תוך 24 שעות</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <Gift className="h-5 w-5" />
                    <span className="font-semibold">בונוס מיוחד!</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    קבל 10% הנחה על ההזמנה הראשונה שלך
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            שם מלא *
          </label>
          <Input
            id="fullName"
            {...register('fullName')}
            className={errors.fullName ? 'border-destructive' : ''}
            placeholder="הכנס את שמך המלא"
          />
          {errors.fullName && (
            <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            טלפון / WhatsApp *
          </label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
            placeholder="050-123-4567"
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            אימייל (אופציונלי)
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            עיר / אזור *
          </label>
          <Input
            id="city"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
            placeholder="תל אביב, חיפה, ירושלים..."
          />
          {errors.city && (
            <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="service" className="block text-sm font-medium mb-2">
            מה אתה צריך? *
          </label>
          <Select
            value={selectedService}
            onValueChange={(value) => setValue('service', value as any)}
          >
            <SelectTrigger className={errors.service ? 'border-destructive' : ''}>
              <SelectValue placeholder="בחר שירות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cameras">מצלמות אבטחה</SelectItem>
              <SelectItem value="keypad">מערכת קודנים</SelectItem>
              <SelectItem value="alarm">מערכת אזעקה</SelectItem>
              <SelectItem value="combo">חבילה משולבת</SelectItem>
              <SelectItem value="consultation">ייעוץ והתאמה</SelectItem>
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-destructive text-sm mt-1">{errors.service.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium mb-2">
            כמה נקודות משוערות? *
          </label>
          <Select
            value={selectedPoints}
            onValueChange={(value) => setValue('points', value as any)}
          >
            <SelectTrigger className={errors.points ? 'border-destructive' : ''}>
              <SelectValue placeholder="בחר מספר נקודות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 נקודות</SelectItem>
              <SelectItem value="3-4">3-4 נקודות</SelectItem>
              <SelectItem value="5-8">5-8 נקודות</SelectItem>
              <SelectItem value="9+">9+ נקודות</SelectItem>
              <SelectItem value="unknown">לא יודע</SelectItem>
            </SelectContent>
          </Select>
          {errors.points && (
            <p className="text-destructive text-sm mt-1">{errors.points.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          הערות נוספות (אופציונלי)
        </label>
        <Textarea
          id="message"
          {...register('message')}
          className={errors.message ? 'border-destructive' : ''}
          placeholder="ספר לנו על הצרכים שלך, שעות נוחות לביקור, וכל מידע נוסף..."
          rows={4}
        />
        {errors.message && (
          <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="aegis"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            שולח...
          </>
        ) : (
          <>
            <Camera className="h-5 w-5 mr-2" />
            שלח וקבל הצעה עד סוף היום
          </>
        )}
      </Button>
      </form>
    </div>
  );
}