# Architecture

This document describes the architectural decisions, patterns, and conventions used in Keel.

## Data Ownership Model

### Household as Root Boundary

All domain data in Keel is scoped to a `household_id`. The household is the primary organizational unit, not individual users or children. This reflects the reality that parents manage activities, schedules, and costs at the household level.

**Key principles:**
- Every domain table includes a `household_id` column
- Authorization checks always verify household membership
- Data queries are filtered by `household_id` at the database level
- Users can belong to multiple households (e.g., shared custody scenarios)

**Example structure:**
```
households (id, name, timezone, created_at)
  ├── household_members (household_id, user_id, role)
  ├── children (household_id, name, birth_date)
  ├── activities (household_id, name, start_date, end_date)
  └── costs (household_id, activity_id, amount, date)
```

## Authentication & Authorization

### Authentication

Keel uses Supabase Auth with support for:
- Email/password authentication
- Google OAuth
- Two-factor authentication (2FA)

Authentication state is managed by Supabase and accessed via the Supabase client.

### Authorization: Row Level Security (RLS)

**RLS is the primary authorization layer.** All authorization logic lives in database policies, not application code.

**Principles:**
- Every table has RLS enabled
- Policies check household membership before allowing access
- Policies are tested and versioned alongside migrations
- Client-side permission checks are for UX only, not security

**Policy pattern:**
```sql
-- Example: Users can only access activities for households they belong to
CREATE POLICY "Users can view activities for their households"
  ON activities FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );
```

**Policy organization:**
- Policies are documented in `packages/db/policies/`
- Each table has a corresponding policy file
- Policies are applied via migrations

## Frontend ↔ Database Interaction Flow

### Data Fetching

**Preferred pattern:** Direct Supabase queries in Server Components

```typescript
// ✅ Preferred: Server Component with direct query
export default async function ActivitiesPage() {
  const { data } = await supabase
    .from('activities')
    .select('*')
    .eq('household_id', householdId);
  
  return <ActivitiesList activities={data} />;
}
```

**When to use API routes:**
- Mutations (INSERT, UPDATE, DELETE)
- Operations with side effects (sending emails, webhooks)
- Operations requiring service role key
- External API integrations

**When to use TanStack Query:**
- Client-side data fetching (e.g., search, filters)
- Optimistic updates
- Background refetching
- Client-only state management

### Component Hierarchy

```
Server Component (data fetching)
  └── Client Component (interactivity)
      └── Server Component (nested data)
```

**Rules:**
- Default to Server Components
- Use `'use client'` only when needed (hooks, event handlers, browser APIs)
- Keep Server Components as the outer layer when possible
- Pass data down, not functions up (for Server Components)

## Date & Time Handling

### Philosophy

**Dates and timezones must never surprise the user.** All date handling is explicit and timezone-aware.

### Storage

- **All timestamps stored in UTC** in the database
- Use `timestamptz` (timestamp with timezone) for all date columns
- Never store dates as strings or in local timezone

### Interpretation

- **Household timezone** is the source of truth for display and business logic
- Each household has a `timezone` field (e.g., 'America/New_York')
- All date operations use `luxon` for timezone-aware calculations

### Implementation

**Centralized utilities** in `apps/web/lib/dates.ts`:

```typescript
// Convert UTC timestamp to household timezone
export function toHouseholdTime(utcDate: Date, timezone: string): DateTime

// Convert household time to UTC for storage
export function toUTC(householdDate: DateTime, timezone: string): Date

// Format date for display in household timezone
export function formatForHousehold(date: Date, timezone: string, format: string): string
```

**Business rules** in `packages/shared/date-rules.ts`:
- Activity scheduling validation
- Date range calculations
- Recurring event logic

**Usage pattern:**
1. User inputs date/time in household timezone
2. Convert to UTC before storing
3. Convert back to household timezone for display
4. All comparisons use UTC or explicit timezone conversion

## Server vs Client Components

### Default: Server Components

Server Components are the default. They:
- Run only on the server
- Can directly access Supabase
- Don't send JavaScript to the client
- Can't use hooks or browser APIs

### When to Use Client Components

Add `'use client'` when you need:
- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Context providers
- TanStack Query (client-side data fetching)

### Pattern: Server Component Wrapper

```typescript
// Server Component (data fetching)
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// Client Component (interactivity)
'use client'
export function ClientComponent({ data }) {
  const [state, setState] = useState();
  return <div onClick={handleClick}>...</div>;
}
```

## Where DB Queries Are Allowed

### ✅ Allowed

- **Server Components** - Direct Supabase queries
- **API Route Handlers** - Direct Supabase queries
- **Server Actions** - Direct Supabase queries

### ❌ Not Allowed

- **Client Components** - Must use API routes or Server Actions
- **React Hooks** - Use TanStack Query with API routes
- **Middleware** - Use for redirects, not data fetching

## Where Side Effects Belong

### Mutations

- **API Route Handlers** (`app/api/*/route.ts`)
- **Server Actions** (`app/actions.ts` or co-located)

### External Integrations

- **API Route Handlers** - Webhooks, email sending, external APIs
- **Server Actions** - Simple mutations that don't need webhook support

### Background Jobs

- Future: Supabase Edge Functions or external job queue
- Not implemented yet

## Component Organization

### File Structure

```
components/
├── ui/              # Reusable UI components (buttons, inputs, etc.)
├── features/        # Feature-specific components
│   └── activities/  # Activity-related components
└── layouts/         # Layout components
```

### Naming Conventions

- **Components**: PascalCase (`ActivityCard.tsx`)
- **Files**: Match component name (`ActivityCard.tsx`)
- **Folders**: kebab-case for routes, PascalCase for component folders
- **Hooks**: camelCase starting with `use` (`useActivities.ts`)

### Component Patterns

**Server Component (data fetching):**
```typescript
export default async function ActivitiesList() {
  const activities = await getActivities();
  return <div>...</div>;
}
```

**Client Component (interactivity):**
```typescript
'use client'
export function ActivityForm() {
  const { register, handleSubmit } = useForm();
  return <form>...</form>;
}
```

**Shared Component (used by both):**
```typescript
// No 'use client' - can be imported by Server Components
export function ActivityCard({ activity }: { activity: Activity }) {
  return <div>...</div>;
}
```

## Adding New Domain Tables

### Process

1. **Design the schema** - Document in `packages/db/schema.md`
2. **Create migration** - Add to `packages/db/migrations/`
3. **Add RLS policies** - Create policy file in `packages/db/policies/`
4. **Apply migration** - Test locally with `supabase db reset`
5. **Generate types** - Run `npm run generate-types`
6. **Add validators** - Create Zod schemas in `packages/shared/validators/`
7. **Add types** - Create TypeScript types in `packages/shared/types/`

### Checklist

- [ ] Table includes `household_id` column
- [ ] Table includes `created_at` and `updated_at` timestamps
- [ ] RLS is enabled on the table
- [ ] Policies are created for SELECT, INSERT, UPDATE, DELETE
- [ ] Policies check household membership
- [ ] Migration is tested locally
- [ ] Types are generated and imported
- [ ] Validators are created for user input

## Mobile Preparation

### Shared Domain Logic

- Business logic lives in `packages/shared/`
- No browser-only assumptions in core logic
- Date utilities work in any JavaScript environment
- Validators are framework-agnostic

### Future Mobile App

- Can import `packages/shared/` directly
- Uses same validators and business rules
- Connects to same Supabase backend
- RLS policies apply regardless of client
