"""Logging configuration for the application."""

import logging
import sys
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        # Log request
        logger = logging.getLogger("api")
        client_ip = request.client.host if request.client else "unknown"

        logger.info(
            "Request started: %s %s from %s",
            request.method, request.url.path, client_ip
        )

        # Process request
        try:
            response = await call_next(request)
        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(
                "Request failed: %s %s in %.4fs - %s",
                request.method, request.url.path, process_time, str(exc)
            )
            raise

        # Log response
        process_time = time.time() - start_time
        logger.info(
            "Request completed: %s %s - %s in %.4fs",
            request.method, request.url.path, response.status_code, process_time
        )

        # Add response time header
        response.headers["X-Process-Time"] = str(process_time)

        return response


def setup_logging(log_level: str = "INFO") -> None:
    """Set up logging configuration."""

    # Create formatter
    simple_formatter = logging.Formatter(
        "%(levelname)s: %(message)s"
    )

    # Create handlers
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(simple_formatter)

    # Configure loggers
    loggers = [
        "app",           # Application logger
        "api",           # API request logger
        "sqlalchemy",    # SQLAlchemy logger
        "uvicorn",       # Uvicorn logger
    ]

    for logger_name in loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(getattr(logging, log_level.upper()))
        logger.addHandler(console_handler)
        logger.propagate = False

    # Special configuration for SQLAlchemy
    sqlalchemy_logger = logging.getLogger("sqlalchemy.engine")
    sqlalchemy_logger.setLevel(logging.WARNING)  # Reduce SQL query noise

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))

    logging.info("Logging configuration completed")
