#!/bin/bash
# Test database setup script

set -e

echo "Setting up test database..."

# Start test database
echo "Starting PostgreSQL container..."
docker-compose up -d postgres_test

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run migrations
echo "Running migrations..."
DATABASE_URL="postgresql://postgres:password@localhost:5434/decide_test" npx prisma migrate deploy

echo "Test database is ready!"
