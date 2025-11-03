import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Define enums locally since they're not exported from Prisma client
const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN', 
  CLIENT: 'CLIENT',
  EMPLOYEE: 'EMPLOYEE'
} as const;

const SubscriptionPlan = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PRO: 'PRO',
  BUSINESS: 'BUSINESS'
} as const;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function getUserWithRolesAndSubscription(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      subscriptions: {
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      userRoles: {
        create: {
          role: {
            connectOrCreate: {
              where: { name: Role.CLIENT },
              create: { name: Role.CLIENT, description: 'Client user' }
            }
          }
        }
      }
    },
    include: {
      userRoles: {
        include: {
          role: true
        }
      },
      subscriptions: {
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true
        }
      },
      subscriptions: {
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  });
}

export async function logAuditEvent(
  userId: string | null,
  action: string,
  ip?: string,
  userAgent?: string,
  metadata?: any
) {
  return prisma.auditEvent.create({
    data: {
      userId,
      action,
      ip,
      userAgent,
      metadata
    }
  });
}

export function getUserRoles(user: any): string[] {
  return user?.userRoles?.map((ur: any) => ur.role.name) || [];
}

export function getUserSubscriptionPlan(user: any): string | null {
  return user?.subscriptions?.[0]?.plan || null;
}

export function hasRole(user: any, requiredRoles: string[]): boolean {
  const userRoles = getUserRoles(user);
  return requiredRoles.some(role => userRoles.includes(role));
}

export function getRedirectPath(user: any): string {
  const roles = getUserRoles(user);
  
  if (roles.includes('SUPER_ADMIN')) return '/dashboard/super-admin';
  if (roles.includes('ADMIN')) return '/dashboard/admin';
  if (roles.includes('CLIENT')) return '/dashboard/client';
  if (roles.includes('EMPLOYEE')) return '/dashboard/employee';
  
  return '/dashboard/client'; // Default fallback
}