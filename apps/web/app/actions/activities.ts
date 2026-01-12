'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Activity } from '@/lib/types/activities'

export async function createActivity(
  household_id: string,
  child_id: string,
  title: string,
  start_at: string,
  end_at: string,
  recurrence_weekday?: number | null,
  recurrence_start_time?: string | null,
  recurrence_end_time?: string | null,
  recurrence_starts_on?: string | null,
  recurrence_ends_on?: string | null
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
      recurrence_weekday: recurrence_weekday ?? null,
      recurrence_start_time: recurrence_start_time ?? null,
      recurrence_end_time: recurrence_end_time ?? null,
      recurrence_starts_on: recurrence_starts_on ?? null,
      recurrence_ends_on: recurrence_ends_on ?? null,
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
