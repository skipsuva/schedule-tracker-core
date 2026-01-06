import { z } from 'zod'

/**
 * Activity validation schemas.
 */

export const createActivitySchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
})

export const updateActivitySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  start_date: z.date().optional(),
  end_date: z.date().nullable().optional(),
})

// TODO: Add more activity validation schemas as needed
// - ActivityScheduleSchema (for recurring patterns)
// - ActivityCostSchema
// - ActivityRegistrationSchema
