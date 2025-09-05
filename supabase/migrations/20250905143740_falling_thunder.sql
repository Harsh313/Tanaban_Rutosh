/*
  # Create missing tables for e-commerce functionality

  1. New Tables
    - `wishlist` - User wishlist items
    - `order_items` - Individual items in orders
    - `payments` - Payment records
    - `admin_notifications` - Admin notification system

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table

  3. Indexes
    - Add performance indexes for common queries
*/

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  size text,
  color text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  gateway text DEFAULT 'razorpay',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Update orders table with missing columns
DO $$
BEGIN
  -- Add user_email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_email text;
  END IF;

  -- Add user_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_name text;
  END IF;

  -- Add shipping_address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_address jsonb;
  END IF;

  -- Add billing_address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'billing_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN billing_address jsonb;
  END IF;

  -- Add items column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'items'
  ) THEN
    ALTER TABLE orders ADD COLUMN items jsonb;
  END IF;

  -- Add subtotal column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE orders ADD COLUMN subtotal decimal(10,2);
  END IF;

  -- Add tax column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tax'
  ) THEN
    ALTER TABLE orders ADD COLUMN tax decimal(10,2);
  END IF;

  -- Add shipping_cost column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_cost'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_cost decimal(10,2) DEFAULT 0;
  END IF;

  -- Add payment_method column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text;
  END IF;

  -- Add payment_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;

  -- Add razorpay_order_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'razorpay_order_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN razorpay_order_id text;
  END IF;

  -- Add razorpay_payment_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN razorpay_payment_id text;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wishlist
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create RLS policies for admin_notifications (admin only)
CREATE POLICY "Admin can manage notifications"
  ON admin_notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email LIKE '%@admin.%'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS wishlist_product_id_idx ON wishlist(product_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS admin_notifications_created_at_idx ON admin_notifications(created_at DESC);