# Row Level Security (RLS) Policies

This directory contains RLS policy files for Keel database tables.

## Policy Organization

Each table should have a corresponding policy file named `{table_name}.sql`.

## Policy Pattern

All policies follow this pattern:

1. **Enable RLS** on the table
2. **SELECT policy** - Users can view data for their households
3. **INSERT policy** - Users can create data for their households
4. **UPDATE policy** - Users can update data for their households
5. **DELETE policy** - Users can delete data for their households

## Household Membership Check

All policies use this pattern to verify household membership:

```sql
household_id IN (
  SELECT household_id FROM household_members
  WHERE user_id = auth.uid()
)
```

## Example Policy File

See `households.sql` for an example of a complete policy file.

## Applying Policies

Policies are applied via migrations. Each migration that creates a table should also create the corresponding RLS policies.

## Testing Policies

Test policies by:
1. Creating test users in different households
2. Verifying users can only access their household's data
3. Verifying users cannot access other households' data
4. Testing all CRUD operations
