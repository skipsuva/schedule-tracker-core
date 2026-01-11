import { createClient } from '@supabase/supabase-js'

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Use service role key for server-side operations (bypasses RLS)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    const missing = []
    if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    throw new Error(
      `Missing Supabase environment variables: ${missing.join(', ')}. ` +
      `Make sure .env.local exists at apps/web with SUPABASE_SERVICE_ROLE_KEY, and restart the dev server.`
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
