import { pgTable, text, timestamp, jsonb, integer, boolean, uuid, index, vector } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Sessions table for Better Auth
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Organizations table
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Organization members
export const organizationMembers = pgTable('organization_members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Documents/Memories table
export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  customId: text('custom_id'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  connectionId: text('connection_id'),
  
  // Content fields
  content: text('content'),
  raw: text('raw'),
  title: text('title'),
  summary: text('summary'),
  url: text('url'),
  ogImage: text('og_image'),
  
  // Metadata
  type: text('type').notNull().default('text'), // text, url, file, etc.
  status: text('status').notNull().default('processing'), // processing, done, failed
  source: text('source'),
  metadata: jsonb('metadata'),
  containerTags: jsonb('container_tags').$type<string[]>().default([]),
  
  // Stats
  tokenCount: integer('token_count').default(0),
  chunkCount: integer('chunk_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('documents_user_idx').on(table.userId),
    orgIdx: index('documents_org_idx').on(table.organizationId),
    customIdIdx: index('documents_custom_id_idx').on(table.customId),
    statusIdx: index('documents_status_idx').on(table.status),
  }
})

// Memory chunks (for vector search)
export const memoryChunks = pgTable('memory_chunks', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Content
  content: text('content').notNull(),
  contentHash: text('content_hash').notNull(),
  
  // Embeddings
  embedding: vector('embedding', { dimensions: 1536 }), // OpenAI embeddings dimension
  
  // Metadata
  metadata: jsonb('metadata'),
  position: integer('position').notNull().default(0),
  tokenCount: integer('token_count').default(0),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    documentIdx: index('chunks_document_idx').on(table.documentId),
    userIdx: index('chunks_user_idx').on(table.userId),
    embeddingIdx: index('chunks_embedding_idx').using('ivfflat', table.embedding.op('vector_cosine_ops')),
  }
})

// Connections table
export const connections = pgTable('connections', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  provider: text('provider').notNull(), // google-drive, notion, onedrive
  status: text('status').notNull().default('active'), // active, inactive, error
  
  // Auth tokens
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  
  // Metadata
  metadata: jsonb('metadata'),
  containerTags: jsonb('container_tags').$type<string[]>().default([]),
  
  // Sync info
  lastSyncedAt: timestamp('last_synced_at'),
  syncError: text('sync_error'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('connections_user_idx').on(table.userId),
    providerIdx: index('connections_provider_idx').on(table.provider),
  }
})

// Projects table
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull(),
  
  // Settings
  settings: jsonb('settings'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('projects_user_idx').on(table.userId),
    slugIdx: index('projects_slug_idx').on(table.slug),
  }
})

// Analytics events
export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  event: text('event').notNull(), // memory_created, memory_searched, chat_message, etc.
  properties: jsonb('properties'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdx: index('analytics_user_idx').on(table.userId),
    eventIdx: index('analytics_event_idx').on(table.event),
    createdAtIdx: index('analytics_created_at_idx').on(table.createdAt),
  }
})