-- Reviews & Ratings System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  user_id INTEGER, -- Reference to users table if exists
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT NOT NULL,
  images JSONB, -- Array of image URLs
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, spam
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sku ON reviews(sku);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON reviews(verified_purchase);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);

-- Function to update product rating average
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product with average rating and review count
  UPDATE products
  SET 
    -- Calculate average rating
    rating_avg = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    -- Count total reviews
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id
        AND status = 'approved'
    ),
    -- Count reviews by rating
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

-- Trigger to update product rating on review insert/update
DROP TRIGGER IF EXISTS trigger_update_product_rating ON reviews;
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OF rating, status ON reviews
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION update_product_rating();

-- Add rating fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_distribution JSONB;

