import { sqliteTable, text, integer, real, blob, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

// Sessions table for Better Auth
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

// Organizations table
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

// Organization members
export const organizationMembers = sqliteTable('organization_members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})

// Documents/Memories table
export const documents = sqliteTable('documents', {
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
  metadata: text('metadata'), // JSON string
  containerTags: text('container_tags'), // JSON array string
  
  // Stats
  tokenCount: integer('token_count').default(0),
  chunkCount: integer('chunk_count').default(0),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    userIdx: index('documents_user_idx').on(table.userId),
    orgIdx: index('documents_org_idx').on(table.organizationId),
    customIdIdx: index('documents_custom_id_idx').on(table.customId),
    statusIdx: index('documents_status_idx').on(table.status),
    createdAtIdx: index('documents_created_at_idx').on(table.createdAt),
  }
})

// Memory chunks (for vector search) - Store embeddings in Vectorize, metadata in D1
export const memoryChunks = sqliteTable('memory_chunks', {
  id: text('id').primaryKey(),
  documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Content
  content: text('content').notNull(),
  contentHash: text('content_hash').notNull(),
  
  // Metadata (embeddings stored in Vectorize)
  metadata: text('metadata'), // JSON string
  position: integer('position').notNull().default(0),
  tokenCount: integer('token_count').default(0),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    documentIdx: index('chunks_document_idx').on(table.documentId),
    userIdx: index('chunks_user_idx').on(table.userId),
    hashIdx: index('chunks_hash_idx').on(table.contentHash),
  }
})

// Connections table
export const connections = sqliteTable('connections', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  provider: text('provider').notNull(), // google-drive, notion, onedrive
  status: text('status').notNull().default('active'), // active, inactive, error
  
  // Auth tokens
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  
  // Metadata
  metadata: text('metadata'), // JSON string
  containerTags: text('container_tags'), // JSON array string
  
  // Sync info
  lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
  syncError: text('sync_error'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    userIdx: index('connections_user_idx').on(table.userId),
    providerIdx: index('connections_provider_idx').on(table.provider),
  }
})

// Projects table
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull(),
  
  // Settings
  settings: text('settings'), // JSON string
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    userIdx: index('projects_user_idx').on(table.userId),
    slugIdx: index('projects_slug_idx').on(table.slug),
  }
})

// Analytics events
export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  
  event: text('event').notNull(), // memory_created, memory_searched, chat_message, etc.
  properties: text('properties'), // JSON string
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => {
  return {
    userIdx: index('analytics_user_idx').on(table.userId),
    eventIdx: index('analytics_event_idx').on(table.event),
    createdAtIdx: index('analytics_created_at_idx').on(table.createdAt),
  }
})