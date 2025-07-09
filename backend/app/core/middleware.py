"""Middleware for the FastAPI application."""

import time
import logging
import traceback
from typing import Callable
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.exceptions import BaseCustomException
from app.core.constants import ErrorMessages

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request and log information."""
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url}")
        
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"Response: {response.status_code} - "
                f"Time: {process_time:.3f}s - "
                f"IP: {client_ip}"
            )
            
            # Add processing time header
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Error processing request: {request.method} {request.url} - "
                f"Time: {process_time:.3f}s - "
                f"IP: {client_ip} - "
                f"Error: {str(e)}"
            )
            raise


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware for handling errors globally."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request and handle errors."""
        try:
            return await call_next(request)
        
        except BaseCustomException as e:
            # Handle custom exceptions
            logger.error(f"Custom exception: {e.message} - Details: {e.details}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": e.message,
                    "details": e.details,
                    "status_code": e.status_code
                }
            )
        
        except HTTPException as e:
            # Handle FastAPI HTTP exceptions
            logger.error(f"HTTP exception: {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": e.detail,
                    "status_code": e.status_code
                }
            )
        
        except SQLAlchemyError as e:
            # Handle database errors
            logger.error(f"Database error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": ErrorMessages.DATABASE_OPERATION_ERROR,
                    "details": {"type": "database_error"},
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
                }
            )
        
        except ValueError as e:
            # Handle validation errors
            logger.error(f"Validation error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": ErrorMessages.VALIDATION_ERROR,
                    "details": {"message": str(e)},
                    "status_code": status.HTTP_400_BAD_REQUEST
                }
            )
        
        except Exception as e:
            # Handle unexpected errors
            logger.error(f"Unexpected error: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": ErrorMessages.INTERNAL_SERVER_ERROR,
                    "details": {"type": "unexpected_error"},
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
                }
            )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware for adding security headers."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Add security headers to responses."""
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Remove server header
        if "Server" in response.headers:
            del response.headers["Server"]
        
        return response


def setup_middleware(app: FastAPI) -> None:
    """Set up all middleware for the FastAPI application."""
    
    # CORS middleware - Allow all origins for development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for development
        allow_credentials=False,  # Set to False when using allow_origins=["*"]
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
    )
    
    # Trusted host middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0", settings.SERVER_NAME, "testserver", "test"]
    )
    
    # Custom middleware (order matters - last added is executed first)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(ErrorHandlingMiddleware)
    app.add_middleware(LoggingMiddleware)


class RateLimitingMiddleware(BaseHTTPMiddleware):
    """Simple rate limiting middleware."""

    def __init__(self, app: FastAPI, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = {}

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Apply rate limiting based on client IP."""
        client_ip = request.client.host if request.client else "unknown"
        
        current_time = time.time()
        
        # Clean old entries
        self.clients = {
            ip: calls for ip, calls in self.clients.items()
            if any(call_time > current_time - self.period for call_time in calls)
        }
        
        # Check rate limit
        if client_ip in self.clients:
            # Filter calls within the time window
            recent_calls = [
                call_time for call_time in self.clients[client_ip]
                if call_time > current_time - self.period
            ]
            
            if len(recent_calls) >= self.calls:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "Rate limit exceeded",
                        "details": {
                            "limit": self.calls,
                            "period": self.period,
                            "retry_after": self.period
                        },
                        "status_code": status.HTTP_429_TOO_MANY_REQUESTS
                    },
                    headers={"Retry-After": str(self.period)}
                )
            
            self.clients[client_ip] = recent_calls + [current_time]
        else:
            self.clients[client_ip] = [current_time]
        
        return await call_next(request)


def setup_rate_limiting(app: FastAPI, enabled: bool = False) -> None:
    """Set up rate limiting middleware if enabled."""
    if enabled:
        app.add_middleware(RateLimitingMiddleware, calls=100, period=60)
        logger.info("Rate limiting middleware enabled: 100 calls per minute")


class HealthCheckMiddleware(BaseHTTPMiddleware):
    """Middleware for health check endpoints."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Handle health check requests."""
        if request.url.path in ["/health", "/ping", "/status"]:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "healthy",
                    "timestamp": time.time(),
                    "version": "1.0.0"
                }
            )
        
        return await call_next(request)