/**
 * Audit Log System - Track all admin actions
 */
import { neon } from '@netlify/neon';

const sql = neon();

export interface AuditLog {
  id?: number;
  user_id: number;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: number | string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  userId: number,
  userEmail: string,
  action: string,
  resourceType: string,
  resourceId?: number | string,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO audit_logs (
        user_id, user_email, action, resource_type, resource_id, details, ip_address, user_agent
      )
      VALUES (
        ${userId}, ${userEmail}, ${action}, ${resourceType}, ${resourceId || null}, 
        ${details ? JSON.stringify(details) : null}, ${ipAddress || null}, ${userAgent || null}
      )
    `;
  } catch (error: any) {
    // If table doesn't exist, just log to console
    console.warn('Audit log table not found, logging to console:', {
      userId,
      userEmail,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  }
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(
  filters?: {
    userId?: number;
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }
): Promise<AuditLog[]> {
  try {
    let query = sql`
      SELECT * FROM audit_logs
      WHERE 1=1
    `;

    if (filters?.userId) {
      query = sql`${query} AND user_id = ${filters.userId}`;
    }
    if (filters?.action) {
      query = sql`${query} AND action = ${filters.action}`;
    }
    if (filters?.resourceType) {
      query = sql`${query} AND resource_type = ${filters.resourceType}`;
    }
    if (filters?.startDate) {
      query = sql`${query} AND created_at >= ${filters.startDate}`;
    }
    if (filters?.endDate) {
      query = sql`${query} AND created_at <= ${filters.endDate}`;
    }

    query = sql`${query} ORDER BY created_at DESC`;
    
    if (filters?.limit) {
      query = sql`${query} LIMIT ${filters.limit}`;
    }
    if (filters?.offset) {
      query = sql`${query} OFFSET ${filters.offset}`;
    }

    const results = await query;
    return results as AuditLog[];
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

/**
 * Common audit actions
 */
export const AuditActions = {
  // User actions
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PASSWORD_CHANGED: 'user_password_changed',
  
  // Product actions
  PRODUCT_CREATED: 'product_created',
  PRODUCT_UPDATED: 'product_updated',
  PRODUCT_DELETED: 'product_deleted',
  
  // Order actions
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_STATUS_CHANGED: 'order_status_changed',
  ORDER_CANCELLED: 'order_cancelled',
  
  // Package actions
  PACKAGE_CREATED: 'package_created',
  PACKAGE_UPDATED: 'package_updated',
  PACKAGE_DELETED: 'package_deleted',
  
  // Inventory actions
  STOCK_UPDATED: 'stock_updated',
  STOCK_ADJUSTED: 'stock_adjusted',
  
  // Settings actions
  SETTINGS_UPDATED: 'settings_updated',
  
  // General
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  BULK_ACTION: 'bulk_action',
} as const;

