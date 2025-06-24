"""Custom exception classes and global exception handlers."""

import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from pydantic import ValidationError

logger = logging.getLogger(__name__)


class ContainerManagementException(Exception):
    """Base exception for container management application."""

    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


class ResourceNotFoundError(ContainerManagementException):
    """Raised when a requested resource is not found."""

    def __init__(self, resource_type: str, resource_id: str):
        message = f"{resource_type} with ID {resource_id} not found"
        super().__init__(message, "RESOURCE_NOT_FOUND")
        self.resource_type = resource_type
        self.resource_id = resource_id


class ResourceConflictError(ContainerManagementException):
    """Raised when a resource conflict occurs."""

    def __init__(self, resource_type: str, conflict_reason: str):
        message = f"{resource_type} conflict: {conflict_reason}"
        super().__init__(message, "RESOURCE_CONFLICT")
        self.resource_type = resource_type
        self.conflict_reason = conflict_reason


class CustomValidationError(ContainerManagementException):
    """Raised when validation fails."""

    def __init__(self, field: str, value: str, reason: str):
        message = f"Validation failed for {field}='{value}': {reason}"
        super().__init__(message, "VALIDATION_ERROR")
        self.field = field
        self.value = value
        self.reason = reason


class InventoryError(ContainerManagementException):
    """Raised when inventory operations fail."""

    def __init__(self, operation: str, reason: str):
        message = f"Inventory operation '{operation}' failed: {reason}"
        super().__init__(message, "INVENTORY_ERROR")
        self.operation = operation
        self.reason = reason


class TrayError(InventoryError):
    """Raised when tray operations fail."""

    def __init__(self, tray_id: str, operation: str, reason: str):
        message = f"Tray '{tray_id}' operation '{operation}' failed: {reason}"
        super().__init__(operation, reason)
        self.tray_id = tray_id


class PanelError(InventoryError):
    """Raised when panel operations fail."""

    def __init__(self, panel_id: str, operation: str, reason: str):
        message = f"Panel '{panel_id}' operation '{operation}' failed: {reason}"
        super().__init__(operation, reason)
        self.panel_id = panel_id


class CropLocationError(InventoryError):
    """Raised when crop location operations fail."""

    def __init__(self, location_type: str, operation: str, reason: str):
        message = f"Crop location '{location_type}' operation '{operation}' failed: {reason}"
        super().__init__(operation, reason)
        self.location_type = location_type


async def container_management_exception_handler(
    request: Request, exc: ContainerManagementException
) -> JSONResponse:
    """Handle custom application exceptions."""
    logger.error("Application error: %s", exc.message)

    return JSONResponse(
        status_code=400,
        content={
            "error": exc.error_code or "APPLICATION_ERROR",
            "message": exc.message,
            "path": str(request.url),
        }
    )


async def resource_not_found_exception_handler(
    request: Request, exc: ResourceNotFoundError
) -> JSONResponse:
    """Handle resource not found exceptions."""
    logger.warning("Resource not found: %s", exc.message)

    return JSONResponse(
        status_code=404,
        content={
            "error": "RESOURCE_NOT_FOUND",
            "message": exc.message,
            "resource_type": exc.resource_type,
            "resource_id": exc.resource_id,
            "path": str(request.url),
        }
    )


async def resource_conflict_exception_handler(
    request: Request, exc: ResourceConflictError
) -> JSONResponse:
    """Handle resource conflict exceptions."""
    logger.warning("Resource conflict: %s", exc.message)

    return JSONResponse(
        status_code=409,
        content={
            "error": "RESOURCE_CONFLICT",
            "message": exc.message,
            "resource_type": exc.resource_type,
            "conflict_reason": exc.conflict_reason,
            "path": str(request.url),
        }
    )


async def validation_exception_handler(
    request: Request, exc: CustomValidationError
) -> JSONResponse:
    """Handle validation exceptions."""
    logger.warning("Validation error: %s", exc.message)

    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": exc.message,
            "field": exc.field,
            "value": exc.value,
            "reason": exc.reason,
            "path": str(request.url),
        }
    )


async def integrity_error_handler(
    request: Request, exc: IntegrityError
) -> JSONResponse:
    """Handle database integrity errors."""
    logger.error("Database integrity error: %s", str(exc.orig))

    # Parse common integrity errors
    error_message = str(exc.orig)
    if "foreign key constraint" in error_message.lower():
        message = "Referenced resource does not exist"
        error_code = "FOREIGN_KEY_VIOLATION"
    elif "unique constraint" in error_message.lower():
        message = "Resource with this identifier already exists"
        error_code = "UNIQUE_CONSTRAINT_VIOLATION"
    elif "not null constraint" in error_message.lower():
        message = "Required field cannot be null"
        error_code = "NOT_NULL_VIOLATION"
    else:
        message = "Database constraint violation"
        error_code = "INTEGRITY_ERROR"

    return JSONResponse(
        status_code=400,
        content={
            "error": error_code,
            "message": message,
            "path": str(request.url),
        }
    )


async def sqlalchemy_error_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    """Handle general SQLAlchemy errors."""
    logger.error("Database error: %s", str(exc))

    return JSONResponse(
        status_code=500,
        content={
            "error": "DATABASE_ERROR",
            "message": "An error occurred while processing your request",
            "path": str(request.url),
        }
    )


async def inventory_error_handler(
    request: Request, exc: InventoryError
) -> JSONResponse:
    """Handle inventory operation errors."""
    logger.error("Inventory error: %s", exc.message)

    return JSONResponse(
        status_code=400,
        content={
            "error": "INVENTORY_ERROR",
            "message": exc.message,
            "operation": exc.operation,
            "reason": exc.reason,
            "path": str(request.url),
        }
    )


async def tray_error_handler(
    request: Request, exc: TrayError
) -> JSONResponse:
    """Handle tray operation errors."""
    logger.error("Tray error: %s", exc.message)

    return JSONResponse(
        status_code=400,
        content={
            "error": "TRAY_ERROR",
            "message": exc.message,
            "tray_id": exc.tray_id,
            "operation": exc.operation,
            "reason": exc.reason,
            "path": str(request.url),
        }
    )


async def panel_error_handler(
    request: Request, exc: PanelError
) -> JSONResponse:
    """Handle panel operation errors."""
    logger.error("Panel error: %s", exc.message)

    return JSONResponse(
        status_code=400,
        content={
            "error": "PANEL_ERROR",
            "message": exc.message,
            "panel_id": exc.panel_id,
            "operation": exc.operation,
            "reason": exc.reason,
            "path": str(request.url),
        }
    )


async def crop_location_error_handler(
    request: Request, exc: CropLocationError
) -> JSONResponse:
    """Handle crop location operation errors."""
    logger.error("Crop location error: %s", exc.message)

    return JSONResponse(
        status_code=400,
        content={
            "error": "CROP_LOCATION_ERROR",
            "message": exc.message,
            "location_type": exc.location_type,
            "operation": exc.operation,
            "reason": exc.reason,
            "path": str(request.url),
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected exceptions."""
    logger.exception("Unexpected error: %s", str(exc))

    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "path": str(request.url),
        }
    )
