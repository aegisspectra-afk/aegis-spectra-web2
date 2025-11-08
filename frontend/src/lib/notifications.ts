/**
 * Notifications System - Create automatic notifications
 */
import { neon } from '@netlify/neon';

const sql = neon();

export interface Notification {
  user_id?: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action_url?: string;
}

/**
 * Create notification
 */
export async function createNotification(notification: Notification): Promise<void> {
  try {
    await sql`
      INSERT INTO notifications (user_id, type, title, message, action_url)
      VALUES (
        ${notification.user_id || null},
        ${notification.type},
        ${notification.title},
        ${notification.message},
        ${notification.action_url || null}
      )
    `;
  } catch (error: any) {
    // If table doesn't exist, just log to console
    console.warn('Notifications table not found, logging to console:', notification);
  }
}

/**
 * Create notification for new order
 */
export async function notifyNewOrder(orderId: string, customerName: string, total: number): Promise<void> {
  await createNotification({
    type: 'success',
    title: 'הזמנה חדשה',
    message: `הזמנה חדשה #${orderId} מ-${customerName} בסכום ${total.toLocaleString()} ₪`,
    action_url: `/admin/orders/${orderId}`,
  });
}

/**
 * Create notification for low stock
 */
export async function notifyLowStock(productId: number, productName: string, currentStock: number, minStock: number): Promise<void> {
  await createNotification({
    type: 'warning',
    title: 'מלאי נמוך',
    message: `מלאי נמוך למוצר ${productName}: ${currentStock} יחידות (מינימום: ${minStock})`,
    action_url: `/admin/products/${productId}`,
  });
}

/**
 * Create notification for new lead
 */
export async function notifyNewLead(leadId: number, leadName: string, leadPhone: string): Promise<void> {
  await createNotification({
    type: 'info',
    title: 'ליד חדש',
    message: `ליד חדש: ${leadName} (${leadPhone})`,
    action_url: `/admin/leads/${leadId}`,
  });
}

/**
 * Create notification for new user
 */
export async function notifyNewUser(userId: number, userName: string, userEmail: string): Promise<void> {
  await createNotification({
    type: 'info',
    title: 'משתמש חדש',
    message: `משתמש חדש: ${userName} (${userEmail})`,
    action_url: `/admin/users/${userId}`,
  });
}

/**
 * Check and create low stock notifications
 */
export async function checkLowStockAlerts(): Promise<void> {
  try {
    const products = await sql`
      SELECT id, name, stock, min_stock
      FROM products
      WHERE active = true AND stock <= min_stock
    `.catch(() => []);

    for (const product of products) {
      await notifyLowStock(
        product.id,
        product.name,
        product.stock || 0,
        product.min_stock || 10
      );
    }
  } catch (error: any) {
    console.warn('Error checking low stock alerts:', error);
  }
}

