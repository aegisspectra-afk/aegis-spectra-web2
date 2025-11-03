'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiListLicenses, apiCreateLicense } from '@/lib/api';
import { toast } from 'sonner';

type License = { id: number; key: string; plan: string; status: string };

export default function LicensesSettingsPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const list = await apiListLicenses();
      setLicenses(list);
    } catch (e: any) {
      toast.error('טעינת רישיונות נכשלה', { description: e?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (plan: string) => {
    setCreating(true);
    try {
      await apiCreateLicense(plan);
      toast.success('נוצר רישיון חדש');
      await load();
    } catch (e: any) {
      toast.error('יצירת רישיון נכשלה', { description: e?.message || '' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background">
      <Section className="py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>רישיונות</CardTitle>
              <CardDescription>ניהול מפתחות רישוי ותוכנית פעילה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="aegis" onClick={() => create('PRO')} disabled={creating}>צור רישיון PRO</Button>
                <Button variant="outline" onClick={() => create('BUSINESS')} disabled={creating}>צור רישיון BUSINESS</Button>
              </div>
              <div className="border-t border-border" />
              {loading ? (
                <p className="text-sm text-muted-foreground">טוען...</p>
              ) : licenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">אין רישיונות עדיין.</p>
              ) : (
                <ul className="space-y-2">
                  {licenses.map(l => (
                    <li key={l.id} className="p-3 rounded border border-border flex items-center justify-between">
                      <div>
                        <div className="font-mono text-sm">{l.key}</div>
                        <div className="text-xs text-muted-foreground">{l.plan} • {l.status}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(l.key)}>העתק</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}


