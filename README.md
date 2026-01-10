# Keel
The structure beneath your family plans.

Keel is a calm, household-level web application that helps parents replace spreadsheets used to track kids’ activities, camps, schedules, and costs.

The product prioritizes:
- correctness over cleverness
- low cognitive load
- household-first data modeling
- predictable handling of dates, time, and money


## Tech Stack

### Frontend / App Layer
- Next.js (App Router)  
  UI, routing, and server-side logic
- React Server Components  
  Default data-fetching mechanism
- TypeScript  
  Strict, explicit typing

### Backend / Data Layer
- Supabase
  - Postgres (primary data store)
  - Auth (email, Google OAuth, optional 2FA)
  - Row Level Security (RLS) as the source of truth for authorization

### Supporting Libraries
- UI: Tailwind CSS
- Forms & validation: react-hook-form, zod
- Dates & timezones: luxon
- Client async state (when needed): TanStack Query


## Responsibility Boundaries

Next.js:
- Screens
- Server-side data fetching
- Mutations

Supabase Postgres:
- Data shape
- Constraints
- Relationships

Supabase RLS:
- Authorization
- Household isolation
- Permissions

Shared packages:
- Pure business logic
- No UI
- No Supabase access

Client components:
- UI only
- No permission logic

Guiding principle:
If it affects who can see or modify data, it belongs in the database.


## Local Development

### Prerequisites
- Node.js 18+
- Docker
- Supabase CLI

Install the Supabase CLI:

    brew install supabase/tap/supabase


### Start Local Supabase

    supabase start

This runs locally:
- Postgres
- Auth
- Storage
- Row Level Security

Conceptually, this is equivalent to running:
docker-compose up for your backend.


### Environment Variables

Create a `.env.local` file at the repo root:

    NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

These values are printed by the Supabase CLI when running locally.


### Run the App

    npm install
    npm run dev

The app will connect to local Supabase, not staging or production.


## Environments

Keel uses a separate Supabase project per environment.

- Local: Supabase CLI
- Staging: Dedicated Supabase project
- Production: Dedicated Supabase project

Schema, RLS, and functions are promoted via migrations.
Data is never copied between environments.


## Repository Structure (High Level)

apps/web  
Next.js application

packages/shared  
Pure domain logic (dates, rules, calculations)

packages/db  
Schema documentation, migrations, RLS policies

supabase  
Supabase configuration and local setup

docs  
Architecture, scope, decisions, prompts


## Development Principles

- Database changes require migrations
- Authorization is enforced via RLS, not application logic
- Documentation is updated alongside code
- Avoid premature abstraction
- Prefer clarity over cleverness

This repository is the shared memory between the developer and Cursor.