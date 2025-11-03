'use client';

import { useState, useEffect, useMemo } from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { requireFeatureAccess } from '@/lib/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  User,
  Mail,
  Shield,
  Calendar,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { apiAdminListUsers, apiAdminCreateUser, apiAdminUpdateUser, apiMe, apiAdminListRegistrations, apiAdminApproveRegistration, apiAdminRejectRegistration } from '@/lib/api';
import AddUserModal from './AddUserModal';

interface UserData {
  id: number;
  full_name?: string | null;
  email: string;
  role: string;
  is_active: boolean;
  plan: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);

  // איחוד מקור כפול: registrations האמיתיות + משתמשים לא פעילים (fallback אם השרת לא שמר הרשמה)
  const pendingRegs = useMemo(() => {
    const fromRegs = (registrations || [])
      .filter((r:any) => !r.approved && !r.rejected)
      .map((r:any) => ({ ...r, __source: 'reg' }));
    const fromInactiveUsers = (allUsers || [])
      .filter((u:UserData) => !u.is_active)
      .map((u:UserData) => ({ id: u.id, email: u.email, full_name: u.full_name, plan: u.plan, __source: 'user' }));
    // מיזוג לפי אימייל למניעת כפילות
    const byEmail: Record<string, any> = {};
    for (const item of [...fromRegs, ...fromInactiveUsers]) {
      byEmail[(item.email || '').toLowerCase()] = item;
    }
    return Object.values(byEmail);
  }, [registrations, allUsers]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Client-side check using backend JWT (dev-friendly)
      const token = (typeof document !== 'undefined') ? (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/)?.[1] || '') : '';
      if (!token) {
        setHasAccess(false);
        return;
      }
      const me = await apiMe(decodeURIComponent(token));
      const roles = (me.roles || []).map(r => String(r).toUpperCase());
      const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN');
      setHasAccess(isAdmin);
      if (isAdmin) { fetchUsers(); fetchRegistrations(); }
    } catch (error) {
      setHasAccess(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const list = await apiAdminListUsers();
      const mapped: UserData[] = list.map(u => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: (u.role || '').toUpperCase(),
        is_active: u.is_active,
        plan: (u.plan || '').toUpperCase(),
      }));
      // שמור את כל המשתמשים, והצג רק פעילים בטבלת הניהול
      setAllUsers(mapped);
      setUsers(mapped.filter(u => u.is_active));
    } catch (error:any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users', { description: error?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoadingRegs(true);
      const list = await apiAdminListRegistrations();
      setRegistrations(list);
    } catch (e:any) {
      toast.error('Failed to load registrations', { description: e?.message || '' });
    } finally {
      setLoadingRegs(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-red-100 text-red-700">Super Admin</Badge>;
      case 'ADMIN':
        return <Badge className="bg-blue-100 text-blue-700">Admin</Badge>;
      case 'CLIENT':
        return <Badge className="bg-green-100 text-green-700">Client</Badge>;
      case 'EMPLOYEE':
        return <Badge className="bg-yellow-100 text-yellow-700">Employee</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    switch (active ? 'active' : 'inactive') {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', password: '', role: 'CLIENT', plan: 'FREE' });

  const onCreate = async () => {
    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return;
    }
    try {
      setCreating(true);
      await apiAdminCreateUser({
        email: form.email,
        full_name: form.full_name || undefined,
        password: form.password,
        role: form.role,
        plan: form.plan,
      });
      toast.success('User created');
      setForm({ email: '', full_name: '', password: '', role: 'CLIENT', plan: 'FREE' });
      await fetchUsers();
    } catch (e:any) {
      toast.error('Failed to create user', { description: e?.message || '' });
    } finally {
      setCreating(false);
    }
  };

  if (!hasAccess) {
    return (
      <PanelLayout userRole="CLIENT" subscriptionPlan="BASIC">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the Users management section.
            </p>
            <p className="text-sm text-muted-foreground">
              This feature is only available for ADMIN and SUPER_ADMIN users.
            </p>
          </div>
        </div>
      </PanelLayout>
    );
  }

  return (
    <PanelLayout userRole="ADMIN" subscriptionPlan="PRO">
      <div dir="rtl" className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">משתמשים</h1>
            <p className="text-muted-foreground">
              ניהול משתמשים והרשאות
            </p>
          </div>
          <AddUserModal onCreate={onCreate} form={form} setForm={setForm} creating={creating} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-aegis-teal" />
                <div>
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Admins</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role.includes('ADMIN')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">
                    {registrations.filter(r => !r.approved && !r.rejected).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>הרשמות ממתינות</CardTitle>
            <CardDescription>נרשמים חדשים הממתינים לאישור</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRegs ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (<div key={i} className="h-10 bg-muted animate-pulse rounded" />))}
              </div>
            ) : pendingRegs.length === 0 ? (
              <div className="text-sm text-muted-foreground">אין הרשמות ממתינות</div>
            ) : (
              <div className="space-y-3">
                {pendingRegs.map((r) => (
                  <button key={`${r.__source}-${r.id}`} className="w-full text-right p-3 border border-border rounded hover:bg-muted/40" onClick={()=>setSelectedReg(r)}>
                    <div className="font-medium">{r.full_name || '—'} <span className="text-muted-foreground">({r.email})</span></div>
                    <div className="text-xs text-muted-foreground">ארגון: {r.org_name || '—'} • חבילה: {r.plan_choice || r.plan || '—'}</div>
                    {r.notes && <div className="text-xs text-muted-foreground">הערות: {r.notes}</div>}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedReg && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={()=>setSelectedReg(null)}>
            <div className="bg-background border border-border rounded-md p-6 w-full max-w-2xl mx-4" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">פרטי הרשמה</div>
                <Button variant="ghost" size="sm" onClick={()=>setSelectedReg(null)}>סגור</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">שם מלא:</span> {selectedReg.full_name || '—'}</div>
                <div><span className="text-muted-foreground">אימייל:</span> {selectedReg.email}</div>
                <div><span className="text-muted-foreground">ארגון:</span> {selectedReg.org_name || '—'}</div>
                <div><span className="text-muted-foreground">טלפון:</span> {selectedReg.phone || '—'}</div>
                <div><span className="text-muted-foreground">תפקיד:</span> {selectedReg.title || '—'}</div>
                <div><span className="text-muted-foreground">חבילה:</span> {selectedReg.plan_choice || selectedReg.plan || '—'}</div>
                <div className="md:col-span-2"><span className="text-muted-foreground">הערות:</span> {selectedReg.notes || '—'}</div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button variant="ghost" onClick={()=>setSelectedReg(null)}>ביטול</Button>
                {selectedReg.__source === 'reg' ? (
                  <>
                    <Button variant="outline" onClick={async()=>{ await apiAdminRejectRegistration(selectedReg.id); toast.success('נדחה'); setSelectedReg(null); fetchRegistrations(); }}>דחייה</Button>
                    <Button variant="aegis" onClick={async()=>{ await apiAdminApproveRegistration(selectedReg.id); toast.success('אושר'); setSelectedReg(null); fetchRegistrations(); fetchUsers(); }}>אישור</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={()=>setSelectedReg(null)}>סגור</Button>
                    <Button variant="aegis" onClick={async()=>{ await apiAdminUpdateUser(selectedReg.id, { is_active: true }); toast.success('המשתמש הופעל'); setSelectedReg(null); fetchRegistrations(); fetchUsers(); }}>הפעל</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>ניהול משתמשים</CardTitle>
            <CardDescription>
              ניהול משתמשים, תפקידים והרשאות
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">לא נמצאו משתמשים</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'נסה לשנות את תנאי החיפוש' : 'לא נוספו משתמשים עדיין'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-aegis-teal/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-aegis-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.full_name || '—'}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.is_active)}
                        </div>
                        <p className="text-xs text-muted-foreground">חבילה: {user.plan}</p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={()=>apiAdminUpdateUser(user.id, { is_active: !user.is_active }).then(()=>{ toast.success('עודכן'); fetchUsers(); })}>
                            {user.is_active ? 'השבת' : 'הפעל'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{
                            const role = prompt('תפקיד חדש (CLIENT/ADMIN/SUPER_ADMIN):', user.role) || user.role;
                            apiAdminUpdateUser(user.id, { role }).then(()=>{ toast.success('התפקיד הוחלף'); fetchUsers(); }).catch(e=>toast.error('נכשל', {description: e?.message||''}));
                          }}>
                            החלף תפקיד
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{
                            const plan = prompt('חבילה חדשה (FREE/BASIC/PRO/BUSINESS):', user.plan) || user.plan;
                            apiAdminUpdateUser(user.id, { plan }).then(()=>{ toast.success('החבילה הוחלפה'); fetchUsers(); }).catch(e=>toast.error('נכשל', {description: e?.message||''}));
                          }}>
                            החלף חבילה
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={()=>{
                            const pwd = prompt('הגדר סיסמה חדשה:');
                            if (pwd) apiAdminUpdateUser(user.id, { password: pwd }).then(()=>{ toast.success('הסיסמה עודכנה'); }).catch(e=>toast.error('נכשל', {description: e?.message||''}));
                          }}>
                            אפס סיסמה
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PanelLayout>
  );
}