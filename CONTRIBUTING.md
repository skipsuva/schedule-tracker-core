# Contributing to Keel

This document outlines coding standards, file organization rules, and development workflows for Keel.

## Coding Standards

### TypeScript

- **Strict mode enabled** - All TypeScript files use strict type checking
- **No `any` types** - Use `unknown` or proper types instead
- **Explicit return types** - Functions should have explicit return types
- **Prefer interfaces over types** - Use interfaces for object shapes
- **Use type imports** - `import type { ... }` for type-only imports

### React

- **Functional components only** - No class components
- **Server Components by default** - Only use `'use client'` when necessary
- **Props interfaces** - Define props interfaces above components
- **Component composition** - Prefer composition over prop drilling
- **No default exports for components** - Use named exports (except page/layout files)

### Code Style

- **2 spaces** for indentation
- **Semicolons** - Use semicolons
- **Single quotes** - Use single quotes for strings
- **Trailing commas** - Use trailing commas in objects and arrays
- **Max line length** - 100 characters (soft limit)

## File Organization

### Directory Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (app)/             # Main app route group
│   └── api/               # API route handlers
├── components/
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── supabase/          # Supabase clients
│   ├── dates.ts           # Date utilities
│   └── permissions.ts     # Permission helpers
├── hooks/                 # Custom React hooks
└── styles/                # Global styles

packages/
├── shared/                # Shared code
│   ├── types/             # TypeScript types
│   └── validators/        # Zod schemas
└── db/                    # Database code
    ├── migrations/        # Supabase migrations
    └── policies/          # RLS policies
```

### File Naming

- **Components**: PascalCase (`ActivityCard.tsx`)
- **Utilities**: camelCase (`dates.ts`, `permissions.ts`)
- **Types**: camelCase (`activity.ts`, `household.ts`)
- **Routes**: kebab-case (`activity-details/page.tsx`)
- **Config files**: kebab-case (`next.config.js`, `tsconfig.json`)

### File Organization Rules

1. **One component per file** - Each component gets its own file
2. **Co-locate related files** - Keep related components/types together
3. **Index files for exports** - Use `index.ts` to re-export from directories
4. **Separate concerns** - Keep UI, logic, and data fetching separate

## Naming Conventions

### Variables and Functions

- **camelCase** for variables and functions (`getActivities`, `householdId`)
- **PascalCase** for components and types (`ActivityCard`, `Activity`)
- **SCREAMING_SNAKE_CASE** for constants (`MAX_ACTIVITIES`)
- **Descriptive names** - Avoid abbreviations unless widely understood

### Database

- **snake_case** for table and column names (`household_id`, `created_at`)
- **Singular table names** - Use singular (`activity` not `activities`)
- **Timestamps** - Always include `created_at` and `updated_at`

### API Routes

- **RESTful naming** - Use standard REST conventions
- **kebab-case** for route paths (`/api/activities/:id`)
- **Descriptive handlers** - `GET`, `POST`, `PUT`, `DELETE` in route handlers

## Adding a New Domain Table

### Step-by-Step Process

#### 1. Design the Schema

Document the table structure in `packages/db/schema.md`:

```markdown
### activities

Tracks activities, camps, and programs for children.

- `id` (uuid, primary key)
- `household_id` (uuid, foreign key → households.id)
- `name` (text, required)
- `start_date` (timestamptz, required)
- `end_date` (timestamptz, optional)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
```

#### 2. Create Migration

Create a new migration file in `packages/db/migrations/`:

```sql
-- migrations/YYYYMMDDHHMMSS_create_activities.sql

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_household_id ON activities(household_id);
```

#### 3. Add RLS Policies

Create a policy file in `packages/db/policies/activities.sql`:

```sql
-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- SELECT policy: Users can view activities for their households
CREATE POLICY "Users can view activities for their households"
  ON activities FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- INSERT policy: Users can create activities for their households
