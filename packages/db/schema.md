# Database Schema

This document describes the database schema for Keel. The schema follows a **household-first** data model where all domain data is scoped to a `household_id`.

## Core Principles

- **Household is the root boundary** - All domain tables include `household_id`
- **Row Level Security (RLS)** - All tables have RLS enabled with household-based policies
- **UTC timestamps** - All `created_at` and `updated_at` fields use `timestamptz` (UTC)
- **Cascade deletes** - Child records are deleted when household is deleted

## Tables

### households

The root table for all domain data. Every user belongs to one or more households.

- `id` (uuid, primary key)
- `name` (text, required)
- `timezone` (text, required) - IANA timezone string (e.g., 'America/New_York')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Users can view households they belong to
- Users can create households (and automatically become owner)
- Users can update households they own
- Users can delete households they own

### household_members

Junction table linking users to households with roles.

- `id` (uuid, primary key)
- `household_id` (uuid, foreign key → households.id, cascade delete)
- `user_id` (uuid, foreign key → auth.users.id)
- `role` (text, required) - 'owner' or 'member'
- `created_at` (timestamptz)

**Indexes:**
- `idx_household_members_household_id` on `household_id`
- `idx_household_members_user_id` on `user_id`
- Unique constraint on `(household_id, user_id)`

**RLS Policies:**
- Users can view members of their households
- Users can add members to their households (owners only)
- Users can update roles in their households (owners only)
- Users can remove members from their households (owners only)

### children

Children belonging to a household.

- `id` (uuid, primary key)
- `household_id` (uuid, foreign key → households.id, cascade delete)
- `name` (text, required)
- `birth_date` (date, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Indexes:**
- `idx_children_household_id` on `household_id`

**RLS Policies:**
- Users can view children in their households
- Users can create children in their households
- Users can update children in their households
- Users can delete children in their households

### activities

Activities, camps, programs, and scheduled events.

- `id` (uuid, primary key)
- `household_id` (uuid, foreign key → households.id, cascade delete)
- `name` (text, required)
- `start_date` (timestamptz, required)
- `end_date` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Indexes:**
- `idx_activities_household_id` on `household_id`
- `idx_activities_start_date` on `start_date`

**RLS Policies:**
- Users can view activities in their households
- Users can create activities in their households
- Users can update activities in their households
- Users can delete activities in their households

## Future Tables

The following tables are planned but not yet implemented:

### activity_schedules
- Recurring patterns for activities (daily, weekly, etc.)

### activity_costs
- Costs associated with activities (registration fees, materials, etc.)

### activity_registrations
- Links children to activities they're registered for

### costs
- General cost tracking (not tied to specific activities)

## Relationships

```
households (1) ──< (many) household_members
households (1) ──< (many) children
households (1) ──< (many) activities
```

## Migration Workflow

1. Design the schema change
2. Create migration file in `migrations/`
3. Create/update RLS policies in `policies/`
4. Test locally with `supabase db reset`
5. Update this documentation
6. Apply to production

## Notes

- All foreign keys use `ON DELETE CASCADE` to ensure data consistency
- All tables include `created_at` and `updated_at` timestamps
- All date/time fields use `timestamptz` (timestamp with timezone) stored in UTC
- RLS policies are the primary authorization mechanism - never bypass them
