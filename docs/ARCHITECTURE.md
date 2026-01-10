# Architecture

This document is the technical source of truth for Keel.

It describes:
- the system boundaries
- the data model
- how data flows through the system
- what is intentionally *not* modeled yet

If the code and this document disagree, the document should be updated.


## High-Level Architecture

Keel uses a “thin backend” architecture.

There is no traditional API server.

Instead:
- Next.js handles UI and server-side logic
- Supabase provides the database, auth, and authorization
- Authorization is enforced at the database layer via Row Level Security (RLS)

The application talks directly to Supabase using typed queries.


## Core Architectural Principles

Household-first:
All domain data belongs to a household.
Users gain access to data only through household membership.

Database-enforced authorization:
The database is the source of truth for permissions.
The application never decides who can see or edit data.

Explicit time modeling:
All timestamps are stored in UTC.
Households have a canonical timezone.
All rendering is done relative to that timezone.

Incremental modeling:
We do not model recurrence, notifications, or automation until v2.


## System Components

Next.js:
- App Router
- Server Components for data fetching
- Server Actions for mutations
- Minimal client-side state

Supabase:
- Postgres as the primary datastore
- Auth for identity (email + OAuth)
- RLS for authorization and data isolation

Shared domain logic:
- Date calculations
- Activity rules
- Cost aggregation
- No database access


## Data Ownership Model

Household is the root boundary.

Every domain table includes:
- household_id
- created_at

Users never own data directly.
They gain access via household_members.


## Core Tables (v1)

auth.users  
Managed by Supabase Auth.

households  
Represents a single family unit.
Includes canonical timezone.

household_members  
Joins users to households.
Defines roles (owner, editor).

children  
Represents kids within a household.

activities  
Logical activity definitions.
Examples: Soccer practice, Piano lessons, Summer camp.

activity_instances  
Concrete scheduled occurrences.
Examples: Tuesday practice, Camp week 1.

costs  
Optional financial records tied to activity instances or standalone.


## Activity vs Activity Instance

Activities are templates.
They describe what the thing is.

Activity instances are calendar events.
They describe when it happens.

This separation:
- avoids premature recurrence modeling
- keeps the calendar simple
- supports one-off and repeated events equally well


## Data Model (Mermaid Source)

The following is the canonical ER model.
It is stored as text to avoid renderer-specific behavior.

    erDiagram
        AUTH_USERS {
            uuid id PK
            text email
        }

        HOUSEHOLDS {
            uuid id PK
            text name
            text timezone
            timestamptz created_at
        }

        HOUSEHOLD_MEMBERS {
            uuid id PK
            uuid household_id FK
            uuid user_id FK
            text role
            timestamptz created_at
        }

        CHILDREN {
            uuid id PK
            uuid household_id FK
            text name
            date birthdate
            text color
            timestamptz created_at
        }

        ACTIVITIES {
            uuid id PK
            uuid household_id FK
            uuid child_id FK
            text title
            text description
            text location
            text vendor
            timestamptz created_at
        }

        ACTIVITY_INSTANCES {
            uuid id PK
            uuid activity_id FK
            uuid household_id FK
            timestamptz starts_at
            timestamptz ends_at
            boolean all_day
            integer cost_cents
            text notes
            timestamptz created_at
        }

        COSTS {
            uuid id PK
            uuid household_id FK
            uuid activity_instance_id FK
            text label
            integer amount_cents
            text category
            boolean paid
            date due_date
            timestamptz created_at
        }

        AUTH_USERS ||--o{ HOUSEHOLD_MEMBERS : belongs_to
        HOUSEHOLDS ||--o{ HOUSEHOLD_MEMBERS : has_members
        HOUSEHOLDS ||--o{ CHILDREN : has
        HOUSEHOLDS ||--o{ ACTIVITIES : has
        HOUSEHOLDS ||--o{ ACTIVITY_INSTANCES : has
        HOUSEHOLDS ||--o{ COSTS : has
        CHILDREN ||--o{ ACTIVITIES : participates_in
        ACTIVITIES ||--o{ ACTIVITY_INSTANCES : generates
        ACTIVITY_INSTANCES ||--o{ COSTS : incurs


## Authorization Strategy

Authorization is implemented entirely via Supabase RLS.

Rules are written such that:
- users can only access rows belonging to households they are members of
- role-based restrictions are enforced at the row level
- no client-side checks are trusted

The application assumes:
“If the query succeeds, the user is allowed.”


## What Is Explicitly Not Modeled (Yet)

- Recurrence rules
- Notifications
- Reminders
- Calendar sync
- Budgets
- Automation
- AI features

These are deferred to v2 to preserve clarity.


## Evolution Strategy

This architecture is designed to evolve without rewrites.

Future additions should:
- introduce new tables rather than overloading existing ones
- preserve household as the root boundary
- keep authorization in RLS
- update this document alongside schema changes