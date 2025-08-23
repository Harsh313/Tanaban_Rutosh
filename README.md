# Tanabana - Professional Women's Clothing Website

A modern, minimalist e-commerce women's clothing website built with React, TypeScript, and Supabase.

## Features

- **Authentication**: Email/password and Google OAuth login
- **Product Catalog**: Browse and search products with filtering
- **Shopping Cart**: Add, remove, and manage cart items
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Powered by Supabase for real-time data
- **Modern UI**: Clean, minimalist design with smooth animations
- **Women's Fashion Focus**: Curated collection specifically for modern women

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd tanabana
npm install
```

### 2. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to Settings > API
3. Copy your project URL and anon key
4. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Run these SQL commands in your Supabase SQL editor:

```sql
-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Insert sample products
-- Insert sample women's products
INSERT INTO products (name, description, price, category, image_url, sizes, colors) VALUES
('Minimal White Tee', 'Classic white t-shirt with perfect feminine fit', 29.99, 'tops', 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Black']),
('Elegant Black Dress', 'Sophisticated black dress for any occasion', 89.99, 'women', 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Navy']),
('Flowy Midi Dress', 'Comfortable midi dress perfect for day or night', 79.99, 'dresses', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Beige', 'Black', 'White']),
('High-Waisted Trousers', 'Tailored trousers with a flattering high waist', 69.99, 'bottoms', 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Beige', 'Grey']),
('Leather Crossbody Bag', 'Premium leather bag with modern design', 129.99, 'accessories', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', ARRAY['One Size'], ARRAY['Black', 'Brown', 'Tan']),
('Cashmere Scarf', 'Luxurious cashmere scarf in neutral tones', 59.99, 'accessories', 'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg', ARRAY['One Size'], ARRAY['Beige', 'Grey', 'Black']),
('Silk Blouse', 'Elegant silk blouse for professional wear', 79.99, 'tops', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Cream', 'Black']),
('Minimalist Watch', 'Clean design timepiece with leather strap', 149.99, 'accessories', 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg', ARRAY['One Size'], ARRAY['Black', 'Brown']);
```

### 4. Authentication Setup
1. In Supabase dashboard, go to Authentication > Settings
2. Enable email authentication
3. For Google OAuth:
   - Go to Authentication > Settings > Auth Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Free Hosting Options:
1. **Netlify** (Recommended)
   - Connect your GitHub repository
   - Set environment variables in Netlify dashboard
   - Deploy automatically on push

2. **Vercel**
   - Import project from GitHub
   - Add environment variables
   - Deploy with zero configuration

3. **Supabase Static Hosting**
   - Build the project: `npm run build`
   - Upload the `dist` folder to Supabase storage

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── AuthForm.tsx
│   ├── Home/
│   │   ├── Hero.tsx
│   │   └── FeaturedProducts.tsx
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── Products/
│       └── ProductCard.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   └── Cart.tsx
├── App.tsx
└── main.tsx
```

## Key Features Implemented

### Authentication
- Email/password registration and login
- Google OAuth integration
- Protected routes
- User profile management

### Product Management
- Product catalog with search and filtering
- Category-based browsing
- Product details and variants
- Image galleries

### Shopping Cart
- Add/remove items
- Quantity management
- Local storage persistence
- Order summary

### Design
- Minimalist aesthetic
- Responsive design
- Smooth animations
- Accessible components

## Cost Breakdown (Free Tier)

- **Supabase**: Free tier includes 50,000 monthly active users, 500MB database, 1GB file storage
- **Netlify**: Free tier includes 100GB bandwidth, 300 build minutes
- **Domain**: Optional (~$12/year)

Total monthly cost: **$0** (within free tier limits)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.