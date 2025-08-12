"""Application entry point for the Container Management Dashboard API."""

import uvicorn
import logging
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def run_development():
    """Run the application in development mode."""
    logger.info("Starting Container Management Dashboard API in development mode...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True
    )


def run_production():
    """Run the application in production mode."""
    logger.info("Starting Container Management Dashboard API in production mode...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="warning",
        access_log=False,
        workers=4
    )


if __name__ == "__main__":
    import sys
    
    # Check if production mode is specified
    if len(sys.argv) > 1 and sys.argv[1] == "production":
        run_production()
    else:
        run_development()