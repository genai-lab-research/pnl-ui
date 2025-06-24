#!/usr/bin/env python3
"""
Script to run Alembic migrations
"""
import sys
import os
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

from alembic.config import Config
from alembic import command

def run_migrations():
    """Run database migrations"""
    # Set up Alembic configuration
    alembic_cfg = Config("alembic.ini")
    
    # Run the migrations
    try:
        print("Running database migrations...")
        command.upgrade(alembic_cfg, "head")
        print("Migrations completed successfully!")
    except Exception as e:
        print(f"Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migrations()