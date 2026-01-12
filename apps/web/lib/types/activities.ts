export type Activity = {
  id: string
  household_id: string
  child_id: string
  title: string
  start_at: string
  end_at: string
  created_at: string
  recurrence_weekday?: number | null
  recurrence_start_time?: string | null
  recurrence_end_time?: string | null
  recurrence_starts_on?: string | null
  recurrence_ends_on?: string | null
}

export type ActivityInstance = {
  id: string
  activity_id: string
  household_id: string
  starts_at: string
  ends_at: string
  all_day: boolean
  cost_cents: number | null
  notes: string | null
  created_at: string
}
