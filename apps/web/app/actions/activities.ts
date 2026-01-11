'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Activity } from '@/lib/types/activities'

export async function createActivity(
  household_id: string,
  child_id: string,
  title: string,
  start_at: string,
  end_at: string
): Promise<Activity> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from('activities')
    .insert({
      household_id,
      child_id,
      title,
      start_at,
      end_at,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getActivities(): Promise<Activity[]> {
  const supabase = createSupabaseServerClient()

  const { data, error } = await supabase
    .from('activities')
    .select()

  if (error) {
    throw error
  }

  return data || []
}
