#!/bin/bash
set -e

echo "🐳 Starting Docker entrypoint..."

# Test DNS resolution first
echo "🔍 Testing DNS resolution..."
python -c "
import socket
import os
import sys

db_host = os.getenv('POSTGRES_SERVER', 'localhost')
try:
    ip = socket.gethostbyname(db_host)
    print(f'✅ DNS resolved {db_host} to {ip}')
except socket.gaierror as e:
    print(f'❌ DNS resolution failed for {db_host}: {e}')
    print('🔧 Trying to use public DNS servers...')
    # Just log the error, continue to try connection
"

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
        error_msg = f'Connection attempt {i+1}/{max_tries} failed: {type(e).__name__}: {str(e)}'
        print(f'⏳ {error_msg}')
        if i == max_tries - 1:
            print(f'❌ Database connection failed after {max_tries} attempts')
            print(f'❌ Final error: {e}')
            print(f'❌ Connection string: {sync_engine.url}')
            sys.exit(1)
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
