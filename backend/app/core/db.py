from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase
import logging

from app.core.config import settings

logger = logging.getLogger("app")

# Azure App Service specific configuration
import os

engine_args = {
    "pool_pre_ping": True,
    "pool_size": int(os.getenv("DB_POOL_SIZE", "10")),  # Increased for Azure
    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "20")),  # Increased for Azure
    "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "60")),  # Increased timeout for Azure
    "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "1800")),
    "connect_args": {
        "connect_timeout": int(os.getenv("DB_CONNECT_TIMEOUT", "30")),  # Increased for Azure cold starts
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
        "options": "-c statement_timeout=300000"  # 5 minute statement timeout
    }
}

try:
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, **engine_args)
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Async database setup
async_engine_args = {
    "pool_pre_ping": True,
    "pool_size": int(os.getenv("DB_POOL_SIZE", "10")),
    "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "20")),
    "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", "60")),
    "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", "1800")),
}

# Convert sync URL to async URL and handle SSL parameters
async_db_uri = settings.SQLALCHEMY_DATABASE_URI.replace("postgresql://", "postgresql+asyncpg://")
# Remove psycopg2-specific SSL parameters that asyncpg doesn't understand
if "?sslmode=" in async_db_uri:
    # Split URL and parameters
    base_url, params = async_db_uri.split("?", 1)
    # Remove sslmode parameter
    new_params = [p for p in params.split("&") if not p.startswith("sslmode=")]
    if new_params:
        async_db_uri = f"{base_url}?{'&'.join(new_params)}"
    else:
        async_db_uri = base_url

async_engine = create_async_engine(
    async_db_uri,
    **async_engine_args
)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

async def create_tables_async():
    """Create all database tables asynchronously"""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    """Get async database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()