import type { Env } from "./agents/chat";

// Very small DB abstraction that supports either Neon (HTTP) or pg (TCP via nodejs_compat).
// Recommended in Workers: Neon HTTP driver (`@neondatabase/serverless`).
// If you insist on Hyperdrive classic Postgres wire, set DB_DRIVER=pg and provide a Hyperdrive connection string.

export type Queryable = {
  query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
};

let cached: Queryable | null = null;

export async function getDb(env: Env): Promise<Queryable> {
  if (cached) return cached;

  const url = (env as any).DATABASE_URL as string | undefined;
  if (!url) throw new Error("DATABASE_URL is not set");

  const driver = ((env as any).DB_DRIVER as string | undefined) || "auto";

  // Heuristic: Neon if HTTP url or contains neon.tech; otherwise pg
  const shouldUseNeon =
    driver === "neon" ||
    (driver === "auto" && (url.startsWith("http") || url.includes("neon.tech")));

  if (shouldUseNeon) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    cached = {
      async query(text: string, params: any[] = []) {
        // Use unsafe API to pass text + params
        const result = await (sql as any).unsafe(text, params);
        return { rows: result as any[] };
      },
    };
  } else {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url, max: 3, ssl: { rejectUnauthorized: false } });
    cached = {
      async query(text: string, params: any[] = []) {
        const res = await pool.query(text, params);
        return { rows: res.rows };
      },
    };
  }

  return cached;
}

export async function ensureSchema(env: Env) {
  const db = getDb(env);
  // Enable extensions and create tables if not exist
  await db.query(`
    create extension if not exists vector;

    create table if not exists memories (
      id text primary key,
      connection_id text,
      custom_id text,
      type text,
      title text,
      summary text,
      metadata jsonb,
      container_tags text[],
      content text,
      source text,
      status text not null default 'done',
      og_image text,
      url text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists memory_chunks (
      id text primary key,
      memory_id text not null references memories(id) on delete cascade,
      chunk_index int not null,
      content text not null,
      embedding vector(1536) not null,
      created_at timestamptz not null default now()
    );

    create index if not exists memory_chunks_memory_id_idx on memory_chunks(memory_id);
  `);
  // Attempt to create an ivfflat index if pgvector is available
  try {
    await db.query(
      `create index if not exists memory_chunks_embedding_idx on memory_chunks using ivfflat (embedding vector_cosine_ops);`
    );
  } catch {}
}
