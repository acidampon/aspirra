# Aspirra

AI-powered personal operating system that turns goals into practical plans, actions, evidence, and measurable progress.

## Product loop

**Goal → Plan → Action → Evidence → Progress → Adjustment**

Aspirra is a structured progress system with AI as an intelligence layer—not a generic chatbot.

## Current foundation

- Mobile-first React/Vite application with PWA foundation
- Persistent local state with schema migration support
- User-controlled JSON backup export/import with migration and recovery safeguards
- Multi-goal lifecycle: active, completed, archived, restored
- Goal planning with local intelligence and optional server-side AI
- Daily top-3 execution queue
- Action completion events and deferrals
- Evidence capture and execution history
- Progress intelligence and falling-behind signals
- Cross-goal workload/focus intelligence
- Daily reflection and adaptive tomorrow focus
- User-controlled memory: preferences, constraints, important context
- Interactive AI Guide with structured context
- AI replanning that preserves completed history
- Server-side AI boundary; provider credentials never belong in the Vite client
- Automated frontend/server tests and production build checks in GitHub Actions
- Provider-neutral account, session, database, and authenticated sync foundations
- PostgreSQL-compatible production persistence schema

## Architecture

- src/ — React UI and local product intelligence
- src/lib/storage.js — versioned local persistence and migration
- src/lib/domain.js — goal lifecycle and plan revisions
- src/lib/daily.js — daily execution, reviews, focus, and tomorrow planning
- src/lib/progress.js — progress, evidence, history, and attention signals
- src/lib/memory.js — user-controlled context layer
- src/lib/intelligence.js — local goal and blocker reasoning
- src/lib/api.js — frontend boundary to the optional AI server
- server/ — Express API and model-provider adapter

## Development

Frontend: npm install, npm run dev, npm test, npm run build.

AI server: cd server, npm install, npm test, npm start.

Set VITE_API_URL in the frontend environment when the AI server is deployed. Keep AI_API_KEY only in the server environment.

## Product direction

The next major layers are connecting a production authentication provider and persistent database adapter, production observability, richer opportunity/career workflows, notifications, and Android packaging. The local-first product remains usable without those cloud services. New work should complete coherent vertical slices rather than add disconnected screens.


<!-- CI release verification enabled -->

<!-- CI verification: test repair -->

<!-- CI verification: syntax fix -->
