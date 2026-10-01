# Aspirra AI Server

Server-side intelligence boundary for Aspirra.

## Endpoints

- GET /health
- POST /api/plan
- POST /api/guide
- POST /api/replan
- POST /api/sync

## Configuration

- `PORT` — server port, default `8787`
- `FRONTEND_ORIGIN` — optional exact frontend origin for CORS
- `AI_PROVIDER` — provider selector
- `AI_MODEL` — model name
- `AI_API_KEY` — server-only provider credential

AI credentials stay on the server. Never put `AI_API_KEY` in Vite client variables.

The API validates request sizes, limits repeated requests, and returns generic provider errors to clients so internal provider details are not exposed.

## Health

`GET /health` returns a small readiness response without invoking the AI provider.

## Deployment

Set the production frontend origin explicitly with `FRONTEND_ORIGIN`. Keep provider credentials in the deployment platform's secret/environment-variable store.

## Persistence and authentication

The repository includes provider-neutral account/session and PostgreSQL persistence contracts. The default reference database is in-memory for tests; production deployments must provide a persistent database adapter and a real authentication provider before enabling cloud accounts. Session tokens are hashed in the reference session layer and expire by default.

Apply `schema.sql` to a PostgreSQL-compatible database when wiring the production adapter. Do not expose database credentials or `AI_API_KEY` to the frontend.

### PostgreSQL adapter

The production adapter is implemented in `src/postgresDatabase.js` and satisfies the same account/snapshot database contract used by the sync service. Configure a PostgreSQL connection pool in the deployment environment and run `schema.sql` before enabling it. The adapter uses parameterized SQL for account and snapshot operations.


## Container deployment

The server can be built and run as a container with server/Dockerfile. Copy server/.env.example into the deployment platform environment configuration and provide real production values. Production requires NODE_ENV=production, FRONTEND_ORIGIN, DATABASE_URL, and AI_API_KEY; the reference in-memory database is intentionally not permitted in production.
