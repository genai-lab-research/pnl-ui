"""FastAPI main application for Container Management Dashboard."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.middleware import setup_middleware, setup_rate_limiting, HealthCheckMiddleware
from app.core.db import init_database
from app.api.routes.containers import router as containers_router
from app.api.routes.tenants import router as tenants_router
from app.api.routes.seed_types import router as seed_types_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.devices import router as devices_router, containers_router as device_containers_router
from app.api.routes.trays import router as trays_router
from app.api.routes.panels import router as panels_router
from app.api.routes.crops import router as crops_router
from app.api.routes.crops_new import router as crops_new_router
from app.api.routes.metrics import router as metrics_router
from app.api.routes.auth import router as auth_router
from app.api.routes.recipes import router as recipes_router
from app.api.routes.recipe_versions import router as recipe_versions_router
from app.api.routes.rfid import router as rfid_router
from app.api.routes.nursery_station import router as nursery_station_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting Container Management Dashboard API...")
    
    try:
        # Initialize database
        await init_database()
        logger.info("Database initialized successfully")
        
        logger.info("Application startup completed")
        yield
        
    except Exception as e:
        logger.error(f"Error during application startup: {e}")
        raise
    
    finally:
        # Shutdown
        logger.info("Shutting down Container Management Dashboard API...")


# Create FastAPI application
app = FastAPI(
    title="Container Management Dashboard API",
    description="API for managing containers and monitoring performance metrics",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Set up middleware
setup_middleware(app)

# Set up rate limiting (disabled by default)
setup_rate_limiting(app, enabled=False)

# Add health check middleware
app.add_middleware(HealthCheckMiddleware)

# Include API routes
app.include_router(
    containers_router,
    prefix=settings.API_V1_STR,
    tags=["containers"]
)

app.include_router(
    tenants_router,
    prefix=settings.API_V1_STR,
    tags=["tenants"]
)

app.include_router(
    seed_types_router,
    prefix=settings.API_V1_STR,
    tags=["seed-types"]
)

app.include_router(
    alerts_router,
    prefix=settings.API_V1_STR,
    tags=["alerts"]
)

app.include_router(
    devices_router,
    prefix=settings.API_V1_STR,
    tags=["devices"]
)

# Include device container routes
app.include_router(
    device_containers_router,
    prefix=settings.API_V1_STR,
    tags=["containers", "devices"]
)

app.include_router(
    trays_router,
    prefix=settings.API_V1_STR,
    tags=["trays"]
)

app.include_router(
    panels_router,
    prefix=settings.API_V1_STR,
    tags=["panels"]
)

app.include_router(
    rfid_router,
    prefix=settings.API_V1_STR,
    tags=["rfid"]
)

app.include_router(
    crops_router,
    prefix=settings.API_V1_STR,
    tags=["crops"]
)

app.include_router(
    metrics_router,
    prefix=settings.API_V1_STR,
    tags=["metrics"]
)

# Authentication routes
app.include_router(
    auth_router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)

# Recipe management routes
app.include_router(
    recipes_router,
    prefix=f"{settings.API_V1_STR}/recipes",
    tags=["recipes"]
)

# Recipe version routes
app.include_router(
    recipe_versions_router,
    prefix=f"{settings.API_V1_STR}/recipe-versions",
    tags=["recipe-versions"]
)

# New crop routes (following API specification)
app.include_router(
    crops_new_router,
    prefix=f"{settings.API_V1_STR}/crops-new",
    tags=["crops-new"]
)

# Nursery station routes
app.include_router(
    nursery_station_router,
    prefix=settings.API_V1_STR,
    tags=["nursery-station"]
)

# Additional API routes (you can add more routers here)
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Container Management Dashboard API",
        "version": "1.0.0",
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Container Management Dashboard API",
        "version": "1.0.0"
    }


@app.get(f"{settings.API_V1_STR}/info")
async def api_info():
    """API information endpoint."""
    return {
        "title": "Container Management Dashboard API",
        "version": "1.0.0",
        "description": "API for managing containers and monitoring performance metrics",
        "endpoints": {
            "containers": f"{settings.API_V1_STR}/containers",
            "metrics": f"{settings.API_V1_STR}/containers/metrics",
            "filter_options": f"{settings.API_V1_STR}/containers/filter-options",
            "shutdown": f"{settings.API_V1_STR}/containers/{{id}}/shutdown"
        },
        "documentation": {
            "swagger": f"{settings.API_V1_STR}/docs",
            "redoc": f"{settings.API_V1_STR}/redoc",
            "openapi": f"{settings.API_V1_STR}/openapi.json"
        }
    }


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": f"The endpoint {request.url.path} was not found",
            "status_code": 404
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors."""
    from fastapi.responses import JSONResponse
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "status_code": 500
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )