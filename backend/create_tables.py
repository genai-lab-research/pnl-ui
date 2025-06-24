#!/usr/bin/env python3
"""
Script to create database tables with proper model imports
"""
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent))

# Import all models to ensure they're registered with SQLAlchemy
from app.models import *  # This imports all models
from app.core.db import create_tables

if __name__ == "__main__":
    print("Creating database tables...")
    create_tables()
    print("Tables created successfully!")