import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

// This client is used for authentication only (sign up, sign in, session).
// Notes data no longer goes through this client directly -- it goes
// through the backend API (src/lib/api.js), which is what actually talks
// to the notes table using the service_role key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
