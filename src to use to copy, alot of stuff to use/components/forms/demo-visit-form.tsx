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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Camera, 
  CheckCircle, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Clock,
  User,
  Building,
  CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import { trackFormSubmission, trackLeadGeneration } from '@/lib/analytics';
import { z } from 'zod';

const demoFormSchema = z.object({
  fullName: z.string().min(2, 'שם מלא נדרש'),
  phone: z.string().min(10, 'מספר טלפון נדרש'),
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  city: z.string().min(2, 'עיר נדרשת'),
  address: z.string().min(5, 'כתובת מפורטת נדרשת'),
  service: z.string().min(1, 'בחר שירות'),
  points: z.string().min(1, 'בחר מספר נקודות'),
  preferredDate: z.string().min(1, 'בחר תאריך מועדף'),
  preferredTime: z.string().min(1, 'בחר שעה מועדפת'),
  propertyType: z.string().min(1, 'בחר סוג נכס'),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'יש לאשר את התנאים'),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export function DemoVisitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<DemoFormData | null>(null);

  // Generate real dates for the next 14 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const dateString = date.toISOString().split('T')[0];
        const formattedDate = date.toLocaleDateString('he-IL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        dates.push({ value: dateString, label: formattedDate });
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
  });

  const selectedService = watch('service');
  const selectedPoints = watch('points');
  const selectedDate = watch('preferredDate');
  const selectedTime = watch('preferredTime');
  const selectedPropertyType = watch('propertyType');

  const onSubmit = async (data: DemoFormData) => {
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
          email: data.email || '',
          city: data.city,
          address: data.address,
          type: data.service,
          points: data.points,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          propertyType: data.propertyType,
          notes: data.message || '',
          source: 'demo_visit'
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
          type: 'demo_confirmation',
          customerData: data,
        }),
      });

      // Track successful form submission
      trackFormSubmission('Demo Visit Form', true);
      trackLeadGeneration('Demo Visit Form', 0);
      
      // Show success animation
      setSubmittedData(data);
      setShowSuccess(true);
      
      // Hide success after 8 seconds and reset form
      setTimeout(() => {
        setShowSuccess(false);
        reset();
        setSubmittedData(null);
      }, 8000);
      
    } catch (error) {
      // Track failed form submission
      trackFormSubmission('Demo Visit Form', false);
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
            <Card className="w-full max-w-lg mx-4">
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
                  ✅ ביקור המדידה נקבע!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  תודה {submittedData.fullName}! קיבלנו את בקשתך לביקור מדידה.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 text-sm text-muted-foreground mb-6"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>שלחנו לך מייל אישור עם כל הפרטים</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>נחזור אליך בטלפון: {submittedData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>תאריך מועדף: {submittedData.preferredDate}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>שעה מועדפת: {submittedData.preferredTime}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                    <Camera className="h-5 w-5" />
                    <span className="font-semibold">מה כולל ביקור המדידה?</span>
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• בדיקת מיקומים אופטימליים למצלמות</li>
                    <li>• הערכת צרכי האבטחה שלך</li>
                    <li>• הצעת מחיר מפורטת ומדויקת</li>
                    <li>• ייעוץ מקצועי ללא התחייבות</li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            פרטים אישיים
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              כתובת מפורטת *
            </label>
            <Input
              id="address"
              {...register('address')}
              className={errors.address ? 'border-destructive' : ''}
              placeholder="רחוב, מספר בית, דירה..."
            />
            {errors.address && (
              <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Service Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5" />
            פרטי השירות
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium mb-2">
                מה אתה צריך? *
              </label>
              <Select
                value={selectedService}
                onValueChange={(value: string) => setValue('service', value as any)}
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
            <label htmlFor="propertyType" className="block text-sm font-medium mb-2">
              סוג הנכס *
            </label>
            <Select
              value={selectedPropertyType}
                onValueChange={(value: string) => setValue('propertyType', value as any)}
            >
              <SelectTrigger className={errors.propertyType ? 'border-destructive' : ''}>
                <SelectValue placeholder="בחר סוג נכס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">דירה</SelectItem>
                <SelectItem value="house">בית פרטי</SelectItem>
                <SelectItem value="office">משרד</SelectItem>
                <SelectItem value="store">חנות</SelectItem>
                <SelectItem value="warehouse">מחסן</SelectItem>
                <SelectItem value="other">אחר</SelectItem>
              </SelectContent>
            </Select>
            {errors.propertyType && (
              <p className="text-destructive text-sm mt-1">{errors.propertyType.message}</p>
            )}
          </div>
        </div>

        {/* Visit Scheduling */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            קביעת ביקור
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                תאריך מועדף *
              </label>
              <Select
                value={selectedDate}
                onValueChange={(value: string) => setValue('preferredDate', value as any)}
              >
                <SelectTrigger className={errors.preferredDate ? 'border-destructive' : ''}>
                  <SelectValue placeholder="בחר תאריך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">בהקדם האפשרי</SelectItem>
                  {availableDates.map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="flexible">גמיש - נחזור אליך</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredDate && (
                <p className="text-destructive text-sm mt-1">{errors.preferredDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium mb-2">
                שעה מועדפת *
              </label>
              <Select
                value={selectedTime}
                onValueChange={(value: string) => setValue('preferredTime', value as any)}
              >
                <SelectTrigger className={errors.preferredTime ? 'border-destructive' : ''}>
                  <SelectValue placeholder="בחר שעה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">בוקר (8:00-12:00)</SelectItem>
                  <SelectItem value="afternoon">צהריים (12:00-16:00)</SelectItem>
                  <SelectItem value="evening">ערב (16:00-20:00)</SelectItem>
                  <SelectItem value="flexible">גמיש</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredTime && (
                <p className="text-destructive text-sm mt-1">{errors.preferredTime.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">מידע נוסף</h3>
          
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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              {...register('agreeToTerms')}
            />
            <label htmlFor="agreeToTerms" className="text-sm">
              אני מסכים לקבל מידע שיווקי ולקביעת ביקור מדידה *
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-destructive text-sm mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="aegis"
          size="lg"
          className="w-full cta-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              שולח...
            </>
          ) : (
            <>
              <CalendarDays className="h-5 w-5 mr-2" />
              הזמן ביקור מדידה חינם
            </>
          )}
        </Button>
      </form>
    </div>
  );
}