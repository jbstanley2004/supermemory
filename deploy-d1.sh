#!/bin/bash

echo "🚀 Starting SuperMemory Deployment with Cloudflare D1"
echo "=================================================="

# Check if required environment variables are set
check_env() {
    if [ -z "$1" ]; then
        echo "❌ Error: $2 is not set"
        exit 1
    fi
}

# Deploy Frontend
deploy_frontend() {
    echo "📦 Deploying Frontend to Cloudflare Workers..."
    cd apps/web
    
    # Build the frontend
    echo "Building Next.js application..."
    bun run build
    
    # Deploy to Cloudflare using OpenNext
    echo "Deploying to Cloudflare Workers..."
    bun run deploy
    
    cd ../..
    echo "✅ Frontend deployed successfully"
}

# Deploy Backend API
deploy_backend() {
    echo "📦 Deploying Backend API to Cloudflare Workers..."
    cd apps/api
    
    # Install dependencies
    echo "Installing API dependencies..."
    bun install
    
    # Deploy to Cloudflare
    echo "Deploying API to Cloudflare Workers..."
    bun run deploy
    
    cd ../..
    echo "✅ Backend API deployed successfully"
}

# Setup Cloudflare services
setup_cloudflare() {
    echo "⚙️ Setting up Cloudflare services..."
    
    # Create D1 database
    echo "Creating D1 database..."
    D1_DB_OUTPUT=$(wrangler d1 create supermemory)
    D1_DATABASE_ID=$(echo "$D1_DB_OUTPUT" | grep "database_id" | awk -F'"' '{print $4}')
    
    if [ -z "$D1_DATABASE_ID" ]; then
        echo "❌ Failed to create D1 database"
        exit 1
    fi
    
    echo "D1 Database ID: $D1_DATABASE_ID"
    
    # Update wrangler.toml with D1 database ID
    sed -i "s/D1_DATABASE_ID_PLACEHOLDER/$D1_DATABASE_ID/g" apps/api/wrangler.toml
    
    # Create KV namespace
    echo "Creating KV namespace..."
    KV_OUTPUT=$(wrangler kv:namespace create "supermemory_kv")
    KV_ID=$(echo "$KV_OUTPUT" | grep "id" | awk -F'"' '{print $4}')
    
    if [ -z "$KV_ID" ]; then
        echo "❌ Failed to create KV namespace"
        exit 1
    fi
    
    echo "KV Namespace ID: $KV_ID"
    sed -i "s/KV_NAMESPACE_ID_PLACEHOLDER/$KV_ID/g" apps/api/wrangler.toml
    
    # Create R2 bucket
    echo "Creating R2 bucket..."
    wrangler r2 bucket create supermemory-files || true
    
    # Create Vectorize index
    echo "Creating Vectorize index..."
    wrangler vectorize create supermemory-vectors \
        --dimensions=1536 \
        --metric=cosine || true
    
    echo "✅ Cloudflare services configured"
}

# Setup D1 database
setup_database() {
    echo "🗄️ Setting up D1 database..."
    
    cd apps/api
    
    # Generate database migrations
    echo "Generating database schema..."
    export CLOUDFLARE_ACCOUNT_ID
    export CLOUDFLARE_API_TOKEN
    export D1_DATABASE_ID
    bun run db:generate
    
    # Apply database migrations to D1
    echo "Applying database migrations..."
    bun run db:push
    
    cd ../..
    echo "✅ D1 database setup complete"
}

# Set secrets
set_secrets() {
    echo "🔐 Setting up secrets..."
    
    cd apps/api
    
    # Set required secrets
    echo "$BETTER_AUTH_SECRET" | wrangler secret put BETTER_AUTH_SECRET
    echo "$OPENAI_API_KEY" | wrangler secret put OPENAI_API_KEY
    echo "$RESEND_API_KEY" | wrangler secret put RESEND_API_KEY
    
    # Set optional secrets if available
    [ ! -z "$ANTHROPIC_API_KEY" ] && echo "$ANTHROPIC_API_KEY" | wrangler secret put ANTHROPIC_API_KEY
    [ ! -z "$GEMINI_API_KEY" ] && echo "$GEMINI_API_KEY" | wrangler secret put GEMINI_API_KEY
    [ ! -z "$GROQ_API_KEY" ] && echo "$GROQ_API_KEY" | wrangler secret put GROQ_API_KEY
    
    cd ../..
    echo "✅ Secrets configured"
}

# Main deployment flow
main() {
    echo "Checking prerequisites..."
    
    # Check for required tools
    command -v bun >/dev/null 2>&1 || { echo "❌ bun is required but not installed."; exit 1; }
    command -v wrangler >/dev/null 2>&1 || { echo "❌ wrangler is required but not installed."; exit 1; }
    
    # Check for required environment variables
    check_env "$CLOUDFLARE_ACCOUNT_ID" "CLOUDFLARE_ACCOUNT_ID"
    check_env "$CLOUDFLARE_API_TOKEN" "CLOUDFLARE_API_TOKEN"
    check_env "$BETTER_AUTH_SECRET" "BETTER_AUTH_SECRET"
    check_env "$OPENAI_API_KEY" "OPENAI_API_KEY"
    
    # Export Cloudflare credentials
    export CLOUDFLARE_ACCOUNT_ID
    export CLOUDFLARE_API_TOKEN
    
    # Run deployment steps
    setup_cloudflare
    setup_database
    set_secrets
    deploy_backend
    deploy_frontend
    
    echo ""
    echo "🎉 SuperMemory deployment complete!"
    echo ""
    echo "Frontend URL: https://supermemory-consumer.terragon.workers.dev"
    echo "Backend API URL: https://supermemory-api.terragon.workers.dev"
    echo ""
    echo "D1 Database ID: $D1_DATABASE_ID"
    echo "KV Namespace ID: $KV_ID"
    echo ""
    echo "Your SuperMemory application is now running on Cloudflare!"
    echo "You can start adding memories and using the search functionality."
}

# Run main function
main