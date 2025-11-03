'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiResendVerification } from '@/lib/api';
import { toast } from 'sonner';

export default function RegistrationStatusPage() {
  const params = useSearchParams();
  const email = params.get('email') || '';
  const [isSending, setIsSending] = useState(false);

  const resend = async () => {
    if (!email) {
      toast.error('חסר אימייל לבקשה');
      return;
    }
    setIsSending(true);
    try {
      await apiResendVerification(email);
      toast.success('קישור אימות נשלח שוב');
    } catch (e: any) {
      toast.error('שליחה נכשלה', { description: e?.message || '' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-16">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>ההרשמה ממתינה</CardTitle>
              <CardDescription>
                החשבון ממתין לאימות אימייל ולאישור מ־Aegis Spectra.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                שלחנו קישור אימות ל־{email || 'האימייל שלך'}.
              </p>
              <Button onClick={resend} disabled={isSending} variant="aegis">
                {isSending ? 'שולח...' : 'שלח שוב קישור אימות'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}


