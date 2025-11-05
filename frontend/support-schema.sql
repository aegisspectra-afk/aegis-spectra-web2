-- Customer Support System Schema
-- הרץ את זה ב-Netlify Dashboard → Database → SQL Editor

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(100), -- technical, billing, order, product, general
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, waiting_customer, resolved, closed
  assigned_to VARCHAR(255), -- Admin/agent assigned
  order_id INTEGER, -- If related to order
  product_id INTEGER, -- If related to product
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);

-- Create support ticket messages table
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(50) NOT NULL, -- customer, admin, system
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  message TEXT NOT NULL,
  attachments JSONB, -- Array of file URLs
  is_internal BOOLEAN DEFAULT false, -- Internal notes visible only to admins
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100), -- general, products, orders, shipping, payments, returns
  tags JSONB, -- Array of tags for search
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published', -- draft, published, archived
  order_index INTEGER DEFAULT 0, -- For manual ordering
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status);
CREATE INDEX IF NOT EXISTS idx_faqs_tags ON faqs USING GIN(tags);

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD((NEXTVAL('ticket_number_seq')::TEXT), 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

