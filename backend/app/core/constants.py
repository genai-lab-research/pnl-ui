"""Application constants including error messages."""


class ErrorMessages:
    """Error message constants to avoid string duplication."""
    
    # Generic errors
    INTERNAL_SERVER_ERROR = "Internal server error"
    VALIDATION_ERROR = "Validation error"
    RESOURCE_NOT_FOUND = "Resource not found"
    RESOURCE_ALREADY_EXISTS = "Resource already exists"
    UNAUTHORIZED = "Unauthorized access"
    FORBIDDEN = "Forbidden access"
    BAD_REQUEST = "Bad request"
    
    # Authentication errors
    INVALID_CREDENTIALS = "Invalid authentication credentials"
    TOKEN_EXPIRED = "Token has expired"
    TOKEN_INVALID = "Invalid token"
    USER_NOT_FOUND = "User not found"
    INSUFFICIENT_PERMISSIONS = "Insufficient permissions"
    
    # Container-specific errors
    CONTAINER_NOT_FOUND = "Container not found"
    CONTAINER_ALREADY_EXISTS = "Container with this name already exists"
    CONTAINER_INVALID_TYPE = "Invalid container type"
    CONTAINER_INVALID_STATUS = "Invalid container status"
    CONTAINER_INVALID_PURPOSE = "Invalid container purpose"
    CONTAINER_SHUTDOWN_FAILED = "Failed to shutdown container"
    CONTAINER_PHYSICAL_LOCATION_REQUIRED = "Physical containers must have a location"
    
    # Seed type errors
    SEED_TYPE_NOT_FOUND = "Seed type not found"
    SEED_TYPE_ALREADY_EXISTS = "Seed type already exists"
    
    # Alert errors
    ALERT_NOT_FOUND = "Alert not found"
    ALERT_ALREADY_RESOLVED = "Alert is already resolved"
    
    # Metrics errors
    METRICS_CALCULATION_ERROR = "Error calculating metrics"
    METRICS_INVALID_TIME_RANGE = "Invalid time range for metrics"
    
    # Validation errors
    INVALID_EMAIL = "Invalid email address"
    INVALID_PASSWORD = "Password must be at least 8 characters"
    INVALID_PAGINATION = "Invalid pagination parameters"
    INVALID_SORT_FIELD = "Invalid sort field"
    INVALID_FILTER_VALUE = "Invalid filter value"
    
    # Database errors
    DATABASE_CONNECTION_ERROR = "Database connection error"
    DATABASE_OPERATION_ERROR = "Database operation failed"
    DATABASE_CONSTRAINT_ERROR = "Database constraint violation"


class StatusMessages:
    """Success status message constants."""
    
    # Generic success messages
    OPERATION_SUCCESSFUL = "Operation completed successfully"
    RESOURCE_CREATED = "Resource created successfully"
    RESOURCE_UPDATED = "Resource updated successfully"
    RESOURCE_DELETED = "Resource deleted successfully"
    
    # Container-specific success messages
    CONTAINER_CREATED = "Container created successfully"
    CONTAINER_UPDATED = "Container updated successfully"
    CONTAINER_DELETED = "Container deleted successfully"
    CONTAINER_SHUTDOWN = "Container shutdown successfully"
    
    # Authentication success messages
    LOGIN_SUCCESSFUL = "Login successful"
    LOGOUT_SUCCESSFUL = "Logout successful"
    TOKEN_REFRESHED = "Token refreshed successfully"


class ValidationConstraints:
    """Validation constraint constants."""
    
    # String length constraints
    MAX_NAME_LENGTH = 100
    MAX_DESCRIPTION_LENGTH = 1000
    MAX_NOTES_LENGTH = 1000
    MIN_PASSWORD_LENGTH = 8
    
    # Numeric constraints
    MIN_TEMPERATURE = -50.0
    MAX_TEMPERATURE = 60.0
    MIN_HUMIDITY = 0.0
    MAX_HUMIDITY = 100.0
    MIN_CO2 = 0.0
    MAX_CO2 = 5000.0
    MIN_UTILIZATION = 0.0
    MAX_UTILIZATION = 100.0
    
    # Pagination constraints
    MAX_PAGE_SIZE = 100
    DEFAULT_PAGE_SIZE = 10
    MIN_PAGE_SIZE = 1


class DefaultValues:
    """Default value constants."""
    
    # Container defaults
    DEFAULT_CONTAINER_STATUS = "created"
    DEFAULT_CONTAINER_TYPE = "physical"
    DEFAULT_CONTAINER_PURPOSE = "development"
    
    # Pagination defaults
    DEFAULT_PAGE = 1
    DEFAULT_LIMIT = 10
    DEFAULT_SORT_FIELD = "created_at"
    DEFAULT_SORT_ORDER = "desc"
    
    # Metrics defaults
    DEFAULT_TIME_RANGE = "week"
    DEFAULT_CONTAINER_TYPE_FILTER = "all"
    
    # Environment defaults
    DEFAULT_AIR_TEMPERATURE = 22.0
    DEFAULT_HUMIDITY = 65.0
    DEFAULT_CO2 = 400.0


class AppConstants:
    """General application constants."""
    
    # API versioning
    API_VERSION = "v1"
    API_PREFIX = f"/api/{API_VERSION}"
    
    # Time formats
    ISO_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"
    DATE_FORMAT = "%Y-%m-%d"
    
    # Container types
    CONTAINER_TYPES = ["physical", "virtual"]
    
    # Container statuses
    CONTAINER_STATUSES = ["created", "active", "maintenance", "inactive"]
    
    # Container purposes
    CONTAINER_PURPOSES = ["development", "research", "production"]
    
    # Alert severities
    ALERT_SEVERITIES = ["low", "medium", "high", "critical"]
    
    # Time ranges for metrics
    TIME_RANGES = ["week", "month", "quarter", "year"]
    
    # Sort orders
    SORT_ORDERS = ["asc", "desc"]
    
    # Pagination limits
    PAGINATION_LIMITS = [10, 25, 50, 100]