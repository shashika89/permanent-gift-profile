import { createClient } from '@supabase/supabase-js';

// Pasting strings directly guarantees Next.js can see them right now
const supabaseUrl = 'https://kdqkazrwfinikfjauicc.supabase.co';
const supabaseAnonKey = 'sb_publishable_0XF2sxeGfN-lA5WNp-hMNg_ls0wPwqv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);