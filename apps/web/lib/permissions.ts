import { createServerSupabaseClient } from './supabase/server'

/**
 * Permission checking utilities for Keel.
 * 
 * These are helper functions for checking permissions in Server Components.
 * Note: RLS policies are the primary authorization layer. These functions
 * are for convenience and should not be relied upon for security.
 */

/**
 * Check if the current user is a member of the specified household.
 * 
 * @param householdId - UUID of the household
 * @returns Promise<boolean> - True if user is a member
 */
export async function isHouseholdMember(householdId: string): Promise<boolean> {
  // TODO: Implement household membership check
  // Query household_members table to verify user belongs to household
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('household_members')
    .select('id')
    .eq('household_id', householdId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return true
}

/**
 * Get all household IDs that the current user belongs to.
 * 
 * @returns Promise<string[]> - Array of household IDs
 */
export async function getUserHouseholdIds(): Promise<string[]> {
  // TODO: Implement fetching user's households
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('household_members')
    .select('household_id')
  
  if (error || !data) {
    return []
  }
  
  return data.map((row) => row.household_id)
}

/**
 * Check if the current user has a specific role in a household.
 * 
 * @param householdId - UUID of the household
 * @param role - Role to check (e.g., 'owner', 'member')
 * @returns Promise<boolean> - True if user has the role
 */
export async function hasHouseholdRole(
  householdId: string,
  role: string
): Promise<boolean> {
  // TODO: Implement role checking
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('role', role)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return true
}
