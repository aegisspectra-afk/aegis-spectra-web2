'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface Props {
  form: { email: string; full_name: string; password: string; role: string; plan: string; account_type?: string };
  setForm: (f: { email: string; full_name: string; password: string; role: string; plan: string; account_type?: string }) => void;
  creating: boolean;
  onCreate: () => Promise<void> | void;
}

export default function AddUserModal({ form, setForm, creating, onCreate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="aegis" className="flex items-center" onClick={()=>setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        הוסף משתמש
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={()=>setOpen(false)}>
          <div className="bg-background border border-border rounded-md p-6 w-full max-w-lg mx-4" onClick={e=>e.stopPropagation()}>
            <div className="text-lg font-semibold mb-4">יצירת משתמש</div>
            <div className="space-y-3">
              <Input placeholder="אימייל" value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} />
              <Input placeholder="שם מלא" value={form.full_name} onChange={e=>setForm({ ...form, full_name: e.target.value })} />
              <Input placeholder="סיסמה" type="password" value={form.password} onChange={e=>setForm({ ...form, password: e.target.value })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs mb-1 text-muted-foreground">סוג חשבון</div>
                  <Select value={form.account_type || 'PRIVATE'} onValueChange={(v)=>setForm({ ...form, account_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג חשבון" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE">משתמש פרטי</SelectItem>
                      <SelectItem value="BUSINESS">משתמש עסקי</SelectItem>
                      <SelectItem value="ORGANIZATION">ארגון/חברה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs mb-1 text-muted-foreground">חבילה</div>
                  <Select value={form.plan} onValueChange={(v)=>setForm({ ...form, plan: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר חבילה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="BASIC">BASIC</SelectItem>
                      <SelectItem value="PRO">PRO</SelectItem>
                      <SelectItem value="BUSINESS">BUSINESS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1 text-muted-foreground">תפקיד</div>
                <Select value={form.role} onValueChange={(v)=>setForm({ ...form, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תפקיד" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">לקוח (Client)</SelectItem>
                    <SelectItem value="ADMIN">מנהל מערכת (Admin)</SelectItem>
                    <SelectItem value="SUPER_ADMIN">סופר אדמין</SelectItem>
                    <SelectItem value="CEO">מנכ"ל (CEO)</SelectItem>
                    <SelectItem value="CTO">סמנכ"ל טכנולוגיות (CTO)</SelectItem>
                    <SelectItem value="COO">סמנכ"ל תפעול (COO)</SelectItem>
                    <SelectItem value="CFO">סמנכ"ל כספים (CFO)</SelectItem>
                    <SelectItem value="CMO">מנהל שיווק (CMO)</SelectItem>
                    <SelectItem value="CYBER_DIRECTOR">Cyber Defense Director</SelectItem>
                    <SelectItem value="SOC_L1">SOC Analyst L1</SelectItem>
                    <SelectItem value="SOC_L2">SOC Analyst L2</SelectItem>
                    <SelectItem value="SOC_L3">SOC Analyst L3</SelectItem>
                    <SelectItem value="IR_SPECIALIST">Incident Response Specialist</SelectItem>
                    <SelectItem value="TI_RESEARCHER">Threat Intelligence Researcher</SelectItem>
                    <SelectItem value="AI_SECURITY_ENGINEER">AI Security Engineer</SelectItem>
                    <SelectItem value="RED_TEAM">Red Team / Pentester</SelectItem>
                    <SelectItem value="SYSTEM_SECURITY_ENGINEER">System Security Engineer</SelectItem>
                    <SelectItem value="PHYSICAL_SECURITY_MANAGER">מנהל תחום מיגון ובקרה</SelectItem>
                    <SelectItem value="INSTALLATION_TECH_LEAD">טכנאי התקנה בכיר</SelectItem>
                    <SelectItem value="FIELD_TECH">טכנאי שטח / Patrol</SelectItem>
                    <SelectItem value="CCTV_PLANNER">מתכנן CCTV & Access Control</SelectItem>
                    <SelectItem value="LOGISTICS_MANAGER">אחראי לוגיסטיקה ומחסן</SelectItem>
                    <SelectItem value="FULLSTACK">Full‑Stack Developer</SelectItem>
                    <SelectItem value="BACKEND">Backend Engineer (Python)</SelectItem>
                    <SelectItem value="FRONTEND">Frontend Engineer (React)</SelectItem>
                    <SelectItem value="DEVOPS">DevOps Engineer</SelectItem>
                    <SelectItem value="RUST_SECURITY">Rust Security Developer</SelectItem>
                    <SelectItem value="QA_AUTOMATION">QA & Automation Engineer</SelectItem>
                    <SelectItem value="SUPPORT_MANAGER">Customer Support Manager</SelectItem>
                    <SelectItem value="TECH_SUPPORT">Technical Support Engineer</SelectItem>
                    <SelectItem value="CSM">Client Success Manager</SelectItem>
                    <SelectItem value="INSTALLATION_COORDINATOR">Installation Coordinator</SelectItem>
                    <SelectItem value="SALES_MANAGER">Sales Manager (B2B/B2C)</SelectItem>
                    <SelectItem value="ACCOUNT_EXEC">Account Executive</SelectItem>
                    <SelectItem value="MARKETING_SPECIALIST">Marketing Specialist / Content</SelectItem>
                    <SelectItem value="PARTNERSHIP_MANAGER">Partnership Manager</SelectItem>
                    <SelectItem value="OPERATIONS_MANAGER">Operations Manager</SelectItem>
                    <SelectItem value="PROCUREMENT">Procurement & Supplier Relations</SelectItem>
                    <SelectItem value="LEGAL_COMPLIANCE">Legal & Compliance Officer</SelectItem>
                    <SelectItem value="HR_MANAGER">HR Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-5">
              <Button variant="ghost" onClick={()=>setOpen(false)}>ביטול</Button>
              <Button variant="aegis" onClick={async()=>{ await onCreate(); if (!creating) setOpen(false); }} disabled={creating}>
                {creating ? 'יוצר...' : 'צור'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

