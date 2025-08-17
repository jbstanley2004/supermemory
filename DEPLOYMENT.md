# SuperMemory Full-Stack Deployment Guide

This guide will help you deploy the complete SuperMemory application (frontend and backend) to Cloudflare Workers.

## 🏗️ Architecture Overview

- **Frontend**: Next.js application deployed via OpenNext to Cloudflare Workers
- **Backend API**: Hono-based REST API on Cloudflare Workers
- **Database**: PostgreSQL with pgvector (via Cloudflare Hyperdrive)
- **Vector Search**: Cloudflare Vectorize + pgvector
- **File Storage**: Cloudflare R2
- **Cache**: Cloudflare KV
- **Authentication**: Better Auth with session management

## 📋 Prerequisites

### Required Tools
- [Bun](https://bun.sh) >= 1.2.17
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [PostgreSQL client](https://www.postgresql.org/download/) (for migrations)

### Required Accounts & Services

1. **Cloudflare Account**
   - Go to [cloudflare.com](https://dash.cloudflare.com/sign-up)
   - Note your Account ID from the dashboard URL
   - Create an API token with permissions:
     - Account:AI Gateway:Edit
     - Account:Hyperdrive:Edit
     - Account:Workers KV Storage:Edit
     - Account:Workers R2 Storage:Edit
     - Account:Vectorize:Edit
     - Zone:Workers Routes:Edit

2. **PostgreSQL Database with pgvector**
   
   Recommended providers:
   - **[Neon](https://neon.tech)** - Serverless Postgres with pgvector
   - **[Supabase](https://supabase.com)** - Full-featured Postgres with pgvector
   - **[Timescale Cloud](https://www.timescale.com)** - Time-series optimized with pgvector

   Requirements:
   - pgvector extension enabled
   - SSL connections supported
   - Accessible from Cloudflare IPs

3. **API Keys**
   - **OpenAI**: Required for embeddings and AI features
   - **Resend**: Required for email functionality
   - **Anthropic** (Optional): For Claude models
   - **Google Gemini** (Optional): For Gemini models

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd supermemory

# Install dependencies
bun install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your credentials:

```bash
# Required
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=https://your-api-subdomain.workers.dev
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

### 3. Run Automated Deployment

```bash
# Make sure you're logged in to Cloudflare
wrangler login

# Source environment variables
source .env

# Run deployment script
./deploy.sh
```

## 📝 Manual Deployment Steps

If you prefer manual deployment or need to customize:

### Step 1: Setup Cloudflare Services

```bash
# Create KV namespace
wrangler kv:namespace create "supermemory_kv"

# Create R2 bucket
wrangler r2 bucket create supermemory-files

# Create Vectorize index
wrangler vectorize create supermemory-vectors \
  --dimensions=1536 \
  --metric=cosine
```

### Step 2: Setup Database

```bash
# Connect to your PostgreSQL database
psql $DATABASE_URL

# Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

# Run migrations
cd apps/api
bun run drizzle-kit push:pg

# Apply optimizations
psql $DATABASE_URL < scripts/setup-database.sql
```

### Step 3: Configure Hyperdrive

```bash
# Create Hyperdrive configuration
wrangler hyperdrive create supermemory-db \
  --connection-string "$DATABASE_URL" \
  --caching-disabled false

# Note the ID and update apps/api/wrangler.toml
```

### Step 4: Deploy Backend API

```bash
cd apps/api

# Set secrets
echo "$DATABASE_URL" | wrangler secret put DATABASE_URL
echo "$BETTER_AUTH_SECRET" | wrangler secret put BETTER_AUTH_SECRET
echo "$OPENAI_API_KEY" | wrangler secret put OPENAI_API_KEY
echo "$RESEND_API_KEY" | wrangler secret put RESEND_API_KEY

# Deploy
bun run deploy
```

### Step 5: Deploy Frontend

```bash
cd apps/web

# Update backend URL in .env.local
echo "NEXT_PUBLIC_BACKEND_URL=https://your-api.workers.dev" > .env.local

# Build and deploy
bun run build
bun run deploy
```

## 🔧 Configuration Details

### Database Schema

The application uses the following main tables:
- `users` - User accounts
- `sessions` - Authentication sessions
- `documents` - Stored memories/documents
- `memory_chunks` - Vectorized chunks for search
- `connections` - External service integrations
- `projects` - User projects
- `analytics_events` - Usage tracking

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

### Security Considerations

1. **Authentication**: All API endpoints require authentication via Better Auth
2. **CORS**: Configured to allow only specific origins
3. **Rate Limiting**: Implemented via Cloudflare's built-in protections
4. **Secrets Management**: Use Wrangler secrets for sensitive data

## 🧪 Testing

### Test Frontend
```bash
curl https://your-frontend.workers.dev
```

### Test API Health
```bash
curl https://your-api.workers.dev/health
```

### Test Authentication
```bash
# Register a new user
curl -X POST https://your-api.workers.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secure_password"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Ensure pgvector extension is enabled
   - Check SSL requirements

2. **Hyperdrive Not Working**
   - Update the Hyperdrive ID in wrangler.toml
   - Ensure database allows connections from Cloudflare

3. **Authentication Issues**
   - Verify BETTER_AUTH_SECRET is set correctly
   - Check BETTER_AUTH_URL matches your API domain

4. **Vector Search Not Working**
   - Ensure Vectorize index is created
   - Check embedding dimensions match (1536 for OpenAI)

### Logs and Monitoring

```bash
# View API logs
wrangler tail --env production

# View frontend logs
cd apps/web && wrangler tail

# Check KV storage
wrangler kv:key list --namespace-id=<your-namespace-id>
```

## 📊 Performance Optimization

1. **Database**
   - Use Hyperdrive for connection pooling
   - Create proper indexes (see setup-database.sql)
   - Monitor query performance

2. **Caching**
   - KV used for session caching
   - R2 for static file storage
   - Hyperdrive caches database queries

3. **Vector Search**
   - Use Vectorize for fast similarity search
   - Fallback to pgvector for complex queries
   - Implement chunk and document thresholds

## 🔄 Updates and Maintenance

### Update Application
```bash
git pull origin main
bun install
./deploy.sh
```

### Backup Database
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Monitor Usage
- Check Cloudflare Analytics dashboard
- Review application analytics at `/v3/analytics/usage`
- Monitor error rates in Cloudflare dashboard

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [OpenNext Documentation](https://opennext.js.org/)
- [Hono Documentation](https://hono.dev/)
- [Better Auth Documentation](https://better-auth.com/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

## 💡 Tips

1. Start with a small database for testing
2. Use Cloudflare's preview deployments for staging
3. Enable Sentry for production error tracking
4. Set up GitHub Actions for CI/CD
5. Use custom domains for production

## 🆘 Support

If you encounter issues:
1. Check the logs with `wrangler tail`
2. Review the troubleshooting section
3. Open an issue with detailed error messages
4. Include your deployment configuration (without secrets)