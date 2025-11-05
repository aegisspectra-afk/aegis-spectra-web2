-- Advanced Order Management System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

-- Add fields to orders table if not exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_requested_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_status VARCHAR(50); -- pending, approved, rejected, completed

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by VARCHAR(255), -- user/admin/system
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create order notifications table
CREATE TABLE IF NOT EXISTS order_notifications (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- email, sms, push
  notification_method VARCHAR(50) NOT NULL, -- status_update, shipping, delivery, cancellation
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent' -- sent, failed, pending
);

-- Create recurring orders table
CREATE TABLE IF NOT EXISTS recurring_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255) NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  frequency VARCHAR(50) NOT NULL, -- weekly, biweekly, monthly, quarterly
  next_order_date TIMESTAMP NOT NULL,
  items JSONB NOT NULL, -- Array of items to reorder
  status VARCHAR(50) DEFAULT 'active', -- active, paused, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_ordered_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_status ON order_status_history(status);
CREATE INDEX IF NOT EXISTS idx_order_notifications_order_id ON order_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_sent_at ON order_notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_recurring_orders_user_email ON recurring_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_recurring_orders_next_order_date ON recurring_orders(next_order_date);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipped_at ON orders(shipped_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivered_at ON orders(delivered_at);

-- Function to update order status and create history
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id INTEGER,
  p_new_status VARCHAR(50),
  p_notes TEXT DEFAULT NULL,
  p_created_by VARCHAR(255) DEFAULT 'system'
)
RETURNS JSON AS $$
DECLARE
  v_old_status VARCHAR(50);
BEGIN
  -- Get current status
  SELECT status INTO v_old_status
  FROM orders
  WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;
  
  -- Update order status
  UPDATE orders
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_order_id;
  
  -- Set timestamps based on status
  IF p_new_status = 'shipped' THEN
    UPDATE orders SET shipped_at = NOW() WHERE id = p_order_id;
  ELSIF p_new_status = 'delivered' THEN
    UPDATE orders SET delivered_at = NOW() WHERE id = p_order_id;
  ELSIF p_new_status = 'cancelled' THEN
    UPDATE orders SET cancellation_requested_at = NOW() WHERE id = p_order_id;
  END IF;
  
  -- Create status history
  INSERT INTO order_status_history (order_id, status, notes, created_by)
  VALUES (p_order_id, p_new_status, p_notes, p_created_by);
  
  RETURN json_build_object(
    'success', true,
    'old_status', v_old_status,
    'new_status', p_new_status
  );
END;
$$ LANGUAGE plpgsql;

