import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return session;
}

export async function requireRole(requiredRoles: string[]) {
  const session = await requireAuth();
  
  const userRoles = session.user?.roles || [];
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    redirect('/panel?error=insufficient_permissions');
  }
  
  return session;
}

export async function requireOrganization() {
  const session = await requireAuth();
  
  if (!(session.user as any)?.organizationId) {
    redirect('/panel?error=no_organization');
  }
  
  return session;
}

export function withOrg<T extends { organizationId?: string }>(
  userOrgId: string, 
  data: T
): T & { organizationId: string } {
  return { ...data, organizationId: userOrgId };
}

export function canAddCamera(
  plan: "FREE" | "BASIC" | "PRO" | "BUSINESS", 
  currentCount: number
): boolean {
  const limits = { 
    FREE: 0, 
    BASIC: 5, 
    PRO: 20, 
    BUSINESS: Infinity 
  } as const;
  
  return currentCount < limits[plan];
}

export function getPlanLimits(plan: "FREE" | "BASIC" | "PRO" | "BUSINESS") {
  const limits = {
    FREE: {
      cameras: 0,
      users: 1,
      storage: 0,
      features: ['Basic dashboard']
    },
    BASIC: {
      cameras: 5,
      users: 1,
      storage: 30, // 30 days
      features: [
        'Up to 5 cameras',
        'Smart alerts',
        'Real-time notifications',
        'Basic security monitoring',
        'Mobile app access',
        '30 days storage',
        'Email support',
        'Basic analytics dashboard',
        'Cloud storage included'
      ]
    },
    PRO: {
      cameras: 16,
      users: 10,
      storage: 365, // 1 year
      features: [
        'Up to 16 cameras',
        'Smart alerts & AI detection',
        '24/7 support',
        '1 year data retention',
        'Advanced analytics',
        'API access',
        'Advanced dashboard',
        'Advanced reports'
      ]
    },
    BUSINESS: {
      cameras: Infinity,
      users: Infinity,
      storage: Infinity, // Unlimited
      features: [
        'Unlimited cameras',
        'Custom AI models',
        'Dedicated support',
        'Unlimited data retention',
        'Advanced reporting',
        'Full API access',
        'Custom integrations',
        'Enterprise dashboard',
        'All features'
      ]
    }
  };
  
  return limits[plan];
}

export function canAccessFeature(
  userRole: string,
  subscriptionPlan: string,
  feature: 'users' | 'analytics' | 'reports' | 'system'
): boolean {
  // SUPER_ADMIN can access everything
  if (userRole === 'SUPER_ADMIN') {
    return true;
  }
  
  // ADMIN can access users, analytics, reports (but not system)
  if (userRole === 'ADMIN') {
    return feature !== 'system';
  }
  
  // CLIENT users - check subscription plan based on pricing page
  if (userRole === 'CLIENT') {
    switch (feature) {
      case 'users':
        return false; // No CLIENT plan includes user management
      case 'analytics':
        // Only PRO and BUSINESS plans include Analytics
        return subscriptionPlan === 'PRO' || subscriptionPlan === 'BUSINESS';
      case 'reports':
        // All plans include reports (BASIC gets basic reports, PRO+ gets advanced)
        return subscriptionPlan === 'BASIC' || subscriptionPlan === 'PRO' || subscriptionPlan === 'BUSINESS';
      case 'system':
        return false; // No CLIENT plan includes system access
      default:
        return false;
    }
  }
  
  return false;
}

export async function requireFeatureAccess(feature: 'users' | 'analytics' | 'reports' | 'system') {
  const session = await requireAuth();
  
  const userRole = session.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session.user as any)?.subscriptionPlan || 'BASIC';
  
  if (!canAccessFeature(userRole, subscriptionPlan, feature)) {
    redirect('/panel?error=insufficient_permissions');
  }
  
  return session;
}