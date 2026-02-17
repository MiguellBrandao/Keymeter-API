# Keymeter API

Multi-tenant analytics backend built with Express, TypeScript, Prisma, PostgreSQL, and Redis.
The project covers JWT auth, organization/membership management, invite lifecycle, API key lifecycle (create/revoke/rotate), scoped event ingestion, audit logs, and daily usage aggregation.

## What this project demonstrates

- Modular backend organization by domain (`auth`, `orgs`, `members`, `invites`, `api-keys`, `events`, `audit`, `usage`).
- JWT authentication for user routes and API key authentication for ingestion routes.
- Role-based access control (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) for org-level management.
- API key scopes enforcement (`events:write`, `events:read`).
- Event rate limiting with Redis (hourly window).
- Audit log registration for key business actions.
- Daily usage aggregation per org and API key.
- Integration test coverage for critical end-to-end flows.

## Core features

- User signup and signin (`/auth`).
- Create organization and list organizations by authenticated member (`/orgs`).
- Invite user, accept invite, revoke invite (`/invites`).
- Change member role and remove member from organization (`/orgs/:orgId/member`).
- Create/list/rotate/revoke API keys (`/orgs/:orgId/api-keys`).
- Create event and list events with pagination (`/v1/events`).
- Read audit logs by organization (`/orgs/:orgId/audit-logs`).
- Read daily usage summary by organization (`/orgs/:orgId/usage`).
- Health check for PostgreSQL and Redis (`/health`).
- Swagger docs (`/docs`, `/docs.json`).

## Stack and dependencies

- Node.js 22+
- Express 5
- TypeScript 5
- Prisma 7 + PostgreSQL
- Redis + ioredis
- JWT (`jsonwebtoken`)
- Validation with Zod
- Swagger UI (`swagger-ui-express`)
- Testing (`vitest`, `supertest`)

## Running locally

### Prerequisites

- Node.js 22+
- npm
- PostgreSQL 16+
- Redis 7+

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and adjust values.

3. Apply database migrations:

```bash
npx prisma migrate dev
```

4. Generate Prisma client (usually done by migration, but safe to run):

```bash
npx prisma generate
```

5. Start in development mode:

```bash
npm run dev
```

API default URL: `http://localhost:3000`

## Environment variables

Defined in `.env.example`:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: secret used to sign and verify access tokens.
- `JWT_EXPIRES_IN`: JWT expiration (example: `7d`).
- `REDIS_URL`: Redis connection URL.
- `RATE_LIMIT_EVENTS_PER_HOUR`: hourly limit for event endpoints.
- `RATE_LIMIT_FAIL_OPEN`: if `true`, requests are allowed when Redis is unavailable.
- `PORT`: API HTTP port.

## Scripts

- `npm run dev`: run API in watch mode with `tsx`.
- `npm run start`: run API once with `tsx`.
- `npm run build`: TypeScript compilation.
- `npm test`: run integration tests (`vitest`).
- `npm run test:watch`: watch mode for tests.

## API documentation

With the API running:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Main endpoints (summary)

### Auth

- `POST /auth/signup`
- `POST /auth/signin`

### Organizations and members (Bearer)

- `POST /orgs`
- `GET /orgs/my`
- `PATCH /orgs/:orgId/member`
- `DELETE /orgs/:orgId/member/:userId`

### Invites (Bearer)

- `POST /invites`
- `GET /invites/accept?inviteId=...&token=...`
- `POST /invites/revoke`

### API keys (Bearer)

- `POST /orgs/:orgId/api-keys`
- `GET /orgs/:orgId/api-keys`
- `PATCH /orgs/:orgId/api-keys/rotate`
- `PATCH /orgs/:orgId/api-keys/revoke`

### Events (API key)

- `POST /v1/events` (requires `events:write`)
- `GET /v1/events` (requires `events:read`)

### Audit and usage (Bearer)

- `GET /orgs/:orgId/audit-logs`
- `GET /orgs/:orgId/usage`

### Health

- `GET /health`

## Project structure

```text
src/
  app.ts
  server.ts
  common/
    auth/
    docs/
    errors/
    http/
    prisma/
    redis/
    api/
    types/
  modules/
    auth/
    orgs/
    members/
    invites/
    apikeys/
    events/
    audit/
    usage/
  tests/
    integration/
```

## Architecture decisions

- API keys are stored as `keyPrefix + keyHash` (raw key is only shown once on creation/rotation).
- Ingestion auth uses API keys; management routes use JWT Bearer tokens.
- Event write/list routes are protected by scope checks.
- Rate limit is handled in Redis per hour.
- Usage is persisted in PostgreSQL (`UsageDaily`) and incremented on event creation.
- Timestamps for daily aggregation are normalized to UTC midnight.

## Testing

Integration tests cover:

- health/docs availability
- auth + org lifecycle basics
- invite + member lifecycle
- API key lifecycle + event ingestion/listing
- audit and usage visibility

Current integration files:

- `src/tests/integration/health-docs.integration.test.ts`
- `src/tests/integration/auth-orgs.integration.test.ts`
- `src/tests/integration/invites-members.integration.test.ts`
- `src/tests/integration/apikey-events.integration.test.ts`
- `src/tests/integration/audit-usage.integration.test.ts`

