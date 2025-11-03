'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiLogin, apiResendVerification } from '@/lib/api';
import { saveToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { access_token } = await apiLogin(normalizedEmail, password.trim());
      saveToken(access_token);
      
      toast.success('ברוכים הבאים!', { description: 'מעבירים ללוח הבקרה...' });
      // Hard navigation to ensure middleware sees cookie immediately
      if (typeof window !== 'undefined') window.location.href = '/panel';
    } catch (error: any) {
      let description = 'אנא בדקו את כתובת האימייל והסיסמא.';
      if (typeof error?.message === 'string') {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed?.detail) description = parsed.detail;
          // Detect unverified email from backend (403)
          if (parsed?.status === 403 && /email/i.test(String(parsed.detail))) {
            setEmailUnverified(true);
          } else {
            setEmailUnverified(false);
          }
        } catch {}
      }
      toast.error('התחברות נכשלה', { description });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setIsResending(true);
    try {
      await apiResendVerification(normalizedEmail);
      toast.success('קישור אימות נשלח שוב');
      router.push(`/register/status?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (e: any) {
      toast.error('שליחה נכשלה', { description: e?.message || '' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading" style={{color: '#F5F5F5'}}>
                ברוכים הבאים
              </CardTitle>
              <CardDescription style={{color: '#E0E0E0'}}>
                התחברו לחשבון Aegis Spectra שלכם
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium" style={{color: '#E0E0E0'}}>אימייל</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="הזינו את כתובת האימייל שלכם"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium" style={{color: '#E0E0E0'}}>סיסמא</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="הזינו את הסיסמא שלכם"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>זכור אותי</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm hover:underline" style={{color: '#1A73E8'}}>
                    שכחתם סיסמא?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="aegis" 
                  size="lg"
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#1A73E8 !important',
                    color: '#FFFFFF !important',
                    border: '2px solid #1A73E8 !important'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    <>
                      התחבר
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {emailUnverified && (
                <div className="rounded-md border border-yellow-600/40 bg-yellow-600/10 p-3 text-sm">
                  האימייל שלך לא מאומת. <button type="button" onClick={handleResend} className="underline ml-2" disabled={isResending}>{isResending ? 'שולח...' : 'שלח שוב קישור אימות'}</button>
                </div>
              )}

              <div className="border-t border-border"></div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground" style={{color: '#A0A0A0'}}>
                  אין לכם חשבון?{' '}
                  <Link href="/register" className="hover:underline" style={{color: '#1A73E8'}}>
                    צרו חשבון חדש
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}