CREATE POLICY "Users can create activities for their households"
  ON activities FOR INSERT
  WITH CHECK (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- UPDATE policy: Users can update activities for their households
CREATE POLICY "Users can update activities for their households"
  ON activities FOR UPDATE
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );

-- DELETE policy: Users can delete activities for their households
CREATE POLICY "Users can delete activities for their households"
  ON activities FOR DELETE
  USING (
    household_id IN (
      SELECT household_id FROM household_members
      WHERE user_id = auth.uid()
    )
  );
```

#### 4. Apply Migration

Test the migration locally:

```bash
supabase db reset
```

Verify the table and policies are created correctly.

#### 5. Generate TypeScript Types

Run the type generation script:

```bash
npm run generate-types
```

This updates `apps/web/lib/supabase/types.ts` with the new table types.

#### 6. Create Validators

Add Zod schemas in `packages/shared/validators/activities.ts`:

```typescript
import { z } from 'zod';

export const createActivitySchema = z.object({
  household_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  start_date: z.date(),
  end_date: z.date().optional(),
});

export const updateActivitySchema = createActivitySchema.partial();
```

Export from `packages/shared/validators/index.ts`.

#### 7. Create TypeScript Types

Add types in `packages/shared/types/activities.ts`:

```typescript
export interface Activity {
  id: string;
  household_id: string;
  name: string;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
```

Export from `packages/shared/types/index.ts`.

### Checklist

Before considering a new table complete:

- [ ] Schema documented in `packages/db/schema.md`
- [ ] Migration created and tested
- [ ] RLS enabled and policies created
- [ ] Policies tested (can't access other households' data)
- [ ] TypeScript types generated
- [ ] Zod validators created
- [ ] TypeScript types created in shared package
- [ ] All exports added to index files

## RLS Policy Creation Process

### Policy Pattern

Every table follows this pattern:

1. **Enable RLS** - `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. **SELECT policy** - Users can view data for their households
3. **INSERT policy** - Users can create data for their households
4. **UPDATE policy** - Users can update data for their households
5. **DELETE policy** - Users can delete data for their households

### Household Membership Check

All policies use this pattern to check household membership:

```sql
household_id IN (
  SELECT household_id FROM household_members
  WHERE user_id = auth.uid()
)
```

### Testing Policies

Test policies by:

1. Creating test users in different households
2. Verifying users can only access their household's data
3. Verifying users cannot access other households' data
4. Testing all CRUD operations

## Migration Workflow

### Creating Migrations

1. **Use Supabase CLI** - `supabase migration new migration_name`
2. **Name descriptively** - Include what the migration does
3. **Test locally** - Always test with `supabase db reset`
4. **Review carefully** - Migrations are permanent

### Migration Best Practices

- **One logical change per migration** - Don't bundle unrelated changes
- **Include rollback** - Document how to rollback if needed
- **Test with seed data** - Ensure migrations work with existing data
- **Update schema.md** - Keep documentation in sync

### Applying Migrations

**Local development:**
```bash
supabase db reset  # Applies all migrations
```

**Production:**
Migrations are applied via Supabase dashboard or CLI in production environment.

## Code Review Guidelines

### What to Review

- **Type safety** - No `any` types, proper TypeScript usage
- **RLS policies** - Authorization is correctly implemented
- **Date handling** - Dates are timezone-aware and use UTC storage
- **Household scoping** - All queries filter by `household_id`
- **Component patterns** - Server vs Client components used correctly
- **Error handling** - Errors are handled appropriately

### Review Checklist

- [ ] Types are correct and explicit
- [ ] RLS policies are in place and tested
- [ ] Dates use UTC storage and household timezone display
- [ ] Queries filter by `household_id`
- [ ] Server/Client component usage is appropriate
- [ ] Error handling is present
- [ ] Code follows naming conventions
- [ ] No console.logs or debug code

## Questions?

If you're unsure about any convention or pattern, check:
1. This document
2. `ARCHITECTURE.md` for architectural decisions
3. Existing code for examples
4. Ask the team
