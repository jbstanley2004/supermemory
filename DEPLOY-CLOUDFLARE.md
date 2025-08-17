Supermemory — Cloudflare Deployment (Frontend + API overview)

This repo currently contains the Next.js web app under `apps/web` configured for Cloudflare Workers via OpenNext. API/server code is not present in this repository.

Use this guide to deploy the web app to Cloudflare now, and prepare for deploying the API once its code or enterprise deployment package is available.

Prerequisites
- Cloudflare Account ID and API Token with: Workers KV:Edit, R2:Edit, AI Gateway:Edit (optional), Hyperdrive:Edit (for API)
- Node 20+ and Bun 1.2+

Frontend (Web) — Deploy to Cloudflare
1) Create the R2 bucket for ISR cache
- Bucket name: `supermemory-console-cache`
- Cloudflare Dashboard → R2 → Create bucket

2) Configure web environment
- Copy `apps/web/.env.example` to `apps/web/.env`
- Set:
  - `NEXT_PUBLIC_BACKEND_URL` → URL of your API (temporary: `https://api.supermemory.ai` until self-hosted API is up)
  - `NEXT_PUBLIC_POSTHOG_KEY` → optional analytics key

3) Build and deploy the web worker
```bash
cd apps/web
bun install
# preview locally (Cloudflare dev runtime)
bunx opennextjs-cloudflare build && bunx opennextjs-cloudflare preview
# deploy to Cloudflare Workers
bunx opennextjs-cloudflare build && bunx opennextjs-cloudflare deploy
```
Notes
- The worker name and bindings are defined in `apps/web/wrangler.jsonc` (name: `supermemory-consumer`).
- `NEXT_INC_CACHE_R2_BUCKET` binding is already configured there; ensure the bucket exists.

API (Backend) — What you’ll need
The web app calls a backend at `NEXT_PUBLIC_BACKEND_URL` (defaults to `https://api.supermemory.ai`). To self-host the API you’ll need either:
- The open-source API project/repo, or
- The enterprise deployment package referenced in `self_hosting.md` (includes compiled bundle and deploy script).

Once you have the API bundle or source, plan for these Cloudflare resources and env vars:
- Database via Hyperdrive:
  - Provision a managed Postgres with pgvector (e.g., Neon, Supabase) and enable SSL
  - Create a Hyperdrive resource in Cloudflare targeting that Postgres
  - Set `DATABASE_URL` to the Hyperdrive connection string
- Storage and services (as required by API build):
  - R2 (file storage), KV (session/config), AI Gateway (optional), Workflows/Cron (imports)
- Required environment variables (based on `self_hosting.md`):
  - `NODE_ENV`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your API public base URL)
  - `DATABASE_URL` (Hyperdrive connection string)
  - `OPENAI_API_KEY` (and optionally `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`)
  - `RESEND_API_KEY` if using email
  - OAuth client IDs/secrets for connectors if needed

Example: create Hyperdrive and get connection URL
1) Cloudflare Dashboard → Workers → Hyperdrive → Create connection → point to your Postgres
2) Copy the Hyperdrive connection URL and set it as `DATABASE_URL`

Wire up the web app to your API
- After deploying your API worker, update `apps/web/.env` with `NEXT_PUBLIC_BACKEND_URL=https://YOUR-API-DOMAIN` and redeploy the web worker.

Troubleshooting
- 403 during deploy: ensure your API token has account-level Workers/R2 permissions and you’re targeting the correct Account ID.
- 404 on assets after deploy: confirm R2 bucket exists and matches the `wrangler.jsonc` binding name.
- CORS/session issues calling API: the web app includes credentials; configure your API CORS to allow your web origin and cookies.

