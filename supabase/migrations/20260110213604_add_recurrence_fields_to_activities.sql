-- Add weekly recurrence fields to activities table
-- These fields support a single weekly recurrence rule
-- If any required field (weekday, start_time, end_time, starts_on) is NULL, the activity is non-recurring
-- recurrence_ends_on can be NULL to indicate indefinite recurrence

ALTER TABLE activities
  ADD COLUMN recurrence_weekday integer,
  ADD COLUMN recurrence_start_time time,
  ADD COLUMN recurrence_end_time time,
  ADD COLUMN recurrence_starts_on date,
  ADD COLUMN recurrence_ends_on date;

-- Add check constraint to ensure weekday is valid (0-6, where 0 = Sunday)
ALTER TABLE activities
  ADD CONSTRAINT recurrence_weekday_check CHECK (
    recurrence_weekday IS NULL OR (recurrence_weekday >= 0 AND recurrence_weekday <= 6)
  );
