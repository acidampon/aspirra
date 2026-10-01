# Aspirra AI Server

Server-side intelligence boundary for Aspirra.

## Endpoints

- GET /health
- POST /api/plan
- POST /api/guide
- POST /api/replan

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
