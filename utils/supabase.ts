import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This single 'supabase' object will be your developer handle to pull and push data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);