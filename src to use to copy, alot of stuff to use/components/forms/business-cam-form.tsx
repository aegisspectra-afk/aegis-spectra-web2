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
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { trackFormSubmission, trackLeadGeneration } from '@/lib/analytics';
import { z } from 'zod';

const businessCamFormSchema = z.object({
  fullName: z.string().min(2, 'שם מלא נדרש'),
  phone: z.string().min(10, 'מספר טלפון נדרש'),
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  city: z.string().min(2, 'עיר נדרשת'),
  address: z.string().min(5, 'כתובת מפורטת נדרשת'),
  businessName: z.string().min(2, 'שם העסק נדרש'),
  businessType: z.string().min(1, 'בחר סוג עסק'),
  preferredDate: z.string().min(1, 'בחר תאריך מועדף'),
  preferredTime: z.string().min(1, 'בחר שעה מועדפת'),
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'יש לאשר את התנאים'),
});

type BusinessCamFormData = z.infer<typeof businessCamFormSchema>;

interface BusinessCamFormProps {
  onPaymentClick?: () => void;
}

export function BusinessCamForm({ onPaymentClick }: BusinessCamFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<BusinessCamFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BusinessCamFormData>({
    resolver: zodResolver(businessCamFormSchema),
  });

  const selectedDate = watch('preferredDate');
  const selectedTime = watch('preferredTime');
  const selectedBusinessType = watch('businessType');

  const onSubmit = async (data: BusinessCamFormData) => {
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
          businessName: data.businessName,
          businessType: data.businessType,
          type: 'business-cam',
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          notes: data.message || '',
          source: 'business_cam_product_page'
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
          customerData: {
            ...data,
            service: 'business-cam',
            points: '4 נקודות',
          },
        }),
      });

      // Track successful form submission
      trackFormSubmission('Business Cam Product Form', true);
      trackLeadGeneration('Business Cam Product Form', 3490);
      
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
      trackFormSubmission('Business Cam Product Form', false);
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
                  ✅ בקשתך התקבלה!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  תודה {submittedData.fullName}! קיבלנו את בקשתך לחבילת Business Cam.
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
                    <span className="font-semibold">חבילת Business Cam</span>
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 4 מצלמות IP 4MP</li>
                    <li>• NVR 8 ערוצים</li>
                    <li>• דיסק 2TB</li>
                    <li>• אפליקציה בעברית</li>
                    <li>• הדרכה מקצועית</li>
                    <li>• ביקור תחזוקה אחרי 60 יום</li>
                    <li>• אחריות 12 חודשים</li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            פרטי העסק
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium mb-2">
                שם העסק *
              </label>
              <Input
                id="businessName"
                {...register('businessName')}
                className={errors.businessName ? 'border-destructive' : ''}
                placeholder="שם העסק שלך"
              />
              {errors.businessName && (
                <p className="text-destructive text-sm mt-1">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium mb-2">
                סוג העסק *
              </label>
              <Select
                value={selectedBusinessType}
                onValueChange={(value) => setValue('businessType', value as any)}
              >
                <SelectTrigger className={errors.businessType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="בחר סוג עסק" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">משרד</SelectItem>
                  <SelectItem value="store">חנות</SelectItem>
                  <SelectItem value="restaurant">מסעדה</SelectItem>
                  <SelectItem value="warehouse">מחסן</SelectItem>
                  <SelectItem value="clinic">מרפאה</SelectItem>
                  <SelectItem value="gym">מכון כושר</SelectItem>
                  <SelectItem value="other">אחר</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-destructive text-sm mt-1">{errors.businessType.message}</p>
              )}
            </div>
          </div>
        </div>

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
              כתובת העסק *
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

        {/* Installation Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            פרטי התקנה
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                תאריך מועדף *
              </label>
              <Select
                value={selectedDate}
                onValueChange={(value) => setValue('preferredDate', value as any)}
              >
                <SelectTrigger className={errors.preferredDate ? 'border-destructive' : ''}>
                  <SelectValue placeholder="בחר תאריך" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">בהקדם האפשרי</SelectItem>
                  <SelectItem value="this_week">השבוע</SelectItem>
                  <SelectItem value="next_week">השבוע הבא</SelectItem>
                  <SelectItem value="flexible">גמיש</SelectItem>
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
                onValueChange={(value) => setValue('preferredTime', value as any)}
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
              placeholder="ספר לנו על הצרכים של העסק שלך, שעות נוחות להתקנה, וכל מידע נוסף..."
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
              אני מסכים לקבל מידע שיווקי ולקביעת התקנה *
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-destructive text-sm mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
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
                שלח בקשה לקבלת הצעת מחיר
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onPaymentClick}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            רכישה ישירה - ₪3,490
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </form>
    </div>
  );
}