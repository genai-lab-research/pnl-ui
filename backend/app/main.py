from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html

from app.api.v1.api import api_router
from app.database.init_db import create_tables, populate_sample_data
from app.database.update_sample_data import update_sample_data

app = FastAPI(
    title="Vertical Farming Control Panel API",
    description="API for managing vertical farming containers and related resources",
    version="0.1.0",
    docs_url=None
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers defined in the API module
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Initialize database tables and sample data on startup"""
    create_tables()
    populate_sample_data()
    # Update with the specified container data
    update_sample_data()

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    """Custom Swagger UI endpoint"""
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - API Documentation",
        swagger_favicon_url="",
    )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "app": "Vertical Farming Control Panel API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs"
    }