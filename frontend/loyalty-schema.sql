-- Loyalty & Rewards System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

-- Create loyalty points table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- Reference to users table
  user_email VARCHAR(255),
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'Bronze', -- Bronze, Silver, Gold, Platinum
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255),
  points_change INTEGER NOT NULL, -- Positive for earned, negative for spent
  transaction_type VARCHAR(50) NOT NULL, -- purchase, review, referral, bonus, redemption, expiry
  description TEXT,
  order_id INTEGER, -- If related to order
  expires_at TIMESTAMP, -- If points expire
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create loyalty coupons table
CREATE TABLE IF NOT EXISTS loyalty_coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER,
  user_email VARCHAR(255),
  discount_type VARCHAR(50) NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active', -- active, used, expired, disabled
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

-- Create indexes
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
  v_tier VARCHAR(50);
  v_new_tier VARCHAR(50);
BEGIN
  -- Get or create loyalty account
  INSERT INTO loyalty_points (user_id, user_email, points, total_earned)
  VALUES (p_user_id, p_user_email, p_points, p_points)
  ON CONFLICT (user_id) DO UPDATE
  SET points = loyalty_points.points + p_points,
      total_earned = loyalty_points.total_earned + p_points,
      updated_at = NOW()
  RETURNING points, total_earned INTO v_current_points, v_total_earned;

  -- Calculate new tier
  v_new_tier := calculate_loyalty_tier(v_total_earned);

  -- Update tier if changed
  UPDATE loyalty_points
  SET tier = v_new_tier
  WHERE user_id = p_user_id;

  -- Record transaction
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

