'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Shield, 
  Camera, 
  BarChart3, 
  Users, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function DemoMode() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateDemo = async () => {
    setIsCreating(true);
    
    try {
      // Simulate demo creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Demo environment created successfully!');
      
      // Redirect to demo dashboard
      router.push('/panel?demo=true');
      
    } catch (error) {
      toast.error('Failed to create demo environment');
    } finally {
      setIsCreating(false);
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'בדיקת מיקום מצלמות',
      description: 'נבדוק את המיקומים הטובים ביותר למצלמות אבטחה'
    },
    {
      icon: BarChart3,
      title: 'הצעת מחיר מדויקת',
      description: 'נכין לך הצעת מחיר מפורטת ומדויקת'
    },
    {
      icon: Users,
      title: 'ייעוץ מקצועי',
      description: 'נעזור לך לבחור את הפתרון המתאים ביותר'
    },
    {
      icon: FileText,
      title: 'תכנון מפורט',
      description: 'נכין תכנית התקנה מפורטת עם לוח זמנים'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16" dir="rtl">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          <Play className="h-3 w-3 mr-1" />
          תיאום ביקור מדידה
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
          <span className="gradient-text">ביקור מדידה חינם</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          מומחה שלנו יגיע אליך לביקור מדידה חינם (30–45 דק', ללא התחייבות), 
          יבדוק את הצרכים שלך וייתן לך הצעת מחיר מדויקת ומקצועית.
        </p>

        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>30-45 דקות</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span>ללא התחייבות</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>חינם לחלוטין</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Demo Features */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-8">
            מה נבדוק בביקור?
          </h2>
          
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-aegis-teal/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-aegis-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Demo CTA */}
        <div>
          <Card className="border-aegis-teal/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-aegis-teal" />
                תיאום ביקור מדידה
              </CardTitle>
              <CardDescription>
                מלא את הפרטים ונחזור אליך תוך 24 שעות לתיאום ביקור
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>ביקור חינם ללא התחייבות</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>הצעת מחיר מדויקת</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>ייעוץ מקצועי חינם</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>תכנון מפורט</span>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/contact?service=consultation'}
                variant="aegis" 
                size="lg" 
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                תיאום ביקור מדידה
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                נחזור אליך תוך 24 שעות לתיאום ביקור נוח
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Data Preview */}
      <div className="bg-muted/30 rounded-lg p-8">
        <h3 className="text-xl font-heading font-semibold mb-4 text-center">
          למה לצפות בביקור?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-aegis-teal mb-1">30-45</div>
            <div className="text-sm text-muted-foreground">דקות ביקור</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-aegis-teal mb-1">100%</div>
            <div className="text-sm text-muted-foreground">חינם</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-aegis-teal mb-1">24</div>
            <div className="text-sm text-muted-foreground">שעות תגובה</div>
          </div>
        </div>
      </div>
    </div>
  );
}