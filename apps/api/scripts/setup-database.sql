-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_memory_chunks_document ON memory_chunks(document_id);

-- Create function for similarity search
CREATE OR REPLACE FUNCTION search_memories(
  query_embedding vector(1536),
  user_id_param text,
  match_count int DEFAULT 10
)
RETURNS TABLE(
  chunk_id text,
  document_id text,
  content text,
  title text,
  url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id as chunk_id,
    mc.document_id,
    mc.content,
    d.title,
    d.url,
    1 - (mc.embedding <=> query_embedding) as similarity
  FROM memory_chunks mc
  INNER JOIN documents d ON mc.document_id = d.id
  WHERE d.user_id = user_id_param
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;