Supermemory — Cloudflare Deployment (Frontend + API)

This repo contains the Next.js web app under `apps/web` and a lightweight Cloudflare Workers API under `apps/api` implementing chat via Cloudflare Agents (Durable Objects) and OpenAI (AI Gateway-ready).

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

API (Backend) — Deploy the chat Worker
- Location: `apps/api`
- Tech: Cloudflare Agents + Durable Objects for stateful chat, AI SDK for streaming, OpenAI via AI Gateway (optional)

1) Configure OpenAI + (optional) AI Gateway
- Set `OPENAI_API_KEY` as a secret: `cd apps/api && wrangler secret put OPENAI_API_KEY`
- Optional: set `OPENAI_BASE_URL` to your AI Gateway route for OpenAI:
  - e.g. `https://gateway.ai.cloudflare.com/v1/<ACCOUNT>/<GATEWAY_NAME>/openai`
- Optional: set `OPENAI_MODEL` (default `gpt-4o-mini`)

2) Deploy the API worker
```bash
cd apps/api
wrangler deploy
```

3) Point the web app to your API
- Set `apps/web/.env` → `NEXT_PUBLIC_BACKEND_URL=https://<your-api-subdomain>.workers.dev` (or your custom domain)
- Redeploy the web: `cd apps/web && bunx opennextjs-cloudflare build && bunx opennextjs-cloudflare deploy`

Notes
- The API provides:
  - `POST /chat` (AI SDK-compatible streaming chat)
  - `POST /chat/title` (short title generation)
- Durable Objects migration tag `v1` is included; Wrangler will handle DO storage.
- CORS is permissive by default; tighten to your app domain(s) as needed.

Troubleshooting
- 403 during deploy: ensure your API token has account-level Workers/R2 permissions and you’re targeting the correct Account ID.
- 404 on assets after deploy: confirm R2 bucket exists and matches the `wrangler.jsonc` binding name.
- CORS/session issues calling API: the web includes credentials; configure API CORS to allow your web origin and cookies (see `apps/api/src/server.ts`).
