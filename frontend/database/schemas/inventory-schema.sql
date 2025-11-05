-- Inventory Management System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

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
  alert_type VARCHAR(50) DEFAULT 'low_stock', -- low_stock, out_of_stock, critical
  status VARCHAR(50) DEFAULT 'active', -- active, resolved, ignored
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  notes TEXT
);

-- Create stock history table for tracking changes
CREATE TABLE IF NOT EXISTS stock_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  change_type VARCHAR(50) NOT NULL, -- sale, restock, adjustment, return, reserved
  quantity_change INTEGER NOT NULL, -- positive for restock, negative for sale
  stock_before INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  order_id INTEGER, -- if related to order
  notes TEXT,
  created_by VARCHAR(100), -- user/admin who made the change
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
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
  -- Get current stock and min stock
  SELECT stock, min_stock, sku, name
  INTO v_current_stock, v_min_stock, v_sku, v_product_name
  FROM products
  WHERE id = p_product_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Product not found');
  END IF;
  
  -- Calculate new stock
  v_new_stock := v_current_stock + p_quantity_change;
  
  IF v_new_stock < 0 THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient stock');
  END IF;
  
  -- Update product stock
  UPDATE products
  SET stock = v_new_stock,
      last_stock_update = NOW(),
      low_stock_alert = (v_new_stock <= v_min_stock)
  WHERE id = p_product_id;
  
  -- Record in stock history
  INSERT INTO stock_history (
    product_id, sku, change_type, quantity_change,
    stock_before, stock_after, notes, created_by
  ) VALUES (
    p_product_id, v_sku, p_change_type, p_quantity_change,
    v_current_stock, v_new_stock, p_notes, p_created_by
  );
  
  -- Create alert if stock is low
  IF v_new_stock <= v_min_stock THEN
    -- Check if active alert already exists
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
      -- Update existing alert
      UPDATE inventory_alerts
      SET current_stock = v_new_stock,
          created_at = NOW()
      WHERE id = v_alert_id;
    END IF;
  ELSE
    -- Resolve any active low stock alerts for this product
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

