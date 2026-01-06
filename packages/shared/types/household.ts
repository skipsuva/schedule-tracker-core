/**
 * Household-related types.
 * 
 * Household is the root boundary for all domain data in Keel.
 */

export interface Household {
  id: string
  name: string
  timezone: string // IANA timezone string (e.g., 'America/New_York')
  created_at: Date
  updated_at: Date
}

export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  role: 'owner' | 'member'
  created_at: Date
}

export interface Child {
  id: string
  household_id: string
  name: string
  birth_date: Date | null
  created_at: Date
  updated_at: Date
}
