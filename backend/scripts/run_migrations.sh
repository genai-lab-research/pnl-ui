#!/bin/bash
echo "🔄 Running Alembic migrations..."

# Check if database is accessible
python -c "
from app.core.db import sync_engine
try:
    with sync_engine.connect() as conn:
        print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    exit(1)
"

# Initialize Alembic if not already initialized
if [ ! -f "alembic/versions/*.py" ] 2>/dev/null; then
    echo "📝 Creating initial migration..."
    alembic revision --autogenerate -m "Initial migration"
fi

# Run migrations
echo "🚀 Applying migrations..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi
