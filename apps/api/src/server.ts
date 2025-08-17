import { generateText, createDataStreamResponse, streamText } from "ai";
import { createOpenAIProvider } from "./model";
import { ensureSchema, getDb } from "./db";
import { randomUUID } from "node:crypto";

export type Env = {
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
  OPENAI_EMBEDDING_MODEL?: string;
  DATABASE_URL?: string;
  DB_DRIVER?: string;
  // Cloudflare Hyperdrive binding (if configured via wrangler.jsonc)
  HYPERDRIVE?: { connectionString: string };
};

function withCORS(res: Response, req: Request): Response {
  const headers = new Headers(res.headers);
  const origin = req.headers.get("Origin") || "*";
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Ensure DB schema exists lazily (first request)
    try {
      await ensureSchema(env);
    } catch {}

    if (request.method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }), request);
    }

    // Chat endpoint (AI SDK DefaultChatTransport-compatible)
    if (url.pathname === "/chat" && request.method === "POST") {
      const { messages } = await request.json();
      const openai = createOpenAIProvider(env);
      const modelId = (env as any).OPENAI_MODEL || "gpt-5-mini";
      const dataStream = createDataStreamResponse({
        execute: async (stream) => {
          const result = streamText({ model: openai(modelId), messages });
          result.mergeIntoDataStream(stream);
        },
      });
      return withCORS(dataStream, request);
    }

    // Chat title endpoint
    if (url.pathname === "/chat/title" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const last = Array.isArray(body.messages) ? body.messages[body.messages.length - 1] : null;
        const text = last?.content || "";
        const openai = createOpenAIProvider(env);
        const modelId = (env as any).OPENAI_MODEL || "gpt-5-mini";
        const out = await generateText({
          model: openai(modelId),
          prompt: `Generate a short 3-6 word chat title for: ${text}`,
        });
        const title = out.text.trim();
        return withCORS(new Response(title, { status: 200 }), request);
      } catch (e) {
        return withCORS(new Response("", { status: 500 }), request);
      }
    }

    // Minimal OpenAI Embedding helper (supports AI Gateway via OPENAI_BASE_URL)
    async function embedMany(texts: string[], env: Env): Promise<number[][]> {
      const base = (env as any).OPENAI_BASE_URL || "https://api.openai.com/v1";
      const model = (env as any).OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
      const res = await fetch(`${base}/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(env as any).OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model, input: texts }),
      });
      if (!res.ok) throw new Error(`Embedding error: ${res.status}`);
      const data = await res.json();
      const targetDim = 1536;
      const normalize = (vec: number[], dim = targetDim) => {
        if (vec.length === dim) return vec;
        if (vec.length > dim) return vec.slice(0, dim);
        const out = vec.slice();
        while (out.length < dim) out.push(0);
        return out;
      };
      return data.data.map((d: any) => normalize(d.embedding as number[]));
    }

    // Helpers for chunking text
    function chunkText(input: string, max = 800): string[] {
      const parts: string[] = [];
      let s = input || "";
      while (s.length > 0) {
        parts.push(s.slice(0, max));
        s = s.slice(max);
      }
      return parts.length ? parts : [""];
    }

    // v3/memories (add)
    if (url.pathname === "/v3/memories" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const content: string = body.content || "";
        const customId: string | undefined = body.customId;
        const metadata = body.metadata ?? null;
        const containerTags: string[] | undefined = body.containerTags;
        const id = randomUUID();
        const type = /^https?:\/\//.test(content) ? "webpage" : "text";
        const now = new Date().toISOString();

        const db = await getDb(env);
        await db.query(
          `insert into memories (id, custom_id, type, title, summary, metadata, container_tags, content, source, status, created_at, updated_at, url)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [
            id,
            customId || null,
            type,
            null,
            null,
            metadata,
            containerTags || null,
            content,
            null,
            "done",
            now,
            now,
            type === "webpage" ? content : null,
          ]
        );

        // Chunk + embed content
        if (content) {
          const chunks = chunkText(content);
          const vectors = await embedMany(chunks, env);
          for (let i = 0; i < chunks.length; i++) {
            await db.query(
              `insert into memory_chunks (id, memory_id, chunk_index, content, embedding)
               values ($1,$2,$3,$4,$5::vector)`,
              [randomUUID(), id, i, chunks[i], `[${vectors[i].join(",")}]`]
            );
          }
        }

        return withCORS(
          new Response(JSON.stringify({ id, status: "done" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
          request
        );
      } catch (e) {
        return withCORS(new Response(JSON.stringify({ error: String(e) }), { status: 500 }), request);
      }
    }

    // v3/memories/file (upload text file). For PDFs/images, extraction is TODO.
    if (url.pathname === "/v3/memories/file" && request.method === "POST") {
      try {
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return withCORS(new Response(JSON.stringify({ error: "file field is required" }), { status: 400 }), request);
        }
        const text = await file.text();
        const proxyReq = new Request(new URL("/v3/memories", url.origin).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        });
        // Re-enter this worker to reuse the same logic
        return await (this as any).fetch(proxyReq, env, _ctx);
      } catch (e) {
        return withCORS(new Response(JSON.stringify({ error: String(e) }), { status: 500 }), request);
      }
    }

    // v3/memories/:id (get, patch, delete)
    const memIdMatch = url.pathname.match(/^\/v3\/memories\/(.+)$/);
    if (memIdMatch && request.method === "GET") {
      const id = decodeURIComponent(memIdMatch[1]);
      const db = await getDb(env);
      const rows = await db.query(`select * from memories where id=$1`, [id]);
      const m = rows.rows[0];
      if (!m) return withCORS(new Response("Not found", { status: 404 }), request);
      return withCORS(
        new Response(
          JSON.stringify({
            id: m.id,
            connectionId: m.connection_id,
            createdAt: m.created_at,
            customId: m.custom_id,
            metadata: m.metadata,
            status: m.status,
            summary: m.summary,
            title: m.title,
            type: m.type,
            updatedAt: m.updated_at,
            containerTags: m.container_tags,
            raw: null,
            url: m.url,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ),
        request
      );
    }
    if (memIdMatch && request.method === "PATCH") {
      const id = decodeURIComponent(memIdMatch[1]);
      const body = await request.json().catch(() => ({}));
      const { content, customId, metadata, containerTags } = body as any;
      const now = new Date().toISOString();
      const db = await getDb(env);
      if (content) {
        await db.query(
          `update memories set content=$1, custom_id=$2, metadata=$3, container_tags=$4, updated_at=$5 where id=$6`,
          [content, customId || null, metadata ?? null, containerTags || null, now, id]
        );
        // Rebuild chunks
        await db.query(`delete from memory_chunks where memory_id=$1`, [id]);
        const chunks = chunkText(content);
        const vectors = await embedMany(chunks, env);
        for (let i = 0; i < chunks.length; i++) {
          await db.query(
            `insert into memory_chunks (id, memory_id, chunk_index, content, embedding)
             values ($1,$2,$3,$4,$5::vector)`,
            [randomUUID(), id, i, chunks[i], `[${vectors[i].join(",")}]`]
          );
        }
      } else {
        await db.query(
          `update memories set custom_id=$1, metadata=$2, container_tags=$3, updated_at=$4 where id=$5`,
          [customId || null, metadata ?? null, containerTags || null, now, id]
        );
      }
      return withCORS(new Response(JSON.stringify({ id, status: "done" }), { status: 200 }), request);
    }
    if (memIdMatch && request.method === "DELETE") {
      const id = decodeURIComponent(memIdMatch[1]);
      const db = await getDb(env);
      await db.query(`delete from memories where id=$1`, [id]);
      return withCORS(new Response(null, { status: 204 }), request);
    }

    // v3/memories/list (pagination)
    if (url.pathname === "/v3/memories/list" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const page = Number(body.page ?? 1);
      const limit = Math.min(100, Number(body.limit ?? 20));
      const offset = (page - 1) * limit;
      const order = (body.order as string) === "asc" ? "asc" : "desc";
      const sort = (body.sort as string) === "createdAt" ? "created_at" : "updated_at";
      const containerTags: string[] | undefined = body.containerTags;
      const db = await getDb(env);
      const where = containerTags && containerTags.length ? `where container_tags && $1::text[]` : "";
      const params: any[] = containerTags && containerTags.length ? [containerTags] : [];
      const list = await db.query(
        `select * from memories ${where} order by ${sort} ${order} limit ${limit} offset ${offset}`,
        params
      );
      const total = await db.query(`select count(*)::int as c from memories ${where}`, params);
      return withCORS(
        new Response(
          JSON.stringify({
            memories: list.rows.map((m: any) => ({
              id: m.id,
              connectionId: m.connection_id,
              createdAt: m.created_at,
              customId: m.custom_id,
              metadata: m.metadata,
              status: m.status,
              summary: m.summary,
              title: m.title,
              type: m.type,
              updatedAt: m.updated_at,
              containerTags: m.container_tags,
            })),
            pagination: {
              currentPage: page,
              limit,
              totalItems: total.rows[0]?.c ?? 0,
              totalPages: Math.ceil((total.rows[0]?.c ?? 0) / limit),
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ),
        request
      );
    }

    // v3/search
    if (url.pathname === "/v3/search" && request.method === "POST") {
      const body = await request.json();
      const q = String(body.q || "").slice(0, 4000);
      const limit = Math.min(20, Number(body.limit ?? 10));
      const docId = body.docId as string | undefined;
      const containerTags: string[] | undefined = body.containerTags;
      if (!q) return withCORS(new Response(JSON.stringify({ results: [], total: 0, timing: 0 }), { status: 200 }), request);
      const db = await getDb(env);
      const t0 = Date.now();
      const [qvec] = await embedMany([q], env);
      const whereParts: string[] = [];
      const params: any[] = [`[${qvec.join(",")}]`];
      if (docId) {
        whereParts.push(`memory_id = $${params.length + 1}`);
        params.push(docId);
      }
      if (containerTags && containerTags.length) {
        whereParts.push(`exists (select 1 from memories m where m.id = memory_id and m.container_tags && $${params.length + 1}::text[])`);
        params.push(containerTags);
      }
      const where = whereParts.length ? `where ${whereParts.join(" and ")}` : "";
      const rows = await db.query(
        `select mc.*, (1 - (mc.embedding <=> $1::vector)) as score, m.title, m.type, m.metadata, m.created_at, m.updated_at
         from memory_chunks mc
         join memories m on m.id = mc.memory_id
         ${where}
         order by mc.embedding <=> $1::vector asc
         limit ${limit * 5}`,
        params
      );
      // Group by memory
      const byMem = new Map<string, any>();
      for (const r of rows.rows) {
        const g = byMem.get(r.memory_id) || {
          documentId: r.memory_id,
          title: r.title,
          type: r.type,
          metadata: r.metadata,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          score: 0,
          chunks: [] as any[],
        };
        g.chunks.push({ content: r.content, isRelevant: true, score: Number(r.score || 0) });
        g.score = Math.max(g.score, Number(r.score || 0));
        byMem.set(r.memory_id, g);
      }
      const results = Array.from(byMem.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      const timing = Date.now() - t0;
      return withCORS(
        new Response(JSON.stringify({ results, total: results.length, timing }), { status: 200 }),
        request
      );
    }

    return withCORS(new Response("Not found", { status: 404 }), request);
  }
} satisfies ExportedHandler<Env>;
