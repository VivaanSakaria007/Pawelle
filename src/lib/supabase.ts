import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    '%c[PAWELLE Database Architecture]%c Operating in local persistent store mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env for direct Supabase cloud sync.',
    'color: #A65B46; font-weight: bold;',
    'color: inherit;'
  );
}
