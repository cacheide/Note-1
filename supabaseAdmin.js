import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill them in.'
  )
}

// The service_role key bypasses Row Level Security entirely, which is why
// this client only ever exists on the server. It must never be imported
// by frontend code, logged, or committed. All authorization for this
// client's queries is enforced explicitly in the route handlers below —
// there is no RLS safety net once you're using this key.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
