import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 Supabase Configuration:");
console.log("URL:", supabaseUrl);
console.log("ANON KEY:", supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'MISSING');
console.log("URL Type:", typeof supabaseUrl);
console.log("Key Type:", typeof supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error("URL exists:", !!supabaseUrl);
  console.error("Key exists:", !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

// Create supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence for debugging
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

console.log("✅ Supabase client created successfully");

// Test connection function
async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection...");
  
  try {
    // Test 1: Simple health check
    console.log("Test 1: Health check");
    const healthCheck = await supabase.from('products').select('count', { count: 'exact', head: true });
    console.log("Health check result:", healthCheck);
    
    // Test 2: Simple query
    console.log("Test 2: Simple query");
    const { data, error, status, statusText } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);
    
    console.log("Simple query results:");
    console.log("- Status:", status);
    console.log("- Status Text:", statusText);
    console.log("- Data:", data);
    console.log("- Error:", error);
    
    if (error) {
      console.error("❌ Query Error Details:");
      console.error("- Message:", error.message);
      console.error("- Details:", error.details);
      console.error("- Hint:", error.hint);
      console.error("- Code:", error.code);
    } else {
      console.log("✅ Connection test successful!");
    }
    
  } catch (err: any) {
    console.error("🔥 Connection test failed:");
    console.error("- Error:", err.message);
    console.error("- Stack:", err.stack);
  }
}

// Run test on import
testSupabaseConnection();

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string;
          sizes: string[];
          colors: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string;
          sizes: string[];
          colors: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image_url?: string;
          sizes?: string[];
          colors?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          phone: string;
          date_of_birth: string;
          bio: string;
          address: any;
          preferences: any;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          username?: string;
          phone?: string;
          date_of_birth?: string;
          bio?: string;
          address?: any;
          preferences?: any;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          username?: string;
          phone?: string;
          date_of_birth?: string;
          bio?: string;
          address?: any;
          preferences?: any;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_amount: number;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};