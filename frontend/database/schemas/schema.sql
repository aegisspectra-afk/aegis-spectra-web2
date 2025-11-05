-- SQL schema for Netlify DB (Neon PostgreSQL)
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100),
  message TEXT,
  product_sku VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'new',
  notes TEXT
);

-- אינדקסים לשיפור ביצועים
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_product_sku ON leads(product_sku);

-- טבלת מוצרים (אפשרות להרחבה)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price_regular INTEGER NOT NULL,
  price_sale INTEGER,
  currency VARCHAR(10) DEFAULT 'ILS',
  short_desc TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- הוספת מוצר ראשון
INSERT INTO products (sku, name, price_regular, price_sale, short_desc)
VALUES ('H-01-2TB', 'Home Cam H-01 (2 TB)', 2590, 2290, 'מערכת אבטחה חכמה: 2×4MP PoE + NVR 2TB + אפליקציה בעברית.')
ON CONFLICT (sku) DO NOTHING;

