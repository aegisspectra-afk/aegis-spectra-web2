'use client';

import { useState } from 'react';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiCreateReport } from '@/lib/api';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      await apiCreateReport('/reports/demo.pdf', 'pdf');
      toast.success('דוח נוצר (דמו)');
    } catch (e: any) {
      toast.error('יצירת דוח נכשלה', { description: e?.message || '' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>דוחות</CardTitle>
              <CardDescription>יצירת דוחות ודפדוף בתוצאות (דמו)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="aegis" onClick={generate} disabled={generating}>
                {generating ? 'מייצר...' : 'צור דוח PDF (דמו)'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}

'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReportGenerator } from '@/components/reports/report-generator';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Section } from '@/components/common/section';

function ReportsContent() {
  return (
    <PanelLayout userRole="admin" subscriptionPlan="enterprise">
      <Section className="py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate comprehensive reports and analyze your security system performance
            </p>
          </div>
          
          <ReportGenerator />
        </div>
      </Section>
    </PanelLayout>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}