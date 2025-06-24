import logging
import os
from fastapi import FastAPI, Response
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware as StarletteCORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.config import settings
from app.core.logging import LoggingMiddleware, setup_logging
from app.core.exceptions import (
    ContainerManagementException,
    ResourceNotFoundError,
    ResourceConflictError,
    CustomValidationError,
    InventoryError,
    TrayError,
    PanelError,
    CropLocationError,
    container_management_exception_handler,
    resource_not_found_exception_handler,
    resource_conflict_exception_handler,
    validation_exception_handler,
    inventory_error_handler,
    tray_error_handler,
    panel_error_handler,
    crop_location_error_handler,
    integrity_error_handler,
    sqlalchemy_error_handler,
    general_exception_handler,
)
from app.api.routes import container_router, location_router, inventory_router

# Setup logging
setup_logging()
logger = logging.getLogger("app")

def custom_generate_unique_id(route: APIRoute) -> str:
    if route.tags:
        return f"{route.tags[0]}-{route.name}"
    return route.name

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Container Management API with comprehensive error handling",
    version="1.0.0",
    generate_unique_id_function=custom_generate_unique_id,
)

# Add exception handlers
app.add_exception_handler(
    ContainerManagementException, container_management_exception_handler
)
app.add_exception_handler(ResourceNotFoundError, resource_not_found_exception_handler)
app.add_exception_handler(ResourceConflictError, resource_conflict_exception_handler)
app.add_exception_handler(CustomValidationError, validation_exception_handler)
app.add_exception_handler(InventoryError, inventory_error_handler)
app.add_exception_handler(TrayError, tray_error_handler)
app.add_exception_handler(PanelError, panel_error_handler)
app.add_exception_handler(CropLocationError, crop_location_error_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Add proxy headers middleware
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Set all CORS enabled origins
# Use wildcard for Azure deployments in production
cors_origins = settings.all_cors_origins
if settings.AZURE_WEBSITE_HOSTNAME:
    # In Azure, allow all Azure websites for flexibility
    cors_origins = ["*"]
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(container_router, prefix="/api/containers", tags=["containers"])
app.include_router(location_router, prefix="/api/locations", tags=["locations"])
app.include_router(inventory_router, prefix="/api", tags=["inventory"])


@app.on_event("startup")
async def startup_event():
    """Application startup event."""
    import time
    from app.core.db import engine, create_tables
    
    logger.info("Container Management API starting up")
    logger.info("API version: 1.0.0")
    logger.info("Environment: %s", settings.PROJECT_NAME)
    
    if settings.AZURE_WEBSITE_HOSTNAME:
        logger.info(f"Running on Azure App Service: {settings.AZURE_WEBSITE_HOSTNAME}")
    
    # Try to connect to database with retries
    max_retries = int(os.getenv("DB_STARTUP_RETRIES", "10"))  # Increased for Azure
    retry_delay = int(os.getenv("DB_STARTUP_DELAY", "10"))  # Increased for Azure
    
    for attempt in range(max_retries):
        try:
            # Test database connection
            from sqlalchemy import text
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Database connection successful")
            
            # Create tables if needed
            create_tables()
            logger.info("Database tables ready")
            break
        except Exception as e:
            logger.error(f"Database connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Failed to connect to database after all retries")
                # Don't raise here to allow the app to start even without DB
                # The readiness probe will report the unhealthy state


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event."""
    logger.info("Container Management API shutting down")


@app.get("/")
def root():
    """Root endpoint."""
    logger.info("Root endpoint accessed")
    return {"message": "Container Management API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    """Health check endpoint for Azure App Service."""
    # This is a simple liveness check - always returns 200
    # Azure uses this to determine if the container is running
    return {
        "status": "healthy", 
        "service": "container-management-api",
        "timestamp": __import__('time').time()
    }


@app.get("/readiness")
def readiness_check():
    """Readiness check endpoint for Azure App Service."""
    from app.core.db import SessionLocal
    from sqlalchemy import text
    import time
    
    # Add timeout for readiness check
    start_time = time.time()
    timeout = int(os.getenv("READINESS_TIMEOUT", "10"))
    
    # Check database connectivity
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        result.fetchone()
        db.close()
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database readiness check failed: {e}")
        db_status = "disconnected"
        
        # If we're still within startup window, return 503
        if time.time() - start_time < timeout:
            return Response(
                content={"status": "not_ready", "database": db_status}, 
                status_code=503,
                headers={"Retry-After": "10"}
            )
    
    return {
        "status": "ready",
        "service": "container-management-api",
        "database": db_status,
        "environment": "azure" if settings.AZURE_WEBSITE_HOSTNAME else "local"
    }