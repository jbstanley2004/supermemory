Supermemory API (Cloudflare Agents)

- Durable Object-backed chat agent using Cloudflare Agents SDK
- OpenAI via AI SDK, ready for Cloudflare AI Gateway (set `OPENAI_BASE_URL`)
- Endpoints:
  - `POST /chat` — AI SDK chat streaming (used by frontend `useChat`)
  - `POST /chat/title` — generate a concise title from last assistant reply

Environment (Wrangler vars/secrets)
- `OPENAI_API_KEY` (secret): OpenAI key
- `OPENAI_BASE_URL` (var): optional AI Gateway base, e.g. `https://gateway.ai.cloudflare.com/v1/<ACCOUNT>/<GATEWAY_NAME>/openai`
- `OPENAI_MODEL` (var): default `gpt-4o-mini`

Deploy
1) `wrangler login`
2) `cd apps/api`
3) (optional) `wrangler secret put OPENAI_API_KEY`
4) (optional) `wrangler deploy`

Notes
- Durable Objects migration tag `v1` creates SQLite storage for `Chat` class.
- CORS is permissive (`*`) by default; tighten as needed.

