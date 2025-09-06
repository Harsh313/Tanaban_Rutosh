import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ProductCard from '../Products/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Method 1: Direct Fetch API (More reliable)
  const fetchProductsDirectAPI = useCallback(async () => {
    console.log("🔥 METHOD 1: Direct API Fetch Started");
    console.log("Environment check:");
    console.log("- VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("- VITE_SUPABASE_ANON_KEY exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products?select=*&limit=8&order=created_at.desc`;
      console.log("Request URL:", url);
      
      const headers = {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };
      console.log("Request headers:", {
        ...headers,
        apikey: headers.apikey ? `${headers.apikey.substring(0, 10)}...` : 'MISSING',
        Authorization: headers.Authorization ? `Bearer ${headers.Authorization.substring(7, 17)}...` : 'MISSING',
      });

      const response = await fetch(url, { headers });
      
      console.log("Response status:", response.status);
      console.log("Response statusText:", response.statusText);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error("❌ Response not OK");
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Direct API Response:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      console.log("Data length:", data?.length);
      
      if (Array.isArray(data)) {
        console.log("✅ Valid array received, setting products");
        console.log("First product:", data[0]);
        setProducts(data);
        setError(null);
        return { success: true, data };
      } else {
        console.warn("⚠️ Invalid data format received");
        console.log("Received data:", data);
        setError("Invalid data format received from API");
        return { success: false, error: "Invalid data format" };
      }
    } catch (err: any) {
      console.error("🔥 Direct API Error:", err);
      console.error("Error type:", typeof err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setError(`Direct API Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  // Method 2: Supabase Client
  const fetchProductsSupabaseClient = useCallback(async () => {
    console.log("🔥 METHOD 2: Supabase Client Started");
    
    try {
      console.log("Supabase client exists:", !!supabase);
      console.log("Starting query...");
      
      const startTime = Date.now();
      const result = await supabase
        .from('products')
        .select('id, name, price, image_url, category, description, sizes, colors')
        .limit(8)
        .order('created_at', { ascending: false });
      
      const endTime = Date.now();
      console.log(`Query completed in ${endTime - startTime}ms`);
      
      console.log("Raw Supabase result:", result);
      
      const { data, error, status, statusText } = result;
      console.log("Destructured result:");
      console.log("- data:", data);
      console.log("- error:", error);
      console.log("- status:", status);
      console.log("- statusText:", statusText);

      if (error) {
        console.error('❌ Supabase Error Details:');
        console.error('- Message:', error.message);
        console.error('- Details:', error.details);
        console.error('- Hint:', error.hint);
        console.error('- Code:', error.code);
        setError(`Supabase Error: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (!data) {
        console.warn('⚠️ No data received from Supabase');
        setError("No data received from Supabase");
        return { success: false, error: "No data received" };
      }

      if (data.length === 0) {
        console.warn('⚠️ Empty array received from Supabase');
        console.log('Database might be empty or query conditions too restrictive');
        return { success: true, data: [] };
      }

      console.log("✅ Supabase Success!");
      console.log(`Received ${data.length} products`);
      console.log("First product:", data[0]);
      
      // Validate data structure
      const isValidData = data.every((item, index) => {
        const valid = 
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.price === 'number' &&
          typeof item.image_url === 'string' &&
          typeof item.category === 'string' &&
          typeof item.description === 'string' &&
          Array.isArray(item.sizes) &&
          Array.isArray(item.colors);
        
        if (!valid) {
          console.error(`Invalid data at index ${index}:`, item);
        }
        return valid;
      });

      console.log("Data validation result:", isValidData);

      if (isValidData) {
        setProducts(data);
        setError(null);
        return { success: true, data };
      } else {
        console.error("❌ Data validation failed");
        setError("Invalid data structure received");
        return { success: false, error: "Invalid data structure" };
      }

    } catch (err: any) {
      console.error('🔥 Supabase Client Error:', err);
      console.error("Error type:", typeof err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setError(`Supabase Client Error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  // Main fetch function that tries both methods
  const fetchFeaturedProducts = useCallback(async () => {
    console.log("🚀 Starting fetchFeaturedProducts");
    console.log("Current time:", new Date().toISOString());
    
    setLoading(true);
    setError(null);

    // Try Method 1 first (Direct API)
    console.log("Attempting Method 1...");
    const directResult = await fetchProductsDirectAPI();
    
    if (directResult.success) {
      console.log("✅ Method 1 successful, stopping here");
      setLoading(false);
      return;
    }

    // If Method 1 fails, try Method 2 (Supabase Client)
    console.log("Method 1 failed, attempting Method 2...");
    const clientResult = await fetchProductsSupabaseClient();
    
    if (clientResult.success) {
      console.log("✅ Method 2 successful");
    } else {
      console.log("❌ Both methods failed");
      setProducts([]);
    }

    setLoading(false);
  }, [fetchProductsDirectAPI, fetchProductsSupabaseClient]);

  useEffect(() => {
    console.log("📦 FeaturedProducts Component Mounted");
    console.log("Component props:", {});
    console.log("Initial state:", { products: products.length, loading, error });
    
    fetchFeaturedProducts().catch((err) => {
      console.error("🔥 useEffect Error:", err);
      setError(`UseEffect Error: ${err.message}`);
      setLoading(false);
    });
  }, [fetchFeaturedProducts]);

  // Log state changes
  useEffect(() => {
    console.log("📊 State Update:");
    console.log("- Products count:", products.length);
    console.log("- Loading:", loading);
    console.log("- Error:", error);
    console.log("- Products data:", products.length > 0 ? products[0] : 'No products');
  }, [products, loading, error]);

  if (loading) {
    console.log("⌛ Rendering loading state...");
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Products...</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && !products.length) {
    console.log("❌ Rendering error state...");
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Featured Products
            </h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error loading products:</strong> {error}
            </div>
            <button 
              onClick={() => {
                console.log("🔄 Retry button clicked");
                fetchFeaturedProducts();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    console.log("⚠️ Rendering no products state...");
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
            <button 
              onClick={() => {
                console.log("🔄 Refresh button clicked");
                fetchFeaturedProducts();
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Products
            </button>
          </div>
        </div>
      </section>
    );
  }

  console.log("🎨 Rendering products successfully");
  console.log(`Rendering ${products.length} products`);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium clothing
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Showing {products.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            console.log(`Rendering product ${index + 1}:`, product.name);
            return (
              <ProductCard key={product.id} product={product} />
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;