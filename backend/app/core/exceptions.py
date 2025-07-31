"""Custom exceptions for the application."""

from typing import Any, Dict, Optional


class BaseCustomException(Exception):
    """Base exception class for custom exceptions."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(BaseCustomException):
    """Exception raised for validation errors."""

    def __init__(
        self,
        message: str = "Validation error",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 400, details)


class AuthenticationException(BaseCustomException):
    """Exception raised for authentication errors."""

    def __init__(
        self,
        message: str = "Authentication failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 401, details)


class AuthorizationException(BaseCustomException):
    """Exception raised for authorization errors."""

    def __init__(
        self,
        message: str = "Insufficient permissions",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 403, details)


class NotFoundException(BaseCustomException):
    """Exception raised when a resource is not found."""

    def __init__(
        self,
        message: str = "Resource not found",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 404, details)


class ConflictException(BaseCustomException):
    """Exception raised for resource conflicts."""

    def __init__(
        self,
        message: str = "Resource conflict",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 409, details)


class BusinessLogicException(BaseCustomException):
    """Exception raised for business logic errors."""

    def __init__(
        self,
        message: str = "Business logic error",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 422, details)


class DatabaseException(BaseCustomException):
    """Exception raised for database errors."""

    def __init__(
        self,
        message: str = "Database operation failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 500, details)


class ExternalServiceException(BaseCustomException):
    """Exception raised for external service errors."""

    def __init__(
        self,
        message: str = "External service error",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 503, details)


# Container-specific exceptions
class ContainerNotFoundException(NotFoundException):
    """Exception raised when a container is not found."""

    def __init__(
        self,
        container_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Container {container_id} not found" if container_id else "Container not found"
        super().__init__(message, details)


class ContainerAlreadyExistsException(ConflictException):
    """Exception raised when trying to create a container that already exists."""

    def __init__(
        self,
        container_name: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Container '{container_name}' already exists" if container_name else "Container already exists"
        super().__init__(message, details)


class ContainerValidationException(ValidationException):
    """Exception raised for container validation errors."""

    def __init__(
        self,
        field: Optional[str] = None,
        value: Optional[Any] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if field and value is not None:
            message = f"Invalid value '{value}' for field '{field}'"
        else:
            message = "Container validation failed"
        super().__init__(message, details)


class ContainerShutdownException(BusinessLogicException):
    """Exception raised when container shutdown fails."""

    def __init__(
        self,
        container_id: Optional[int] = None,
        reason: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Failed to shutdown container {container_id}"
        if reason:
            message += f": {reason}"
        super().__init__(message, details)


# Metrics-specific exceptions
class MetricsCalculationException(BaseCustomException):
    """Exception raised when metrics calculation fails."""

    def __init__(
        self,
        message: str = "Metrics calculation failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, 500, details)


class InvalidTimeRangeException(ValidationException):
    """Exception raised for invalid time range parameters."""

    def __init__(
        self,
        time_range: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Invalid time range '{time_range}'" if time_range else "Invalid time range"
        super().__init__(message, details)


# Authentication-specific exceptions
class InvalidTokenException(AuthenticationException):
    """Exception raised for invalid tokens."""

    def __init__(
        self,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__("Invalid or expired token", details)


class InsufficientPermissionsException(AuthorizationException):
    """Exception raised for insufficient permissions."""

    def __init__(
        self,
        required_permission: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Insufficient permissions. Required: {required_permission}" if required_permission else "Insufficient permissions"
        super().__init__(message, details)


# Seed type-specific exceptions
class SeedTypeNotFoundException(NotFoundException):
    """Exception raised when a seed type is not found."""

    def __init__(
        self,
        seed_type_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Seed type {seed_type_id} not found" if seed_type_id else "Seed type not found"
        super().__init__(message, details)


class SeedTypeAlreadyExistsException(ConflictException):
    """Exception raised when trying to create a seed type that already exists."""

    def __init__(
        self,
        seed_type_name: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Seed type '{seed_type_name}' already exists" if seed_type_name else "Seed type already exists"
        super().__init__(message, details)


# Alert-specific exceptions
class AlertNotFoundException(NotFoundException):
    """Exception raised when an alert is not found."""

    def __init__(
        self,
        alert_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Alert {alert_id} not found" if alert_id else "Alert not found"
        super().__init__(message, details)


class AlertAlreadyResolvedException(BusinessLogicException):
    """Exception raised when trying to resolve an already resolved alert."""

    def __init__(
        self,
        alert_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Alert {alert_id} is already resolved" if alert_id else "Alert is already resolved"
        super().__init__(message, details)


# Device-specific exceptions
class DeviceNotFoundError(NotFoundException):
    """Exception raised when a device is not found."""

    def __init__(
        self,
        device_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Device {device_id} not found" if device_id else "Device not found"
        super().__init__(message, details)


class DeviceAlreadyExistsError(ConflictException):
    """Exception raised when trying to create a device that already exists."""

    def __init__(
        self,
        serial_number: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Device with serial number '{serial_number}' already exists" if serial_number else "Device already exists"
        super().__init__(message, details)


class DeviceValidationError(ValidationException):
    """Exception raised for device validation errors."""

    def __init__(
        self,
        field: Optional[str] = None,
        value: Optional[Any] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if field and value is not None:
            message = f"Invalid value '{value}' for field '{field}'"
        else:
            message = "Device validation failed"
        super().__init__(message, details)


class DeviceOperationError(BusinessLogicException):
    """Exception raised when device operation fails."""

    def __init__(
        self,
        operation: str,
        device_id: Optional[int] = None,
        reason: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Device operation '{operation}' failed"
        if device_id:
            message += f" for device {device_id}"
        if reason:
            message += f": {reason}"
        super().__init__(message, details)


# Additional alert exceptions
class AlertNotFoundError(NotFoundException):
    """Exception raised when an alert is not found."""

    def __init__(
        self,
        alert_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Alert {alert_id} not found" if alert_id else "Alert not found"
        super().__init__(message, details)


class ContainerNotFoundError(NotFoundException):
    """Exception raised when a container is not found."""

    def __init__(
        self,
        container_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Container {container_id} not found" if container_id else "Container not found"
        super().__init__(message, details)