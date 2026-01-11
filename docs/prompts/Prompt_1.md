# Cursor Prompt 0: First Vertical Slice (Prime Directive)

You are helping build the very first vertical slice of a brand-new scheduling application.

The goal of this slice is NOT feature completeness.
The goal is to prove the end-to-end loop works:

UI → server logic → Supabase → back to UI.

Constraints you must follow:
- Build the smallest possible implementation.
- Do not introduce recurrence, sessions, conflicts, or calendars.
- Do not create abstractions for future features.
- Prefer clarity over flexibility.
- Use boring, explicit code.
- If something feels “too early,” skip it.

End state definition:
- A single `activities` table exists in Supabase.
- A user can create one activity via the UI.
- The activity is persisted and can be read back.
- The code is easy to delete or extend later.

If you are unsure, choose the simpler option.

# Cursor Prompt 1: Supabase Schema (Activities)

Create the initial Supabase schema for the first vertical slice.

Requirements:
- Create exactly one table called `activities`.
- Use a UUID primary key.
- Store a single activity with a start and end time.
- No recurrence, no foreign keys, no joins.

Schema:
- id (uuid, primary key, default generated)
- name (text, required)
- child_name (text, required)
- start_at (timestamptz, required)
- end_at (timestamptz, required)
- created_at (timestamptz, default now)

Deliverables:
- SQL that can be run via Supabase.
- No migrations for future features.
- Keep it intentionally minimal.


# Cursor Prompt 2: Create Activity Server Logic

Implement server-side logic to create an activity.

Requirements:
- Accept input: name, child_name, start_at, end_at.
- Insert a row into the `activities` table.
- Return the created record.
- No advanced validation.
- No conflict checking.
- No recurrence logic.
- No auth edge cases unless already required by the project.

Constraints:
- Keep the function small and readable.
- Do not abstract database access.
- Do not add logging frameworks or helpers.

Goal:
This function should make Supabase “real” and unblock UI work.


# Cursor Prompt 3: Minimal UI to Create an Activity

Create a minimal UI page for creating an activity.

Route:
- `/new-activity`

UI elements:
- Text input for activity name
- Text input for child name
- Datetime input for start time
- Datetime input for end time
- Save button

Behavior:
- On submit, call the create-activity server logic.
- Display or log the returned activity.
- No styling polish required.
- No client-side validation beyond required fields.

Constraints:
- This page is disposable scaffolding.
- Do not build lists, calendars, or navigation.
- Prefer clarity over UX polish.

End state:
Typing values and clicking save results in a row appearing in Supabase.


# Cursor Prompt 4: Read Activities (Sanity Check)

Add the simplest possible way to read activities.

Route:
- `/activities`

Behavior:
- Fetch all rows from the `activities` table.
- Render them as a plain list.
- No sorting, grouping, or formatting beyond readability.

Constraints:
- No pagination.
- No filters.
- No empty states or loading spinners.
- Keep the implementation obvious.

Purpose:
This page exists to confirm data persistence and accelerate iteration.