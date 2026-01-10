# Architectural & Product Decisions

This document records the reasoning behind meaningful decisions in Keel.

Its purpose is to:
- preserve context
- prevent re-litigating old choices
- help Cursor (and future humans) understand intent

If something exists and the reason is not obvious, it should be documented here.


## How to Use This Document

- Decisions are append-only
- Do not rewrite history
- If a decision changes, add a new entry explaining why

Each decision should answer:
- What was decided?
- Why was it decided?
- What alternatives were considered?
- What tradeoffs were accepted?


## Decision Template

Copy this template for new entries.

Decision ID:
Date:
Status: Proposed | Accepted | Superseded

Context:
What problem or question required a decision?

Decision:
What was chosen?

Alternatives Considered:
What other options were evaluated?

Consequences:
What are the tradeoffs and downstream effects?


## Decisions


### D001: Use Supabase as the Backend Platform

Decision ID:
D001

Date:
2026-01-XX

Status:
Accepted

Context:
Keel requires authentication, authorization, and a relational database.
Developer velocity and correctness are more important than infrastructure flexibility.

Decision:
Use Supabase for Postgres, Auth, and Row Level Security.
Avoid building a custom backend API.

Alternatives Considered:
- Custom API (Rails or Django)
- Firebase
- Hasura + Auth0

Consequences:
- Authorization is centralized and reliable
- Local development mirrors production closely
- Some backend flexibility is traded for simplicity


### D002: Enforce Authorization via Row Level Security

Decision ID:
D002

Date:
2026-01-XX

Status:
Accepted

Context:
Household data must never leak across users.
Authorization logic must be correct by default.

Decision:
All authorization rules live in Postgres via RLS.
The application assumes successful queries are authorized.

Alternatives Considered:
- Application-level authorization checks
- Hybrid authorization

Consequences:
- RLS policies require careful design
- Debugging permissions requires database literacy
- Security guarantees are significantly stronger


### D003: Household-First Data Modeling

Decision ID:
D003

Date:
2026-01-XX

Status:
Accepted

Context:
Keel is a family planning tool.
Data naturally belongs to households, not individuals.

Decision:
All domain data is owned by a household.
Users gain access only through household membership.

Alternatives Considered:
- User-owned data with sharing
- Organization-style ownership

Consequences:
- Schema is simpler and more consistent
- Sharing logic is clearer
- Some flexibility for edge cases is deferred


### D004: Separate Activities from Activity Instances

Decision ID:
D004

Date:
2026-01-XX

Status:
Accepted

Context:
Activities can occur multiple times.
Recurrence is complex and easy to over-model.

Decision:
Model activities as templates and activity instances as concrete events.
Do not model recurrence rules in v1.

Alternatives Considered:
- Single events table
- Full recurrence engine (RRULE)

Consequences:
- Calendar logic remains simple
- Recurrence can be layered in later
- Some duplication of instances is accepted


### D005: Avoid a Traditional Backend API

Decision ID:
D005

Date:
2026-01-XX

Status:
Accepted

Context:
A separate backend increases surface area and maintenance cost.
Most logic is CRUD plus authorization.

Decision:
Use Next.js Server Components and Server Actions instead of a REST or GraphQL API.

Alternatives Considered:
- REST API (Rails or Django)
- GraphQL API

Consequences:
- Fewer moving parts
- Tighter coupling between UI and data
- Backend logic is colocated with features


### D006: Optimize for Developer Sanity Over Premature Scale

Decision ID:
D006

Date:
2026-01-XX

Status:
Accepted

Context:
This is an early-stage product with one primary developer.
Cognitive load is the main risk.

Decision:
Favor explicit, boring solutions.
Defer abstractions and optimizations.

Alternatives Considered:
- Highly abstract domain layers
- Event-driven architecture

Consequences:
- Code may be less “clever”
- Future refactors may be needed
- Progress and clarity are maximized


## Closing Notes

This document is not a justification exercise.
It is a memory system.

If you feel yourself asking:
“Why did we do it this way?”
and the answer is not here, add it.