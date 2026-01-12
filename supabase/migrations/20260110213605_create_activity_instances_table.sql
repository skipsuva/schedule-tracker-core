-- Create activity_instances table
-- Represents concrete scheduled occurrences of activities
-- Linked to activities via activity_id

CREATE TABLE activity_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL,
  household_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  all_day boolean NOT NULL DEFAULT false,
  cost_cents integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Note: FK constraints for activity_id and household_id will be added when those tables exist
-- or when foreign key constraints are ready to be enforced
