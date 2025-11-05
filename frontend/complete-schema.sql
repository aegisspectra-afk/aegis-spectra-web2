-- ============================================
-- AEGIS SPECTRA - Complete Database Schema
-- ============================================
-- הרץ את הקובץ הזה ב-Netlify Dashboard → Database → SQL Editor
-- הקובץ כולל את כל הטבלאות והפונקציות הנדרשות לכל המערכות
-- ============================================

-- ============================================
-- 1. INVENTORY MANAGEMENT SYSTEM
-- ============================================

-- Add inventory management fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 10;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reserved_stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_alert BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_stock_update TIMESTAMP DEFAULT NOW();

-- Create inventory alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  product_name VARCHAR(255),
  current_stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL,
  alert_type VARCHAR(50) DEFAULT 'low_stock',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  notes TEXT
);

-- Create stock history table
CREATE TABLE IF NOT EXISTS stock_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  change_type VARCHAR(50) NOT NULL,
  quantity_change INTEGER NOT NULL,
  stock_before INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  order_id INTEGER,
  notes TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_status ON inventory_alerts(status);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_product_id ON inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_product_id ON stock_history(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_history_created_at ON stock_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_low_stock_alert ON products(low_stock_alert) WHERE low_stock_alert = true;

-- Function to update stock and create alerts
CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id INTEGER,
  p_quantity_change INTEGER,
  p_change_type VARCHAR(50),
  p_notes TEXT DEFAULT NULL,
  p_created_by VARCHAR(100) DEFAULT 'system'
)
RETURNS JSON AS $$
DECLARE
  v_current_stock INTEGER;
  v_min_stock INTEGER;
  v_new_stock INTEGER;
  v_sku VARCHAR(100);
  v_product_name VARCHAR(255);
  v_alert_id INTEGER;
BEGIN
  SELECT stock, min_stock, sku, name
  INTO v_current_stock, v_min_stock, v_sku, v_product_name
  FROM products
  WHERE id = p_product_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Product not found');
  END IF;
  
  v_new_stock := v_current_stock + p_quantity_change;
  
  IF v_new_stock < 0 THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient stock');
  END IF;
  
  UPDATE products
  SET stock = v_new_stock,
      last_stock_update = NOW(),
      low_stock_alert = (v_new_stock <= v_min_stock)
  WHERE id = p_product_id;
  
  INSERT INTO stock_history (
    product_id, sku, change_type, quantity_change,
    stock_before, stock_after, notes, created_by
  ) VALUES (
    p_product_id, v_sku, p_change_type, p_quantity_change,
    v_current_stock, v_new_stock, p_notes, p_created_by
  );
  
  IF v_new_stock <= v_min_stock THEN
    SELECT id INTO v_alert_id
    FROM inventory_alerts
    WHERE product_id = p_product_id
      AND status = 'active'
      AND alert_type = 'low_stock'
    LIMIT 1;
    
    IF NOT FOUND THEN
      INSERT INTO inventory_alerts (
        product_id, sku, product_name, current_stock,
        min_stock, alert_type, status
      ) VALUES (
        p_product_id, v_sku, v_product_name, v_new_stock,
        v_min_stock, 'low_stock', 'active'
      );
    ELSE
      UPDATE inventory_alerts
      SET current_stock = v_new_stock,
          created_at = NOW()
      WHERE id = v_alert_id;
    END IF;
  ELSE
    UPDATE inventory_alerts
    SET status = 'resolved',
        resolved_at = NOW()
    WHERE product_id = p_product_id
      AND status = 'active'
      AND alert_type = 'low_stock';
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'stock_before', v_current_stock,
    'stock_after', v_new_stock,
    'quantity_change', p_quantity_change
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. REVIEWS & RATINGS SYSTEM
-- ============================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  user_id INTEGER,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT NOT NULL,
  images JSONB,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  admin_notes TEXT
);

-- Create review helpful votes table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  user_id INTEGER,
  user_ip VARCHAR(50),
  is_helpful BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id, user_ip)
);

