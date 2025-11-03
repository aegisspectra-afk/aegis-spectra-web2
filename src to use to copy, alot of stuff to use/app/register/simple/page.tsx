'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import zxcvbn from 'zxcvbn';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiRegister } from '@/lib/api';

export default function SimpleRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY || '';
  const recaptchaConfigured = Boolean(siteKey);

  const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });
  const router = useRouter();
  const search = useSearchParams();
  const flow = search.get('flow') || 'trial';

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { toast.error('חובה להזין שם'); return false; }
    if (!formData.email.trim()) { toast.error('חובה להזין אימייל'); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { toast.error('נא להזין כתובת אימייל תקינה'); return false; }
    if (formData.password.length < 10) { toast.error('סיסמה חייבת להיות באורך 10 תווים לפחות'); return false; }
    if (passwordScore < 2) { toast.error('הסיסמה חלשה מדי'); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error('הסיסמאות אינן תואמות'); return false; }
    if (!siteKey) { toast.error('תצורת reCAPTCHA חסרה בצד הלקוח'); return false; }
    if (!recaptchaToken) { toast.error('אנא אמתו את עצמכם ב-reCAPTCHA'); return false; }
    if (!formData.agreeToTerms) { toast.error('יש לאשר את תנאי השירות ומדיניות הפרטיות'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await apiRegister({
        email: formData.email,
        full_name: formData.name,
        password: formData.password,
        recaptcha_token: recaptchaToken || undefined,
      });
      toast.success('ההרשמה התקבלה', { description: 'בדיקה מהירה — המתנה לאישור.' });
      router.push('/login?message=pending-approval');
    } catch (error: any) {
      toast.error('ההרשמה נכשלה', { description: error.message || 'אנא נסו שוב מאוחר יותר.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-10">
        <div className="max-w-md mx-auto">
          <div className="mb-3 flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>חזור</Button>
            <Button variant="ghost" onClick={() => router.push('/')}>לדף הבית</Button>
          </div>
          <Card className="shadow-xl border border-white/10 bg-gradient-to-b from-background to-muted/30">
            <CardHeader className="text-center py-4">
              <CardTitle className="text-xl font-heading">
                <span className="gradient-text">{flow === 'personal' ? 'משתמש פרטי' : 'ניסיון חינמי'}</span>
              </CardTitle>
              <CardDescription className="text-sm">
                {flow === 'personal' ? 'הרשמה מהירה לשימוש פרטי' : 'הרשמה מהירה להתחלה'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> התחלה מיידית</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> ללא התחייבות</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> אפשרות שדרוג בהמשך</div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" type="text" autoComplete="name" placeholder="הזן/י שם מלא" className="pl-10" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" autoComplete="email" placeholder="הזן/י אימייל" className="pl-10" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="יצירת סיסמה" className="pl-10 pr-10" value={formData.password} onChange={(e) => { handleInputChange('password', e.target.value); setPasswordScore(zxcvbn(e.target.value).score); }} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  <div className="h-2 w-full rounded bg-muted overflow-hidden">
                    <div className={`h-2 ${passwordScore >= 3 ? 'bg-green-500' : passwordScore === 2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(passwordScore + 1) * 20}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="אישור סיסמה" className="pl-10 pr-10" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {recaptchaConfigured ? (
                    <ReCAPTCHA sitekey={siteKey} onChange={(token) => setRecaptchaToken(token)} />
                  ) : (
                    <div className="text-sm text-red-500">חסר מפתח reCAPTCHA בצד לקוח.</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input id="terms" type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)} />
                  <Label htmlFor="terms" className="text-sm">אני מאשר/ת את <Link href="/terms" className="text-aegis-teal hover:underline">תנאי השירות</Link> ו־<Link href="/privacy" className="text-aegis-teal hover:underline">מדיניות הפרטיות</Link></Label>
                </div>
                <Button type="submit" className="w-full" variant="aegis" size="lg" disabled={isLoading || !formData.agreeToTerms || !recaptchaConfigured}>
                  {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />יוצר חשבון...</>) : (<>יצירת חשבון<ArrowRight className="ml-2 h-4 w-4" /></>)}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}


