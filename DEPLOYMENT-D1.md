# SuperMemory Full-Stack Deployment Guide - Cloudflare D1

This guide will help you deploy the complete SuperMemory application (frontend and backend) to Cloudflare Workers using Cloudflare D1 as the database.

## 🏗️ Architecture Overview

- **Frontend**: Next.js application deployed via OpenNext to Cloudflare Workers
- **Backend API**: Hono-based REST API on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite-based serverless database)
- **Vector Search**: Cloudflare Vectorize (primary) with D1 metadata
- **File Storage**: Cloudflare R2
- **Cache**: Cloudflare KV
- **Authentication**: Better Auth with session management

## 📋 Prerequisites

### Required Tools
- [Bun](https://bun.sh) >= 1.2.17
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Required Accounts & Services

1. **Cloudflare Account**
   - Go to [cloudflare.com](https://dash.cloudflare.com/sign-up)
   - Note your Account ID from the dashboard URL
   - Create an API token with permissions:
     - Account:D1:Edit
     - Account:AI Gateway:Edit
     - Account:Workers KV Storage:Edit
     - Account:Workers R2 Storage:Edit
     - Account:Vectorize:Edit
     - Zone:Workers Routes:Edit

2. **API Keys**
   - **OpenAI**: Required for embeddings and AI features (already provided)
   - **Resend**: Required for email functionality (optional)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd supermemory

# Install dependencies
bun install
```

### 2. Configure Environment Variables

The OpenAI key is already configured. You need to set your Cloudflare credentials:

```bash
# Edit .env file
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```

### 3. Login to Cloudflare

```bash
# Make sure you're logged in to Cloudflare
wrangler login
```

### 4. Run Automated Deployment

```bash
# Source environment variables
source .env

# Run deployment script
./deploy-d1.sh
```

## 📝 Manual Deployment Steps

If you prefer manual deployment:

### Step 1: Setup Cloudflare Services

```bash
# Create D1 database
wrangler d1 create supermemory

# Create KV namespace
wrangler kv:namespace create "supermemory_kv"

# Create R2 bucket
wrangler r2 bucket create supermemory-files

# Create Vectorize index
wrangler vectorize create supermemory-vectors \
  --dimensions=1536 \
  --metric=cosine
```

### Step 2: Update Configuration

Update `apps/api/wrangler.toml` with the IDs from step 1:
- Replace `D1_DATABASE_ID_PLACEHOLDER` with your D1 database ID
- Replace `KV_NAMESPACE_ID_PLACEHOLDER` with your KV namespace ID

### Step 3: Setup Database Schema

```bash
cd apps/api

# Generate and apply D1 schema
bun run db:generate
bun run db:push
```

### Step 4: Deploy Backend API

```bash
cd apps/api

# Set secrets
echo "supermemory_dev_secret_key_12345" | wrangler secret put BETTER_AUTH_SECRET
echo "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" | wrangler secret put OPENAI_API_KEY

# Deploy
bun run deploy
```

### Step 5: Deploy Frontend

```bash
cd apps/web

# Update backend URL in .env.local
echo "NEXT_PUBLIC_BACKEND_URL=https://supermemory-api.terragon.workers.dev" > .env.local

# Build and deploy
bun run build
bun run deploy
```

## 🔧 Configuration Details

### Database Schema (D1/SQLite)

The application uses Cloudflare D1 with these main tables:
- `users` - User accounts
- `sessions` - Authentication sessions
- `documents` - Stored memories/documents
- `memory_chunks` - Metadata for vectorized chunks
- `connections` - External service integrations
- `projects` - User projects
- `analytics_events` - Usage tracking

### Vector Search Strategy

Since D1 doesn't support vector operations, the application uses:
- **Cloudflare Vectorize**: Primary vector search engine
- **D1**: Stores metadata and content for chunks
- **Hybrid approach**: Search vectors in Vectorize, fetch metadata from D1

### API Endpoints

- `POST /v3/memories` - Create memory
- `GET /v3/memories/:id` - Get memory
- `POST /v3/memories/list` - List memories
- `DELETE /v3/memories/:id` - Delete memory
- `POST /v3/search` - Semantic search
- `GET /v3/connections` - List connections
- `POST /v3/connections/:provider` - Create connection
- `GET /v3/settings` - Get settings
- `PATCH /v3/settings` - Update settings
- `POST /chat` - Chat with memories

## 🧪 Testing

### Test Frontend
```bash
curl https://supermemory-consumer.terragon.workers.dev
```

### Test API Health
```bash
curl https://supermemory-api.terragon.workers.dev/health
```

### Test Database Connection
```bash
# List D1 databases
wrangler d1 list

# Query your database
wrangler d1 execute supermemory --command "SELECT COUNT(*) FROM users"
```

### Test Authentication
```bash
# Register a new user
curl -X POST https://supermemory-api.terragon.workers.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure_password","name":"Test User"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **D1 Database Creation Failed**
   - Make sure you have D1 permissions in your API token
   - Check your Cloudflare account has access to D1

2. **Vectorize Index Issues**
   - Ensure your account has Vectorize access
   - Check the index dimensions match (1536 for OpenAI)

3. **Authentication Issues**
   - Verify BETTER_AUTH_SECRET is set correctly
   - Check BETTER_AUTH_URL matches your API domain

4. **Vector Search Not Working**
   - Ensure Vectorize index is created successfully
   - Check that embeddings are being generated and stored

### Logs and Monitoring

```bash
# View API logs
wrangler tail --env production

# Check D1 database status
wrangler d1 info supermemory

# View KV storage
wrangler kv:key list --namespace-id=<your-namespace-id>

# Check Vectorize index
wrangler vectorize get supermemory-vectors
```

## 📊 Performance Characteristics

### D1 Limitations & Optimizations

1. **Write Performance**: D1 has eventual consistency
   - Memory processing happens asynchronously
   - Status updates may take a few seconds

2. **Read Performance**: Optimized for read operations
   - Proper indexing on frequently queried fields
   - JSON fields for flexible metadata storage

3. **Vector Search**: 
   - Primary search via Vectorize (fast)
   - Metadata retrieval from D1 (efficient for smaller datasets)

### Scaling Considerations

- **D1**: Suitable for most use cases, scales automatically
- **Vectorize**: Handles large vector datasets efficiently
- **Workers**: Auto-scale based on demand
- **KV**: Global edge caching for sessions

## 🔄 Updates and Maintenance

### Update Application
```bash
git pull origin main
bun install
./deploy-d1.sh
```

### Backup Database
```bash
# Export D1 database
wrangler d1 export supermemory --output backup-$(date +%Y%m%d).sql
```

### Monitor Usage
- Check Cloudflare Analytics dashboard
- Review application analytics at `/v3/analytics/usage`
- Monitor D1 usage in Cloudflare dashboard

## 📚 Key Differences from PostgreSQL Version

1. **Database**: Uses D1 (SQLite) instead of PostgreSQL
2. **Vector Storage**: Vectorize only (no pgvector fallback)
3. **JSON Handling**: String serialization instead of native JSON types
4. **Timestamps**: Unix timestamps instead of native datetime
5. **Migrations**: D1-specific migration system

## 💡 Tips for D1 Development

1. **Local Development**: Use `wrangler dev` for local testing
2. **Schema Changes**: Use `bun run db:generate` and `bun run db:push`
3. **Data Inspection**: Use `wrangler d1 execute` for queries
4. **Performance**: Keep queries simple, D1 works best with straightforward operations
5. **JSON Fields**: Always validate JSON parsing in your application

## 🆘 Support

If you encounter issues:
1. Check the logs with `wrangler tail`
2. Verify D1 database status with `wrangler d1 info`
3. Review the troubleshooting section
4. Open an issue with detailed error messages

## 🎯 Next Steps After Deployment

1. **Test the application** by creating memories and searching
2. **Set up monitoring** with Sentry if desired
3. **Configure OAuth providers** for social login
4. **Add external connectors** for Google Drive, Notion, etc.
5. **Customize the UI** and branding as needed

Your SuperMemory application is now running entirely on Cloudflare's infrastructure with D1, providing a fast, scalable, and cost-effective solution!