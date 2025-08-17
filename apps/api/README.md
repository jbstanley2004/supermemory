API (Chat + Memories + Search)

This Worker implements:
- Chat endpoints using Cloudflare Agents (Durable Objects) and OpenAI via AI SDK
- v3/memories CRUD + file upload (text) with chunking + embeddings
- v3/search using Postgres + pgvector similarity search
It’s AI Gateway-ready and streams responses in the AI SDK format.

Endpoints
- `POST /chat` — AI SDK chat streaming
- `POST /chat/title` — generate a concise title from last assistant reply
- `POST /v3/memories` — add memory (content, metadata, containerTags)
- `POST /v3/memories/file` — upload text file as memory
- `GET /v3/memories/:id` — get memory
- `PATCH /v3/memories/:id` — update memory, re-chunks if content changes
- `DELETE /v3/memories/:id` — delete memory
- `POST /v3/memories/list` — list memories with pagination
- `POST /v3/search` — semantic search over chunks

Environment (Wrangler vars/secrets)
- `OPENAI_API_KEY` (secret): OpenAI key
- `OPENAI_BASE_URL` (var): optional AI Gateway base, e.g. `https://gateway.ai.cloudflare.com/v1/<ACCOUNT>/<GATEWAY>/openai`
- `OPENAI_MODEL` (var): default `gpt-4o-mini`
- `OPENAI_EMBEDDING_MODEL` (var): default `text-embedding-3-small`
- `HYPERDRIVE` (binding, optional): Cloudflare Hyperdrive binding that exposes `env.HYPERDRIVE.connectionString`.
- `DATABASE_URL` (secret, fallback): Postgres URL (Neon HTTP URL or classic Postgres URL). Used only when no `HYPERDRIVE` binding is configured.
- `DB_DRIVER` (var, fallback): `auto` (default), `neon`, or `pg`. Only relevant when using `DATABASE_URL`.

Database (Hyperdrive or Neon)
You can use Cloudflare Hyperdrive with a managed Postgres that has `pgvector` enabled, or use Neon’s HTTP driver directly from Workers.

1) Provision Postgres (Neon/Supabase/Render). Enable extension:
```
CREATE EXTENSION IF NOT EXISTS vector;
```

2) Hyperdrive (recommended):
   - Create a Hyperdrive configuration that points at your Postgres.
   - In `apps/api/wrangler.jsonc` add a binding with the Hyperdrive configuration ID:
     ```jsonc
     {
       "hyperdrive": [
         { "binding": "HYPERDRIVE", "id": "<your-hyperdrive-id>" }
       ]
     }
     ```
   - The Worker will automatically use `env.HYPERDRIVE.connectionString` via the `pg` client with `nodejs_compat`.

   Fallback without Hyperdrive:
   - Set `DATABASE_URL` to a Neon HTTP URL (preferred in Workers) or a direct Postgres URL.
   - Optionally set `DB_DRIVER=neon` or `DB_DRIVER=pg` (leave `auto` to let the Worker decide).

3) Deploy – the Worker lazily initializes tables on first request:
- `memories` (document-level metadata and raw content)
- `memory_chunks` (chunk text + embedding vector(1536))

Deploy
```bash
# API
wrangler login
cd apps/api
wrangler secret put OPENAI_API_KEY
# (Optional) Only when not using the Hyperdrive binding:
# wrangler secret put DATABASE_URL      # Neon HTTP or Postgres URL
wrangler deploy

# Web (point to your API)
cd ../../apps/web
echo "NEXT_PUBLIC_BACKEND_URL=https://<your-api>.workers.dev" > .env
bunx opennextjs-cloudflare build && bunx opennextjs-cloudflare deploy
```

Notes
- `/v3/memories/file` currently supports text uploads. PDF/image extraction can be added with a doc extraction service or Workers AI in a follow-up.
- CORS is permissive (origin-echo + credentials). Lock to your UI origin for production.
- pgvector index is created with `ivfflat` if available; run `ANALYZE memory_chunks` after bulk loads for performance.
