#!/bin/bash
# PostgreSQL database setup script

echo "🗄️  Setting up PostgreSQL database..."

# Database configuration
DB_NAME="${POSTGRES_DB:-demo}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-password}"
DB_HOST="${POSTGRES_SERVER:-localhost}"

# Check if PostgreSQL is installed and running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "   macOS: brew install postgresql && brew services start postgresql"
    echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "   CentOS/RHEL: sudo yum install postgresql postgresql-server"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -h $DB_HOST &> /dev/null; then
    echo "❌ PostgreSQL service is not running. Please start PostgreSQL:"
    echo "   macOS: brew services start postgresql"
    echo "   Ubuntu: sudo systemctl start postgresql"
    echo "   CentOS/RHEL: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed and running"

# Create database if it doesn't exist
echo "📊 Creating database '$DB_NAME'..."
if psql -h $DB_HOST -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "ℹ️  Database '$DB_NAME' already exists"
else
    createdb -h $DB_HOST -U $DB_USER $DB_NAME
    if [ $? -eq 0 ]; then
        echo "✅ Database '$DB_NAME' created successfully"
    else
        echo "❌ Failed to create database '$DB_NAME'"
        exit 1
    fi
fi

# Test database connection
echo "🔍 Testing database connection..."
if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "🎉 PostgreSQL setup completed successfully!"
