
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key. Please check .env.local');
}

// Client for customers - uses default storage key
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storageKey: 'kiendrone-customer-auth',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Client for admins - uses a separate storage key to isolate session
export const adminSupabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storageKey: 'kiendrone-admin-auth',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
