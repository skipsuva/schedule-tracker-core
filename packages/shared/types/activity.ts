/**
 * Activity-related types.
 * 
 * Activities represent camps, programs, classes, and other scheduled events.
 */

export interface Activity {
  id: string
  household_id: string
  name: string
  start_date: Date
  end_date: Date | null
  created_at: Date
  updated_at: Date
}

// TODO: Add more activity-related types as needed
// - ActivitySchedule (recurring patterns)
// - ActivityCost
// - ActivityRegistration
