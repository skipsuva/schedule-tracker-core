import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// TODO: Implement client-side Supabase client
// This client is used in Client Components and React hooks
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
