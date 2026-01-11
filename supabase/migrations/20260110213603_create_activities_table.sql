-- Create activities table for first vertical slice
-- Minimal schema: includes household_id for household-first ownership
-- Note: FK constraints for household_id and child_id will be added when those tables exist

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL,
  child_id uuid NOT NULL,
  title text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
