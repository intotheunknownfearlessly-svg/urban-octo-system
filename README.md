# MANUS (Full)

Full starter repo: orchestration + persistence + Stripe + Supabase + factory + multirepo API.

Safety: this repo intentionally excludes malware/botnet/spam automation.

## Run
```bash
cp .env.example .env
npm install
npm run dev
```

## Supabase
Run `supabase.sql` in Supabase SQL editor.

## Endpoints
- GET /api/health
- POST /api/orchestrate
- POST /api/checkout
- POST /api/stripe/webhook
- GET /api/dashboard
- POST /api/factory
- POST /api/multirepo/create-repo (optional)
- POST /api/multirepo/dispatch (optional)
