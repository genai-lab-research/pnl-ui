from enum import Enum, auto

class ContainerType(str, Enum):
    PHYSICAL = "Physical"
    VIRTUAL = "Virtual"

class ContainerPurpose(str, Enum):
    DEVELOPMENT = "Development"
    RESEARCH = "Research"
    PRODUCTION = "Production"

class ContainerStatus(str, Enum):
    CREATED = "Created"
    ACTIVE = "Active"
    MAINTENANCE = "Maintenance"
    INACTIVE = "Inactive"

class AlertSeverity(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class DeviceStatus(str, Enum):
    RUNNING = "Running"
    IDLE = "Idle"
    ISSUE = "Issue"
    OFFLINE = "Offline"

class ShelfPosition(str, Enum):
    UPPER = "Upper"
    LOWER = "Lower"

class WallPosition(str, Enum):
    WALL_1 = "Wall 1"
    WALL_2 = "Wall 2"
    WALL_3 = "Wall 3"
    WALL_4 = "Wall 4"

class CropLifecycleStatus(str, Enum):
    SEEDED = "Seeded"
    TRANSPLANTED = "Transplanted"
    HARVESTED = "Harvested"
    DISPOSED = "Disposed"

class CropHealthCheck(str, Enum):
    HEALTHY = "Healthy"
    TREATMENT_REQUIRED = "Treatment Required"
    TO_BE_DISPOSED = "To be Disposed"

class LocationType(str, Enum):
    TRAY = "Tray"
    PANEL = "Panel"

class AlertRelatedObjectType(str, Enum):
    DEVICE = "Device"
    CROP = "Crop"
    TRAY = "Tray"
    PANEL = "Panel"
    CONTAINER = "Container"
    ENVIRONMENT = "Environment"

class InventoryStatus(str, Enum):
    AVAILABLE = "Available"
    IN_USE = "In Use"
    MAINTENANCE = "Maintenance"
    DISPOSED = "Disposed"

class FAEnvironment(str, Enum):
    ALPHA = "Alpha"
    PROD = "Prod"

class PYAEnvironment(str, Enum):
    DEV = "Dev"
    TEST = "Test"
    STAGE = "Stage"

class AWSEnvironment(str, Enum):
    DEV = "Dev"
    PROD = "Prod"

class MBAIEnvironment(str, Enum):
    PROD = "Prod"

class FHEnvironment(str, Enum):
    PROD = "Prod"

class CropLocationType(str, Enum):
    TRAY_LOCATION = "TrayLocation"
    PANEL_LOCATION = "PanelLocation"

class ActorType(str, Enum):
    USER = "User"
    SYSTEM = "System"

class MetricTimeRange(str, Enum):
    WEEK = "WEEK"
    MONTH = "MONTH"
    QUARTER = "QUARTER"
    YEAR = "YEAR"