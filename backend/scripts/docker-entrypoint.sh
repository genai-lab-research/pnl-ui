#!/bin/bash
set -e

echo "🐳 Starting Docker entrypoint..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
python -c "
import time
import sys
from app.core.db import sync_engine
from sqlalchemy import text

max_tries = 30
for i in range(max_tries):
    try:
        with sync_engine.connect() as conn:
            conn.execute(text('SELECT 1'))
        print('✅ Database is ready!')
        break
    except Exception as e:
        if i == max_tries - 1:
            print(f'❌ Database connection failed after {max_tries} attempts: {e}')
            sys.exit(1)
        print(f'⏳ Database not ready, waiting... ({i+1}/{max_tries})')
        time.sleep(2)
"

# # Run migrations
# echo "🔄 Running migrations..."
# # Clean database and create fresh migration
# python -c "
# import sys
# from app.core.db import sync_engine, Base
# from sqlalchemy import text, inspect
# import subprocess
# import os

# try:
#     with sync_engine.connect() as conn:
#         # Drop all tables to start fresh
#         print('🔄 Dropping all tables for fresh start...')
#         conn.execute(text('DROP SCHEMA public CASCADE'))
#         conn.execute(text('CREATE SCHEMA public'))
#         conn.execute(text('GRANT ALL ON SCHEMA public TO public'))
#         conn.commit()
#         print('✅ Database cleaned!')
        
#         # Create initial migration if no versions exist
#         migration_files = os.listdir('alembic/versions')
#         py_files = [f for f in migration_files if f.endswith('.py')]
        
#         if not py_files:
#             print('🔄 Creating initial migration...')
#             subprocess.run(['alembic', 'revision', '--autogenerate', '-m', 'Initial migration'], check=True)
        
#         print('🔄 Running migration...')
#         subprocess.run(['alembic', 'upgrade', 'head'], check=True)
#         print('✅ Migration completed!')
        
# except Exception as e:
#     print(f'❌ Migration setup failed: {e}')
#     sys.exit(1)
# "

# Start the application
echo "🚀 Starting FastAPI application..."
exec "$@"
