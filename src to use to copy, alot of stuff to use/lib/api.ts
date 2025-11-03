export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
console.log('API_URL loaded:', API_URL);
console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('All env vars:', process.env);

function getJwtFromBrowserCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )spectra_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiRegister(payload: { email: string; full_name?: string; password: string; org_name?: string; phone?: string; title?: string; notes?: string; recaptcha_token?: string }) {
  console.log('API_URL:', API_URL);
  console.log('Payload:', payload);
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log('Response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Error response:', errorText);
    throw new Error(errorText);
  }
  return res.json();
}

export async function apiLogin(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('apiLogin failed', res.status, text);
    try {
      const parsed = JSON.parse(text);
      throw new Error(JSON.stringify({ status: res.status, detail: parsed.detail || text }));
    } catch {
      throw new Error(JSON.stringify({ status: res.status, detail: text || 'Login failed' }));
    }
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function apiMe(token: string) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ id: number; email: string; full_name?: string; roles: string[]; tenants: number[] }>;
}

export async function apiResendVerification(email: string) {
  const res = await fetch(`${API_URL}/auth/email/resend?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ message: string }>;
}

// SaaS APIs
export async function apiListLicenses() {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/licenses`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Array<{ id: number; key: string; plan: string; status: string }>>;
}

export async function apiCreateLicense(plan: string) {
  const res = await fetch(`${API_URL}/api/licenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiListScans() {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/scans`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGetScan(id: number) {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/scans/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDeleteScan(id: number) {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/scans/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiCreateScan(data: { scan_type: string; result: any; risk_score?: number }) {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/scans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiCreatePayment(amount: number, plan: string, method = 'paypal') {
  const res = await fetch(`${API_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, plan, method }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiCreateReport(path: string, format = 'pdf') {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ path, format }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAgentLatest() {
  const res = await fetch(`${API_URL}/api/agent/latest`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ version: string; url: string; notes?: string }>;
}

// Admin Users management (CRM-like)
export interface AdminUser {
  id: number;
  email: string;
  full_name?: string | null;
  role: string;
  plan: string;
  is_active: boolean;
}

// Registrations (pending approvals)
export interface RegistrationItem {
  id: number;
  email: string;
  full_name?: string | null;
  org_name?: string | null;
  phone?: string | null;
  title?: string | null;
  notes?: string | null;
  plan_choice?: string | null;
  preferred_tenant_slug?: string | null;
  user_id?: number | null;
  created_at: string;
  approved: boolean;
  rejected: boolean;
}

export async function apiAdminListRegistrations(): Promise<RegistrationItem[]> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/registrations`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdminApproveRegistration(id: number): Promise<RegistrationItem> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/registrations/${id}/approve`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdminRejectRegistration(id: number): Promise<RegistrationItem> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/registrations/${id}/reject`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdminListUsers(): Promise<AdminUser[]> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdminCreateUser(payload: { email: string; full_name?: string; password: string; role?: string; plan?: string; is_active?: boolean }): Promise<AdminUser> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiAdminUpdateUser(userId: number, payload: { full_name?: string; role?: string; plan?: string; is_active?: boolean; password?: string }): Promise<AdminUser> {
  const token = getJwtFromBrowserCookie();
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}