-- Add rating fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_distribution JSONB;

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sku ON reviews(sku);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON reviews(verified_purchase);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    rating_avg = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    rating_distribution = (
      SELECT json_build_object(
        '5', COUNT(*) FILTER (WHERE rating = 5),
        '4', COUNT(*) FILTER (WHERE rating = 4),
        '3', COUNT(*) FILTER (WHERE rating = 3),
        '2', COUNT(*) FILTER (WHERE rating = 2),
        '1', COUNT(*) FILTER (WHERE rating = 1)
      )
      FROM reviews
      WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    updated_at = NOW()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product rating
DROP TRIGGER IF EXISTS trigger_update_product_rating ON reviews;
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OF rating, status ON reviews
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_product_rating();

-- ============================================
-- 3. LOYALTY & REWARDS SYSTEM
-- ============================================

-- Create loyalty points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255),
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'Bronze',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(user_email)
);

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255),
  points_change INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  description TEXT,
  order_id INTEGER,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create loyalty coupons table
CREATE TABLE IF NOT EXISTS loyalty_coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER,
  user_email VARCHAR(255),
  discount_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100) DEFAULT 'system'
);

-- Create loyalty coupon usage log
CREATE TABLE IF NOT EXISTS loyalty_coupon_usage (
  id SERIAL PRIMARY KEY,
  coupon_id INTEGER REFERENCES loyalty_coupons(id) ON DELETE CASCADE,
  coupon_code VARCHAR(50),
  user_id INTEGER,
  user_email VARCHAR(255),
  order_id INTEGER,
  discount_amount DECIMAL(10, 2),
  order_total DECIMAL(10, 2),
  used_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for loyalty
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_email ON loyalty_points(user_email);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_tier ON loyalty_points(tier);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_email ON loyalty_transactions(user_email);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_type ON loyalty_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_code ON loyalty_coupons(code);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_user_id ON loyalty_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_status ON loyalty_coupons(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupon_usage_coupon_id ON loyalty_coupon_usage(coupon_id);

-- Function to calculate loyalty tier
CREATE OR REPLACE FUNCTION calculate_loyalty_tier(total_points INTEGER)
RETURNS VARCHAR(50) AS $$
BEGIN
  IF total_points >= 10000 THEN
    RETURN 'Platinum';
  ELSIF total_points >= 5000 THEN
    RETURN 'Gold';
  ELSIF total_points >= 1000 THEN
    RETURN 'Silver';
  ELSE
    RETURN 'Bronze';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to add loyalty points
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_user_id INTEGER,
  p_user_email VARCHAR(255),
  p_points INTEGER,
  p_transaction_type VARCHAR(50),
  p_description TEXT DEFAULT NULL,
  p_order_id INTEGER DEFAULT NULL,
  p_expires_at TIMESTAMP DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_current_points INTEGER;
  v_total_earned INTEGER;
  v_new_tier VARCHAR(50);
BEGIN
  INSERT INTO loyalty_points (user_id, user_email, points, total_earned)
  VALUES (p_user_id, p_user_email, p_points, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET points = loyalty_points.points + p_points,
      total_earned = loyalty_points.total_earned + p_points,
      updated_at = NOW()
  RETURNING points, total_earned INTO v_current_points, v_total_earned;
  
  v_new_tier := calculate_loyalty_tier(v_total_earned);
  
  UPDATE loyalty_points
  SET tier = v_new_tier
  WHERE user_id = p_user_id;
  
  INSERT INTO loyalty_transactions (
    user_id, user_email, points_change, transaction_type,
    description, order_id, expires_at
  )
  VALUES (
    p_user_id, p_user_email, p_points, p_transaction_type,
    p_description, p_order_id, p_expires_at
  );
  
  RETURN json_build_object(
    'success', true,
    'points', v_current_points,
    'total_earned', v_total_earned,
    'tier', v_new_tier
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. CUSTOMER SUPPORT SYSTEM
-- ============================================

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  assigned_to VARCHAR(255),
  order_id INTEGER,
  product_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);

-- Create support ticket messages table
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  message TEXT NOT NULL,
  attachments JSONB,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  tags JSONB,
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create FAQ helpful votes table
CREATE TABLE IF NOT EXISTS faq_helpful_votes (
  id SERIAL PRIMARY KEY,
  faq_id INTEGER REFERENCES faqs(id) ON DELETE CASCADE,
  user_id INTEGER,
  user_ip VARCHAR(50),
  is_helpful BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(faq_id, user_id, user_ip)
);

-- Create indexes for support
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_tags ON faqs USING GIN(tags);

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- ============================================
-- 5. ADVANCED ORDER MANAGEMENT
-- ============================================

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
ALTER TABLE orders ADD COLUMN IF NOT EXISTS return_status VARCHAR(50);

-- Create order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create order notifications table
CREATE TABLE IF NOT EXISTS order_notifications (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  notification_method VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent'
);

-- Create recurring orders table
CREATE TABLE IF NOT EXISTS recurring_orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255) NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  frequency VARCHAR(50) NOT NULL,
  next_order_date TIMESTAMP NOT NULL,
  items JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_ordered_at TIMESTAMP
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_status ON order_status_history(status);
CREATE INDEX IF NOT EXISTS idx_order_notifications_order_id ON order_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_sent_at ON order_notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_recurring_orders_user_email ON recurring_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_recurring_orders_next_order_date ON recurring_orders(next_order_date);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipped_at ON orders(shipped_at);
CREATE INDEX IF NOT EXISTS idx_orders_delivered_at ON orders(delivered_at);

-- Function to update order status
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
  SELECT order_status INTO v_old_status
  FROM orders
  WHERE id = p_order_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Order not found');
  END IF;
  
  UPDATE orders
  SET order_status = p_new_status,
      updated_at = NOW()
  WHERE id = p_order_id;
  
  IF p_new_status = 'shipped' THEN
    UPDATE orders SET shipped_at = NOW() WHERE id = p_order_id;
  ELSIF p_new_status = 'delivered' THEN
    UPDATE orders SET delivered_at = NOW() WHERE id = p_order_id;
  ELSIF p_new_status = 'cancelled' THEN
    UPDATE orders SET cancellation_requested_at = NOW() WHERE id = p_order_id;
  END IF;
  
  INSERT INTO order_status_history (order_id, status, notes, created_by)
  VALUES (p_order_id, p_new_status, p_notes, p_created_by);
  
  RETURN json_build_object(
    'success', true,
    'old_status', v_old_status,
    'new_status', p_new_status
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. MULTI-VENDOR MARKETPLACE
-- ============================================

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255),
  company_registration VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Israel',
  tax_id VARCHAR(100),
  bank_account VARCHAR(100),
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  status VARCHAR(50) DEFAULT 'pending',
  rating_avg DECIMAL(3, 2),
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  notes TEXT
);

-- Add vendor_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vendor_commission DECIMAL(5, 2);

-- Create vendor payments table
CREATE TABLE IF NOT EXISTS vendor_payments (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP DEFAULT NOW(),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  processed_by VARCHAR(255)
);

-- Create vendor sales summary table
CREATE TABLE IF NOT EXISTS vendor_sales_summary (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  order_id INTEGER,
  product_id INTEGER,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  vendor_earnings DECIMAL(10, 2) NOT NULL,
  order_date TIMESTAMP DEFAULT NOW(),
  payment_status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP
);

-- Create indexes for vendors
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payments_vendor_id ON vendor_payments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payments_status ON vendor_payments(status);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_summary_vendor_id ON vendor_sales_summary(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_sales_summary_order_id ON vendor_sales_summary(order_id);

-- Function to calculate vendor commission
CREATE OR REPLACE FUNCTION calculate_vendor_commission(
  p_vendor_id INTEGER,
  p_amount DECIMAL(10, 2)
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  v_commission_rate DECIMAL(5, 2);
BEGIN
  SELECT commission_rate INTO v_commission_rate
  FROM vendors
  WHERE id = p_vendor_id;
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  RETURN (p_amount * v_commission_rate / 100);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Schema Installation Complete!
-- ============================================

