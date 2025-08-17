#!/bin/bash

echo "🚀 Starting SuperMemory Deployment"
echo "================================="

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
    
    # Create KV namespace
    echo "Creating KV namespace..."
    wrangler kv:namespace create "supermemory_kv" || true
    
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

# Setup database
setup_database() {
    echo "🗄️ Setting up database..."
    
    # Check if DATABASE_URL is set
    check_env "$DATABASE_URL" "DATABASE_URL"
    
    echo "Running database migrations..."
    cd apps/api
    bun run drizzle-kit push:pg
    
    echo "Applying database setup script..."
    psql "$DATABASE_URL" < scripts/setup-database.sql
    
    cd ../..
    echo "✅ Database setup complete"
}

# Setup Hyperdrive
setup_hyperdrive() {
    echo "🔧 Setting up Cloudflare Hyperdrive..."
    
    # Create Hyperdrive configuration
    echo "Creating Hyperdrive configuration..."
    HYPERDRIVE_ID=$(wrangler hyperdrive create supermemory-db \
        --connection-string "$DATABASE_URL" \
        --caching-disabled false \
        | grep "id:" | awk '{print $2}')
    
    echo "Hyperdrive ID: $HYPERDRIVE_ID"
    echo "Please update wrangler.toml with this ID"
    
    echo "✅ Hyperdrive configured"
}

# Set secrets
set_secrets() {
    echo "🔐 Setting up secrets..."
    
    cd apps/api
    
    # Set required secrets
    echo "$DATABASE_URL" | wrangler secret put DATABASE_URL
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
    check_env "$DATABASE_URL" "DATABASE_URL"
    check_env "$BETTER_AUTH_SECRET" "BETTER_AUTH_SECRET"
    check_env "$OPENAI_API_KEY" "OPENAI_API_KEY"
    
    # Export Cloudflare credentials
    export CLOUDFLARE_ACCOUNT_ID
    export CLOUDFLARE_API_TOKEN
    
    # Run deployment steps
    setup_cloudflare
    setup_database
    setup_hyperdrive
    set_secrets
    deploy_backend
    deploy_frontend
    
    echo ""
    echo "🎉 SuperMemory deployment complete!"
    echo ""
    echo "Frontend URL: https://supermemory-consumer.terragon.workers.dev"
    echo "Backend API URL: https://api-supermemory.terragon.workers.dev"
    echo ""
    echo "Next steps:"
    echo "1. Update the Hyperdrive ID in apps/api/wrangler.toml"
    echo "2. Re-deploy the API: cd apps/api && bun run deploy"
    echo "3. Test the application"
}

# Run main function
main