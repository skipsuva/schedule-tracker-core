import { z } from 'zod'

/**
 * Household validation schemas.
 */

export const createHouseholdSchema = z.object({
  name: z.string().min(1).max(255),
  timezone: z.string().refine(
    (tz) => {
      // TODO: Validate IANA timezone string
      // Use Intl.supportedValuesOf('timeZone') or luxon
      return true
    },
    { message: 'Invalid timezone' }
  ),
})

export const updateHouseholdSchema = createHouseholdSchema.partial()

export const addHouseholdMemberSchema = z.object({
  household_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['owner', 'member']),
})

export const createChildSchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  birth_date: z.date().nullable().optional(),
})

export const updateChildSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  birth_date: z.date().nullable().optional(),
})
