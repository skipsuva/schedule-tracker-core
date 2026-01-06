import { DateTime } from 'luxon'

/**
 * Centralized date and timezone utilities for Keel.
 * 
 * All dates are stored in UTC in the database and interpreted
 * using the household's timezone for display and business logic.
 */

/**
 * Convert a UTC Date to a DateTime in the household's timezone.
 * 
 * @param utcDate - Date object stored in UTC
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns DateTime object in the household timezone
 */
export function toHouseholdTime(utcDate: Date, timezone: string): DateTime {
  // TODO: Implement conversion from UTC to household timezone
  return DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone)
}

/**
 * Convert a DateTime in household timezone to UTC Date for storage.
 * 
 * @param householdDate - DateTime object in household timezone
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns Date object in UTC
 */
export function toUTC(householdDate: DateTime, timezone: string): Date {
  // TODO: Implement conversion from household timezone to UTC
  return householdDate.setZone(timezone).toUTC().toJSDate()
}

/**
 * Format a UTC date for display in the household's timezone.
 * 
 * @param date - Date object stored in UTC
 * @param timezone - IANA timezone string
 * @param format - Luxon format string (e.g., 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatForHousehold(
  date: Date,
  timezone: string,
  format: string = 'MMM d, yyyy'
): string {
  // TODO: Implement date formatting in household timezone
  return toHouseholdTime(date, timezone).toFormat(format)
}

/**
 * Parse a date string in household timezone and convert to UTC.
 * 
 * @param dateString - Date string in household timezone
 * @param timezone - IANA timezone string
 * @param format - Luxon format string (optional)
 * @returns Date object in UTC
 */
export function parseHouseholdDate(
  dateString: string,
  timezone: string,
  format?: string
): Date {
  // TODO: Implement parsing from household timezone to UTC
  const dt = format
    ? DateTime.fromFormat(dateString, format, { zone: timezone })
    : DateTime.fromISO(dateString, { zone: timezone })
  
  return dt.toUTC().toJSDate()
}

/**
 * Get the current date/time in the household's timezone.
 * 
 * @param timezone - IANA timezone string
 * @returns DateTime object in household timezone
 */
export function nowInHouseholdTimezone(timezone: string): DateTime {
  // TODO: Implement getting current time in household timezone
  return DateTime.now().setZone(timezone)
}
