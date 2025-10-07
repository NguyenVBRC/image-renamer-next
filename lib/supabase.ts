import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Create a fallback client if environment variables are not set
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

export type Database = {
  public: {
    Tables: {
      user_usage: {
        Row: {
          id: string;
          user_id: string;
          usage_count: number;
          last_reset: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          usage_count?: number;
          last_reset?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          usage_count?: number;
          last_reset?: string;
          created_at?: string;
        };
      };
    };
  };
};
