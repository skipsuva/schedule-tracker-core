import { DateTime } from 'luxon'

/**
 * Date and timezone business rules for Keel.
 * 
 * This module contains business logic related to dates, such as:
 * - Activity scheduling validation
 * - Date range calculations
 * - Recurring event logic
 */

/**
 * Validate that an activity's date range is valid.
 * 
 * @param startDate - Activity start date
 * @param endDate - Activity end date (optional)
 * @returns True if the date range is valid
 */
export function isValidActivityDateRange(
  startDate: Date,
  endDate: Date | null
): boolean {
  // TODO: Implement date range validation
  // - End date must be after start date if provided
  // - Dates should be in the future for new activities (or allow past?)
  if (endDate && endDate < startDate) {
    return false
  }
  return true
}

/**
 * Check if a date falls within an activity's date range.
 * 
 * @param date - Date to check
 * @param startDate - Activity start date
 * @param endDate - Activity end date (optional)
 * @returns True if date is within the activity range
 */
export function isDateInActivityRange(
  date: Date,
  startDate: Date,
  endDate: Date | null
): boolean {
  // TODO: Implement date range checking
  if (date < startDate) {
    return false
  }
  if (endDate && date > endDate) {
    return false
  }
  return true
}

/**
 * Calculate the duration of an activity in days.
 * 
 * @param startDate - Activity start date
 * @param endDate - Activity end date (optional, defaults to start date)
 * @returns Number of days
 */
export function calculateActivityDuration(
  startDate: Date,
  endDate: Date | null
): number {
  // TODO: Implement duration calculation
  // Use luxon for timezone-aware calculations
  const start = DateTime.fromJSDate(startDate)
  const end = endDate ? DateTime.fromJSDate(endDate) : start
  
  return Math.ceil(end.diff(start, 'days').days)
}

// TODO: Add more date business rules as needed
// - Recurring event pattern validation
// - Date conflict detection
// - Season/term date calculations
