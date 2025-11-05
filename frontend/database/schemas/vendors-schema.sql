-- Multi-Vendor Marketplace System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

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
  commission_rate DECIMAL(5, 2) DEFAULT 10.00, -- Percentage commission
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, suspended, inactive
  rating_avg DECIMAL(3, 2),
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  balance DECIMAL(10, 2) DEFAULT 0, -- Pending balance
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
  payment_method VARCHAR(50), -- bank_transfer, paypal, check
  transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
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
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
  paid_at TIMESTAMP
);

-- Create indexes
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

