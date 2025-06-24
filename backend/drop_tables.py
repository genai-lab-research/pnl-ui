#!/usr/bin/env python3
"""
Script to drop all tables in the PostgreSQL database
"""

from app.core.db import Base, engine
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def drop_all_tables():
    """Drop all tables from the database"""
    try:
        logger.info(f"Connecting to database: {settings.SQLALCHEMY_DATABASE_URI}")
        logger.info("Dropping all tables...")
        
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        
        logger.info("All tables dropped successfully!")
        
    except Exception as e:
        logger.error(f"Error dropping tables: {e}")
        raise

if __name__ == "__main__":
    drop_all_tables()