'use server'

import { DateTime } from 'luxon'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Activity, ActivityInstance } from '@/lib/types/activities'

/**
 * Expands an ACTIVITY with recurrence fields into ACTIVITY_INSTANCES within a date range.
 * 
 * @param activity_id - The ID of the activity to expand
 * @param range_start - Start date of the range (ISO date string, e.g., "2024-01-01")
 * @param range_end - End date of the range (ISO date string, e.g., "2024-12-31")
 * @returns Array of created ActivityInstance objects
 */
export async function expandActivityInstances(
  activity_id: string,
  range_start: string,
  range_end: string
): Promise<ActivityInstance[]> {
  const supabase = createSupabaseServerClient()

  // Load the activity with recurrence fields
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activity_id)
    .single()

  if (activityError) {
    throw activityError
  }

  if (!activity) {
    throw new Error(`Activity with id ${activity_id} not found`)
  }

  // Check if recurrence is configured
  // Required fields: recurrence_weekday, recurrence_start_time, recurrence_end_time, recurrence_starts_on
  const isRecurring =
    activity.recurrence_weekday !== null &&
    activity.recurrence_weekday !== undefined &&
    activity.recurrence_start_time !== null &&
    activity.recurrence_start_time !== undefined &&
    activity.recurrence_end_time !== null &&
    activity.recurrence_end_time !== undefined &&
    activity.recurrence_starts_on !== null &&
    activity.recurrence_starts_on !== undefined

  if (!isRecurring) {
    return []
  }

  // Parse date range
  const rangeStartDate = DateTime.fromISO(range_start, { zone: 'local' })
  const rangeEndDate = DateTime.fromISO(range_end, { zone: 'local' })
  const recurrenceStartsOn = DateTime.fromISO(activity.recurrence_starts_on!, { zone: 'local' })
  const recurrenceEndsOn = activity.recurrence_ends_on
    ? DateTime.fromISO(activity.recurrence_ends_on, { zone: 'local' })
    : null

  // Determine the effective start and end dates
  const effectiveStart = rangeStartDate > recurrenceStartsOn ? rangeStartDate : recurrenceStartsOn
  const effectiveEnd = recurrenceEndsOn
    ? (rangeEndDate < recurrenceEndsOn ? rangeEndDate : recurrenceEndsOn)
    : rangeEndDate

  // Convert weekday from stored format (0=Sunday, 6=Saturday) to Luxon format (1=Monday, 7=Sunday)
  const luxonWeekday = activity.recurrence_weekday === 0 ? 7 : activity.recurrence_weekday

  // Generate all dates in the range that match the weekday
  const matchingDates: DateTime[] = []
  let currentDate = effectiveStart.startOf('day')

  while (currentDate <= effectiveEnd.endOf('day')) {
    // Luxon weekday: 1=Monday, 7=Sunday
    if (currentDate.weekday === luxonWeekday) {
      matchingDates.push(currentDate)
    }
    currentDate = currentDate.plus({ days: 1 })
  }

  // If no matching dates, return empty array
  if (matchingDates.length === 0) {
    return []
  }

  // Parse time strings (format: "HH:mm:ss" or "HH:mm")
  const startTimeParts = activity.recurrence_start_time!.split(':')
  const endTimeParts = activity.recurrence_end_time!.split(':')
  const startHour = parseInt(startTimeParts[0], 10)
  const startMinute = parseInt(startTimeParts[1], 10)
  const endHour = parseInt(endTimeParts[0], 10)
  const endMinute = parseInt(endTimeParts[1], 10)

  // Create instances for each matching date
  const instancesToInsert = matchingDates.map((date) => {
    // Combine date + time in local timezone, then convert to UTC
    const startsAt = date
      .set({ hour: startHour, minute: startMinute, second: 0, millisecond: 0 })
      .toUTC()
    const endsAt = date
      .set({ hour: endHour, minute: endMinute, second: 0, millisecond: 0 })
      .toUTC()

    return {
      activity_id: activity.id,
      household_id: activity.household_id,
      starts_at: startsAt.toISO(),
      ends_at: endsAt.toISO(),
      all_day: false,
    }
  })

  // Batch insert all instances
  const { data: insertedInstances, error: insertError } = await supabase
    .from('activity_instances')
    .insert(instancesToInsert)
    .select()

  if (insertError) {
    throw insertError
  }

  return insertedInstances || []
}
