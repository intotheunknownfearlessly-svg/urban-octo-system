# MANUS (Enterprise Baseline)

Production-structured agentic execution framework:
- Next.js 14 (App Router) + TypeScript (strict)
- Zod env validation
- OpenAI + Local Ollama LLM provider toggle
- Stripe Checkout + webhook verification (idempotent)
- Supabase Postgres persistence (telemetry + revenue + memory + agent registry)
- pgvector semantic search (SQL function included)
- Structured logging (pino)
- Basic rate limiting for API routes (in-memory token bucket)
- Docker + GitHub Actions CI

## Quickstart

1) Install deps
```bash
npm install
```

2) Configure env
```bash
cp .env.example .env
```

3) Create Supabase tables/functions
Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

4) Run
```bash
npm run dev
```

## Endpoints
- `GET /api/health`
- `POST /api/orchestrate`
- `POST /api/checkout`
- `POST /api/stripe/webhook`
- `GET /api/dashboard`
- `POST /api/factory`
- `POST /api/marketplace/register`
- `GET /api/marketplace/agents`
- `POST /api/memory/search`

## LLM modes
- Cloud: set `LLM_MODE=openai`
- Local: set `LLM_MODE=ollama` (requires Ollama running on `OLLAMA_BASE_URL`)

## Notes
- Server routes use `SUPABASE_SERVICE_ROLE_KEY` (never expose it to client).
- Webhook route verifies `stripe-signature` and writes revenue events.
- Rate limiting is in-memory; replace with Redis/Upstash in multi-instance deployments.
