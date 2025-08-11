#!/bin/bash

# Test environment management script
set -e

echo "🧪 Scheduler Test Environment Manager"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Function to show usage
show_usage() {
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Set up test database and generate Prisma client"
    echo "  reset     - Reset test database (destructive)"
    echo "  run       - Run all tests"
    echo "  coverage  - Run tests with coverage"
    echo "  watch     - Run tests in watch mode"
    echo "  status    - Show test environment status"
    echo "  help      - Show this help message"
    echo ""
}

# Function to check test environment status
check_status() {
    echo "🔍 Checking test environment status..."
    
    if [ -n "$DATABASE_URL_TEST" ]; then
        echo "✅ DATABASE_URL_TEST is set: $DATABASE_URL_TEST"
    else
        echo "⚠️  DATABASE_URL_TEST not set, using default"
    fi
    
    if psql -h localhost -U scheduler_user -d scheduler_test -c "SELECT 1" > /dev/null 2>&1; then
        echo "✅ Test database 'scheduler_test' exists and is accessible"
        
        # Check if tables exist
        TABLE_COUNT=$(psql -h localhost -U scheduler_user -d scheduler_test -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
        echo "📊 Test database has $TABLE_COUNT tables"
    else
        echo "❌ Test database 'scheduler_test' is not accessible"
    fi
    
    if [ -d "node_modules" ]; then
        echo "✅ Node modules are installed"
    else
        echo "❌ Node modules are not installed (run 'npm install' first)"
    fi
    
    if [ -d "generated/prisma" ]; then
        echo "✅ Prisma client is generated"
    else
        echo "❌ Prisma client is not generated (run 'npm run prisma generate' first)"
    fi
}

# Function to setup test environment
setup_env() {
    echo "🔧 Setting up test environment..."
    
    # Check if devenv is running
    if [ -z "$DATABASE_URL_TEST" ]; then
        echo "⚠️  Warning: DATABASE_URL_TEST not set. Make sure devenv is running."
        echo "   Run 'devenv up' in the project root if needed."
    fi
    
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🗄️  Setting up test database..."
    npm run test:setup
    
    echo "🔧 Generating Prisma client..."
    npm run prisma generate
    
    echo "✅ Test environment setup complete!"
}

# Function to reset test database
reset_db() {
    echo "⚠️  Warning: This will completely reset the test database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗄️  Resetting test database..."
        npm run test:reset
        echo "✅ Test database reset complete!"
    else
        echo "❌ Database reset cancelled"
    fi
}

# Function to run tests
run_tests() {
    echo "🚀 Running tests..."
    npm test
}

# Function to run tests with coverage
run_coverage() {
    echo "📊 Running tests with coverage..."
    npm run test:coverage
}

# Function to run tests in watch mode
run_watch() {
    echo "👀 Running tests in watch mode..."
    npm run test:watch
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup_env
        ;;
    "reset")
        reset_db
        ;;
    "run")
        run_tests
        ;;
    "coverage")
        run_coverage
        ;;
    "watch")
        run_watch
        ;;
    "status")
        check_status
        ;;
    "help"|*)
        show_usage
        ;;
esac
