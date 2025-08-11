#!/bin/bash

# Test runner script for the scheduler backend
set -e

echo "🧪 Setting up test environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Set test environment
export NODE_ENV=test
export DATABASE_URL="${DATABASE_URL_TEST:-postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler_test}"
export JWT_SECRET="test-secret"

echo "📊 Using test database: $DATABASE_URL"

# Check if test database exists, create if not
echo "🔍 Checking test database..."
if ! psql -h localhost -U scheduler_user -d scheduler_test -c "SELECT 1" > /dev/null 2>&1; then
    echo "📝 Creating test database..."
    psql -h localhost -U scheduler_user -d scheduler -c "CREATE DATABASE scheduler_test;" || {
        echo "❌ Failed to create test database"
        exit 1
    }
fi

# Push schema to test database
echo "🗄️  Setting up test database schema..."
npx prisma db push --schema=./prisma/schema.prisma || {
    echo "❌ Failed to set up test database schema"
    exit 1
}

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate || {
    echo "❌ Failed to generate Prisma client"
    exit 1
}

# Run tests
echo "🚀 Running tests..."
npm test || {
    echo "❌ Tests failed"
    exit 1
}

echo "✅ All tests completed successfully!"
echo ""
echo "📋 Test Summary:"
echo "  - Controllers: Auth, User, Schedule"
echo "  - Middleware: Auth"
echo "  - Services: Schedule"
echo "  - Database: Test isolation with cleanup"
echo ""
echo "🎯 To run specific test suites:"
echo "  npm test -- --testNamePattern='AuthController'"
echo "  npm test -- --testNamePattern='UserController'"
echo "  npm test -- --testNamePattern='ScheduleController'"
echo "  npm test -- --testNamePattern='Auth Middleware'"
echo "  npm test -- --testNamePattern='ScheduleService'"
echo ""
echo "🔍 To run with coverage:"
echo "  npm run test:coverage"
echo ""
echo "👀 To run in watch mode:"
echo "  npm run test:watch"
