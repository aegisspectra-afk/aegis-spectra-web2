'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Building2, Phone, Briefcase, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';
import zxcvbn from 'zxcvbn';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiRegister } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Sparkles, Rocket, UserCircle2, Building2 as BuildingIcon, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    orgName: '',
    phone: '',
    title: '',
    notes: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const [passwordHint, setPasswordHint] = useState<string>('');
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY || '';
  const recaptchaConfigured = Boolean(siteKey);

  const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const evaluatePassword = (pwd: string) => {
    const result = zxcvbn(pwd);
    setPasswordScore(result.score);
    setPasswordHint(result.feedback.warning || result.feedback.suggestions[0] || '');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-=';
    let pwd = '';
    for (let i = 0; i < 14; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    handleInputChange('password', pwd);
    handleInputChange('confirmPassword', pwd);
    evaluatePassword(pwd);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('חובה להזין שם');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('חובה להזין אימייל');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('נא להזין כתובת אימייל תקינה');
      return false;
    }
    if (formData.password.length < 10) {
      toast.error('סיסמה חייבת להיות באורך 10 תווים לפחות');
      return false;
    }
    if (passwordScore < 3) {
      toast.error('הסיסמה חלשה מדי. נסו סיסמה חזקה יותר.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('הסיסמאות אינן תואמות');
      return false;
    }
    if (recaptchaConfigured && !recaptchaToken) {
      toast.error('אנא אמתו את עצמכם ב-reCAPTCHA');
      return false;
    }
    if (!formData.agreeToTerms) {
      toast.error('יש לאשר את תנאי השירות ומדיניות הפרטיות');
      return false;
    }
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
        org_name: formData.orgName || undefined,
        phone: formData.phone || undefined,
        title: formData.title || undefined,
        notes: formData.notes || undefined,
        recaptcha_token: recaptchaToken || undefined,
      });

      toast.success('ההרשמה התקבלה', {
        description: 'הבקשה נשלחה לאישור Aegis Spectra. תקבלו מייל כשיתעדכן.',
      });

      // Redirect to login page
      router.push('/login?message=pending-approval');
    } catch (error: any) {
      toast.error('ההרשמה נכשלה', {
        description: error.message || 'אנא נסו שוב מאוחר יותר.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-20">
        <div className="max-w-md mx-auto">
          <Card className="shadow-2xl border border-white/10 bg-gradient-to-b from-background to-muted/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">
                <span className="gradient-text">בחירת סוג הרשמה</span>
              </CardTitle>
              <CardDescription>
                בחרו בין ניסיון חינמי להרשמה מלאה לארגונים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <RegisterSwitcher />
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}

function RegisterSwitcher() {
  const router = useRouter();
  const [active, setActive] = useState<'trial' | 'personal' | 'business' | 'full'>('trial');

  const go = () => {
    switch (active) {
      case 'trial':
        router.push('/register/simple?flow=trial');
        break;
      case 'personal':
        router.push('/register/simple?flow=personal');
        break;
      case 'business':
        router.push('/register/full?flow=business');
        break;
      case 'full':
        router.push('/register/full?flow=org');
        break;
    }
  };

  const items: { key: typeof active; label: string; desc: string; icon: any }[] = [
    { key: 'trial', label: 'ניסיון חינמי (מהר)', desc: 'התחלה זריזה ללא התחייבות', icon: Rocket },
    { key: 'personal', label: 'משתמש פרטי', desc: 'מתאים לשימוש ביתי/פרטי', icon: UserCircle2 },
    { key: 'business', label: 'משתמש עסקי', desc: 'עסקים קטנים ובינוניים', icon: BuildingIcon },
    { key: 'full', label: 'הרשמה מלאה לארגונים', desc: 'ארגונים עם פרטים מורחבים', icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>חזור</Button>
          <Button variant="ghost" onClick={() => router.push('/')}>לדף הבית</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          const selected = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setActive(it.key)}
              className={cn(
                'group relative rounded-xl border p-4 text-left transition-all bg-gradient-to-b',
                'from-background to-muted/30 hover:to-muted/50',
                selected ? 'border-primary ring-2 ring-primary/30 shadow-lg' : 'border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center transition-colors', selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-heading font-semibold">{it.label}</div>
                  <div className="text-sm text-muted-foreground">{it.desc}</div>
                </div>
              </div>
              {selected && (
                <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1" onClick={go}>המשך</Button>
        <Button size="lg" variant="outline" className="flex-1" onClick={() => router.push('/pricing')}>ראה מחירים</Button>
      </div>
    </div>
  );
}

export function FullRegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const flow = search.get('flow') || 'org';
  const title = flow === 'business' ? 'משתמש עסקי' : 'הרשמה מלאה לארגונים';
  const desc = flow === 'business' ? 'עסקים קטנים ובינוניים' : 'ארגונים עם פרטים מורחבים';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    orgName: '',
    phone: '',
    title: '',
    notes: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const [passwordHint, setPasswordHint] = useState<string>('');
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY || '';
  const recaptchaConfigured = Boolean(siteKey);

  const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const evaluatePassword = (pwd: string) => {
    const result = zxcvbn(pwd);
    setPasswordScore(result.score);
    setPasswordHint(result.feedback.warning || result.feedback.suggestions[0] || '');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()_+-=';
    let pwd = '';
    for (let i = 0; i < 14; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    handleInputChange('password', pwd);
    handleInputChange('confirmPassword', pwd);
    evaluatePassword(pwd);
  };

  const validateForm = () => {
    if (!formData.name.trim()) { toast.error('חובה להזין שם'); return false; }
    if (!formData.email.trim()) { toast.error('חובה להזין אימייל'); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { toast.error('נא להזין כתובת אימייל תקינה'); return false; }
    if (formData.password.length < 10) { toast.error('סיסמה חייבת להיות באורך 10 תווים לפחות'); return false; }
    if (passwordScore < 3) { toast.error('הסיסמה חלשה מדי. נסו סיסמה חזקה יותר.'); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error('הסיסמאות אינן תואמות'); return false; }
    if (recaptchaConfigured && !recaptchaToken) { toast.error('אנא אמתו את עצמכם ב-reCAPTCHA'); return false; }
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
        org_name: formData.orgName || undefined,
        phone: formData.phone || undefined,
        title: formData.title || undefined,
        notes: formData.notes || undefined,
        recaptcha_token: recaptchaToken || undefined,
      });
      toast.success('ההרשמה התקבלה', { description: 'הבקשה נשלחה לאישור Aegis Spectra. תקבלו מייל כשיתעדכן.' });
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
          <Card className="shadow-xl border border-white/10 bg-gradient-to-b from-background to-muted/30">
            <CardHeader className="text-center py-4">
              <CardTitle className="text-xl font-heading">
                <span className="gradient-text">{title}</span>
              </CardTitle>
              <CardDescription className="text-sm">{desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> רישום טננט ייעודי</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> פרטי ארגון מורחבים</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Check className="h-4 w-4 text-green-500" /> אפשרות דומיין ארגוני</div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="הזן/י שם מלא"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org">ארגון/חברה</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="org"
                      type="text"
                      autoComplete="organization"
                      placeholder="שם ארגון/חברה"
                      className="pl-10"
                      value={formData.orgName}
                      onChange={(e) => handleInputChange('orgName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="phone"
                        type="tel"
                      autoComplete="tel"
                      placeholder="נייד / משרד"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">תפקיד</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="title"
                        type="text"
                      autoComplete="organization-title"
                      placeholder="לדוגמה: מנהל/ת IT"
                        className="pl-10"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">הערות (לא חובה)</Label>
                  <Input
                    id="notes"
                    type="text"
                    placeholder="פרטים חשובים לתהליך ההצטרפות"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="הזן/י אימייל"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="יצירת סיסמה"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => { handleInputChange('password', e.target.value); evaluatePassword(e.target.value); }}
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
                  <div className="flex items-center justify-between mt-1">
                    <div className="h-2 w-40 rounded bg-muted overflow-hidden">
                      <div className={`h-2 ${passwordScore >= 3 ? 'bg-green-500' : passwordScore === 2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(passwordScore + 1) * 20}%` }} />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                      <RefreshCw className="h-4 w-4 mr-1" /> צור סיסמה
                    </Button>
                  </div>
                  {passwordHint && (
                    <p className="text-xs text-muted-foreground mt-1">{passwordHint}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אישור סיסמה</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="אישור סיסמה"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {recaptchaConfigured && (
                    <ReCAPTCHA sitekey={siteKey} onChange={(token) => setRecaptchaToken(token)} />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    אני מאשר/ת את{' '}
                    <Link href="/terms" className="text-aegis-teal hover:underline">
                      תנאי השירות
                    </Link>{' '}
                    ו־{' '}
                    <Link href="/privacy" className="text-aegis-teal hover:underline">
                      מדיניות הפרטיות
                    </Link>
                  </Label>
                </div>
                {!formData.agreeToTerms && (
                  <div className="text-xs text-red-500">יש לאשר את תנאי השירות ומדיניות הפרטיות כדי להמשיך</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="aegis" 
                  size="lg"
                  disabled={isLoading || !formData.agreeToTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      יוצר חשבון...
                    </>
                  ) : (
                    <>
                      יצירת חשבון
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="border-t border-border"></div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  כבר יש לכם חשבון?{' '}
                  <Link href="/login" className="text-aegis-teal hover:underline">
                    התחברו
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