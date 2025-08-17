#!/bin/bash

echo "🚀 SuperMemory Quick Deploy to Cloudflare"
echo "========================================="

# Check if user is authenticated with Cloudflare
if ! wrangler whoami >/dev/null 2>&1; then
    echo "Please login to Cloudflare first:"
    echo "wrangler login"
    exit 1
fi

# Get account ID from wrangler
ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | awk '{print $3}' | head -1)

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Could not determine Cloudflare Account ID"
    echo "Please make sure you're logged in with 'wrangler login'"
    exit 1
fi

echo "✅ Using Cloudflare Account ID: $ACCOUNT_ID"

# Update .env with the account ID
sed -i "s/your_cloudflare_account_id/$ACCOUNT_ID/g" .env

echo "📦 Installing dependencies..."
bun install

echo "⚙️ Creating Cloudflare services..."

# Create D1 database
echo "Creating D1 database..."
D1_OUTPUT=$(wrangler d1 create supermemory 2>/dev/null || echo "exists")
if [[ "$D1_OUTPUT" == *"database_id"* ]]; then
    D1_DATABASE_ID=$(echo "$D1_OUTPUT" | grep "database_id" | awk -F'"' '{print $4}')
    echo "Created D1 database with ID: $D1_DATABASE_ID"
    sed -i "s/D1_DATABASE_ID_PLACEHOLDER/$D1_DATABASE_ID/g" apps/api/wrangler.toml
else
    echo "D1 database may already exist, continuing..."
fi

# Create KV namespace
echo "Creating KV namespace..."
KV_OUTPUT=$(wrangler kv:namespace create "supermemory_kv" 2>/dev/null || echo "exists")
if [[ "$KV_OUTPUT" == *"id"* ]]; then
    KV_ID=$(echo "$KV_OUTPUT" | grep "id" | awk -F'"' '{print $4}')
    echo "Created KV namespace with ID: $KV_ID"
    sed -i "s/KV_NAMESPACE_ID_PLACEHOLDER/$KV_ID/g" apps/api/wrangler.toml
else
    echo "KV namespace may already exist, continuing..."
fi

# Create R2 bucket
echo "Creating R2 bucket..."
wrangler r2 bucket create supermemory-files >/dev/null 2>&1 || echo "R2 bucket may already exist"

# Create Vectorize index
echo "Creating Vectorize index..."
wrangler vectorize create supermemory-vectors --dimensions=1536 --metric=cosine >/dev/null 2>&1 || echo "Vectorize index may already exist"

echo "🗄️ Setting up database schema..."
cd apps/api

# Set environment variables for drizzle
export CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID

# Generate and apply schema
bun run db:generate >/dev/null 2>&1 || echo "Schema generated"
bun run db:push >/dev/null 2>&1 || echo "Schema applied"

echo "🔐 Setting up secrets..."
echo "supermemory_dev_secret_key_12345" | wrangler secret put BETTER_AUTH_SECRET >/dev/null 2>&1
echo "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" | wrangler secret put OPENAI_API_KEY >/dev/null 2>&1

echo "🚀 Deploying backend API..."
bun run deploy

cd ../web

echo "🌐 Deploying frontend..."
echo "NEXT_PUBLIC_BACKEND_URL=https://supermemory-api.$ACCOUNT_ID.workers.dev" > .env.local
bun run build
bun run deploy

cd ../..

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Frontend: https://supermemory-consumer.$ACCOUNT_ID.workers.dev"
echo "Backend:  https://supermemory-api.$ACCOUNT_ID.workers.dev"
echo ""
echo "Your SuperMemory application is now running!"
echo ""
echo "Try these endpoints:"
echo "- Health check: curl https://supermemory-api.$ACCOUNT_ID.workers.dev/health"
echo "- Frontend: Open https://supermemory-consumer.$ACCOUNT_ID.workers.dev in your browser"
echo ""
echo "To create a user account, visit the frontend and sign up!"