#!/usr/bin/env python3
"""
Database initialization script for Container Management System.
This script initializes the database with migrations and optionally seeds data.
"""

import asyncio
import subprocess
import sys
from pathlib import Path

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from app.core.db import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


async def check_database_connection():
    """Check if database connection is working"""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def run_migrations():
    """Run Alembic migrations"""
    print("Running database migrations...")
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Migrations completed successfully!")
            return True
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False


async def seed_database():
    """Run database seeding"""
    print("Running database seeding...")
    try:
        result = subprocess.run(
            [sys.executable, "scripts/seed_database.py"],
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Database seeding completed successfully!")
            print(result.stdout)
            return True
        else:
            print(f"❌ Database seeding failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error running database seeding: {e}")
        return False


async def main():
    """Main initialization function"""
    print("🚀 Starting database initialization...")
    
    # Check database connection
    if not await check_database_connection():
        print("❌ Database initialization failed - no connection")
        sys.exit(1)
    
    # Run migrations
    if not run_migrations():
        print("❌ Database initialization failed - migration error")
        sys.exit(1)
    
    # Seed database
    if not await seed_database():
        print("❌ Database initialization failed - seeding error")
        sys.exit(1)
    
    print("🎉 Database initialization completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())