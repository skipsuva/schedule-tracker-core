# Cursor Prompt 2.0: Weekly Recurrence Prime Directive

We are adding weekly recurrence support.

Recurrence is a rule attached to an ACTIVITY.
Recurrence generates ACTIVITY_INSTANCES.

Hard rules:
- Do not replace or rename existing tables.
- Do not introduce a new “template” table.
- ACTIVITY_INSTANCES remain the only time-based records.
- Recurrence is optional and simple (weekly only).
- Instance generation is explicit, not automatic.

Scope limits:
- Weekly recurrence only.
- No conflict detection.
- No editing or regeneration logic yet.
- No background jobs or cron.

Optimize for correctness, clarity, and future editability.




# Cursor Prompt 2.1: Add Weekly Recurrence Fields to ACTIVITIES

Extend the ACTIVITIES table to support a single weekly recurrence rule.

Add the following nullable fields:
- recurrence_weekday (integer, 0–6 where 0 = Sunday)
- recurrence_start_time (time)
- recurrence_end_time (time)
- recurrence_starts_on (date)
- recurrence_ends_on (date, nullable)

Rules:
- These fields define ONE weekly recurrence rule.
- If any required recurrence field is missing, the activity is non-recurring.
- Do not add recurrence logic to ACTIVITY_INSTANCES.

Deliverable:
- SQL migration to alter the ACTIVITIES table.
- No new tables.



# Cursor Prompt 2.2: Create Weekly Instance Expansion Logic

Implement server-side logic to expand an ACTIVITY into ACTIVITY_INSTANCES.

Inputs:
- activity_id
- range_start (date)
- range_end (date)

Behavior:
- Load the ACTIVITY.
- If it has no recurrence fields, do nothing.
- Generate all dates within the range that match:
  - recurrence_weekday
  - recurrence_starts_on / recurrence_ends_on
- For each date:
  - Combine date + recurrence_start_time → starts_at
  - Combine date + recurrence_end_time → ends_at
  - Create an ACTIVITY_INSTANCE linked to the ACTIVITY

Rules:
- Weekly recurrence only.
- No deduplication.
- No conflict checking.
- No edits to existing instances.

Return:
- List of created ACTIVITY_INSTANCES.





# Cursor Prompt 2.3: Minimal UI to Define Weekly Recurrence

Add recurrence fields to the Activity creation/edit flow.

UI additions:
- Weekday selector
- Start time
- End time
- Start date
- Optional end date

Behavior:
- Saving an activity stores recurrence fields.
- No preview of generated instances.
- No automatic instance creation.

Constraints:
- Keep the UI minimal and obvious.
- This UI defines intent only.




# Cursor Prompt 2.4: Manual Instance Generation UI (Developer Tool)

Create a simple way to manually generate instances.

Route:
- `/generate-instances`

Behavior:
- Select an ACTIVITY.
- Choose a date range.
- Trigger instance generation.
- Display created ACTIVITY_INSTANCES.

Constraints:
- This is a debug/developer tool.
- No automation.
- No scheduling logic beyond weekly recurrence.

Purpose:
To verify recurrence correctness before automation.