import uuid
from datetime import datetime, timezone
from enum import Enum

from pydantic import EmailStr
from sqlmodel import JSON, Column, Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# Tenant Model
class TenantBase(SQLModel):
    name: str = Field(max_length=255)


class TenantCreate(TenantBase):
    pass


class Tenant(TenantBase, table=True):
    id: str = Field(primary_key=True, max_length=50)


class TenantResponse(TenantBase):
    id: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Container Domain Models


class ContainerType(str, Enum):
    PHYSICAL = "PHYSICAL"
    VIRTUAL = "VIRTUAL"


class ContainerStatus(str, Enum):
    CREATED = "CREATED"
    ACTIVE = "ACTIVE"
    MAINTENANCE = "MAINTENANCE"
    INACTIVE = "INACTIVE"


class ContainerPurpose(str, Enum):
    DEVELOPMENT = "Development"
    RESEARCH = "Research"
    PRODUCTION = "Production"


class TimeRange(str, Enum):
    WEEK = "WEEK"
    MONTH = "MONTH"
    QUARTER = "QUARTER"
    YEAR = "YEAR"


class ActivityType(str, Enum):
    SEEDED = "SEEDED"
    SYNCED = "SYNCED"
    ENVIRONMENT_CHANGED = "ENVIRONMENT_CHANGED"
    CREATED = "CREATED"
    MAINTENANCE = "MAINTENANCE"


# Container Location
class ContainerLocation(SQLModel):
    city: str
    country: str
    address: str


# System Integrations
class SystemIntegration(SQLModel):
    name: str
    enabled: bool


class SystemIntegrations(SQLModel):
    fa_integration: SystemIntegration
    aws_environment: SystemIntegration
    mbai_environment: SystemIntegration


# Container Base Model
class ContainerBase(SQLModel):
    name: str = Field(max_length=255)
    type: ContainerType
    tenant: str = Field(max_length=255)
    purpose: ContainerPurpose
    location: ContainerLocation
    status: ContainerStatus
    creator: str = Field(max_length=255)
    seed_types: list[str] = Field(default_factory=list)
    notes: str = Field(default="", max_length=1000)
    shadow_service_enabled: bool = Field(default=False)
    ecosystem_connected: bool = Field(default=False)
    system_integrations: SystemIntegrations


# Container Form Data Model (for page2 create form)
class ContainerFormData(SQLModel):
    name: str = Field(max_length=255)
    tenant: str = Field(max_length=255)
    type: ContainerType
    purpose: ContainerPurpose
    seed_types: list[str] = Field(default_factory=list)
    location: str = Field(max_length=255)
    notes: str | None = Field(default="", max_length=1000)
    shadow_service_enabled: bool = Field(default=False)
    connect_to_other_systems: bool = Field(default=False)


# Container Create Model (enhanced for page2)
class ContainerCreate(ContainerBase):
    pass


# Container Create from Form Data (page2 specific)
class ContainerCreateFromForm(ContainerFormData):
    pass


# Container Update Model
class ContainerUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    type: ContainerType | None = None
    tenant: str | None = Field(default=None, max_length=255)
    purpose: ContainerPurpose | None = None
    location: ContainerLocation | None = None
    status: ContainerStatus | None = None
    creator: str | None = Field(default=None, max_length=255)
    seed_types: list[str] | None = None
    notes: str | None = Field(default=None, max_length=1000)
    shadow_service_enabled: bool | None = None
    ecosystem_connected: bool | None = None
    system_integrations: SystemIntegrations | None = None


# Container Database Model
class Container(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=50)
    name: str = Field(max_length=255)
    type: ContainerType
    tenant: str = Field(max_length=255)
    purpose: ContainerPurpose
    location: dict = Field(sa_column=Column(JSON))
    status: ContainerStatus
    creator: str = Field(max_length=255)
    seed_types: list[str] = Field(sa_column=Column(JSON), default_factory=list)
    notes: str = Field(default="", max_length=1000)
    shadow_service_enabled: bool = Field(default=False)
    ecosystem_connected: bool = Field(default=False)
    system_integrations: dict = Field(sa_column=Column(JSON))
    created: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    modified: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    metrics: list["ContainerMetrics"] = Relationship(
        back_populates="container", cascade_delete=True
    )
    crops: list["ContainerCrop"] = Relationship(
        back_populates="container", cascade_delete=True
    )
    activities: list["ContainerActivity"] = Relationship(
        back_populates="container", cascade_delete=True
    )


# Container Public Model
class ContainerPublic(ContainerBase):
    id: str
    created: datetime
    modified: datetime


# Container Response (for page2 create response)
class ContainerResponse(SQLModel):
    id: str
    name: str
    type: ContainerType
    tenant_name: str
    purpose: ContainerPurpose
    location_city: str | None = None
    location_country: str | None = None
    status: ContainerStatus
    created_at: datetime
    updated_at: datetime
    has_alerts: bool = False
    shadow_service_enabled: bool = False
    ecosystem_connected: bool = False


# Container Summary Model (for list view)
class ContainerSummary(SQLModel):
    id: str
    name: str
    type: ContainerType
    tenant_name: str
    purpose: ContainerPurpose
    location_city: str | None = None
    location_country: str | None = None
    status: ContainerStatus
    created_at: datetime
    updated_at: datetime
    has_alerts: bool = False


# Container List Model
class ContainerList(SQLModel):
    total: int
    results: list[ContainerSummary]


# Container Stats Model
class ContainerStats(SQLModel):
    physical_count: int
    virtual_count: int


# Container List Model (backward compatibility)
class ContainersPublic(SQLModel):
    data: list[ContainerPublic]
    count: int


# Metrics Models


class MetricValue(SQLModel):
    current: float
    unit: str
    target: float | None = None
    trend: float | None = None
    target_display: str | None = (
        None  # For formatted display like "+1.5Kg" or "800-900ppm"
    )


class ContainerMetricsBase(SQLModel):
    container_id: str = Field(foreign_key="container.id", max_length=50)
    time_range: TimeRange
    temperature: MetricValue
    humidity: MetricValue
    co2: MetricValue
    yield_metric: MetricValue = Field(alias="yield")
    nursery_utilization: MetricValue
    cultivation_utilization: MetricValue


class ContainerMetricsCreate(ContainerMetricsBase):
    pass


class ContainerMetrics(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    container_id: str = Field(foreign_key="container.id", max_length=50)
    time_range: TimeRange
    temperature: dict = Field(sa_column=Column(JSON))
    humidity: dict = Field(sa_column=Column(JSON))
    co2: dict = Field(sa_column=Column(JSON))
    yield_metric: dict = Field(sa_column=Column(JSON), alias="yield")
    nursery_utilization: dict = Field(sa_column=Column(JSON))
    cultivation_utilization: dict = Field(sa_column=Column(JSON))
    created: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    container: Container = Relationship(back_populates="metrics")


class ContainerMetricsPublic(SQLModel):
    model_config = {"populate_by_name": True}

    temperature: MetricValue
    humidity: MetricValue
    co2: MetricValue
    yield_value: MetricValue = Field(alias="yield")
    nursery_utilization: MetricValue
    cultivation_utilization: MetricValue


# Crops Models


class ContainerCropBase(SQLModel):
    container_id: str = Field(foreign_key="container.id", max_length=50)
    seed_type: str = Field(max_length=255)
    cultivation_area: float
    nursery_table: float
    last_sd: str | None = None  # Last seeding date
    last_td: str | None = None  # Last transplanting date
    last_hd: str | None = None  # Last harvest date
    avg_age: float
    overdue: int


class ContainerCropCreate(ContainerCropBase):
    pass


class ContainerCrop(ContainerCropBase, table=True):
    id: str = Field(primary_key=True, max_length=50)

    # Relationships
    container: Container = Relationship(back_populates="crops")


class ContainerCropPublic(ContainerCropBase):
    id: str


class ContainerCropsPublic(SQLModel):
    total: int
    results: list[ContainerCropPublic]


# Seed Type Models


class SeedTypeBase(SQLModel):
    name: str = Field(max_length=255)
    variety: str = Field(max_length=255)
    supplier: str = Field(max_length=255)


class SeedTypeCreate(SeedTypeBase):
    pass


class SeedType(SeedTypeBase, table=True):
    id: str = Field(primary_key=True, max_length=50)


class SeedTypePublic(SeedTypeBase):
    id: str


class SeedTypesPublic(SQLModel):
    data: list[SeedTypePublic]
    count: int


# Activity Models


class ActivityUser(SQLModel):
    name: str
    role: str


class ContainerActivityBase(SQLModel):
    container_id: str = Field(foreign_key="container.id", max_length=50)
    type: ActivityType
    description: str = Field(max_length=500)
    user: ActivityUser
    details: dict = Field(default_factory=dict)


class ContainerActivityCreate(ContainerActivityBase):
    pass


class ContainerActivity(SQLModel, table=True):
    id: str = Field(primary_key=True, max_length=50)
    container_id: str = Field(foreign_key="container.id", max_length=50)
    type: ActivityType
    description: str = Field(max_length=500)
    user: dict = Field(sa_column=Column(JSON))
    details: dict = Field(sa_column=Column(JSON), default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    container: Container = Relationship(back_populates="activities")


class ContainerActivityPublic(ContainerActivityBase):
    id: str
    timestamp: datetime


class ContainerActivitiesPublic(SQLModel):
    activities: list[ContainerActivityPublic]


# Inventory Models for Page 4

class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    MODERATE = "moderate"
    CRITICAL = "critical"
    TREATMENT_REQUIRED = "treatment_required"


class CropSize(str, Enum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class UtilizationLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    MEDIUM = "medium"
    HIGH = "high"


class ShelfType(str, Enum):
    TOP = "top"
    BOTTOM = "bottom"
    UPPER = "upper"
    LOWER = "lower"


class WallType(str, Enum):
    LEFT = "left"
    RIGHT = "right"
    WALL_1 = "wall_1"
    WALL_2 = "wall_2"


class SlotData(SQLModel):
    slot_number: int
    occupied: bool
    tray: "TrayDataPublic | None" = None


class ShelfData(SQLModel):
    slots: list[SlotData]


class TrayData(SQLModel):
    id: str
    container_id: str
    utilization_percentage: int
    crop_count: int
    utilization_level: UtilizationLevel
    rfid_tag: str
    shelf: ShelfType | None
    slot_number: int | None
    is_on_shelf: bool
    created: datetime


class CropData(SQLModel):
    id: str
    container_id: str
    tray_id: str | None
    panel_id: str | None
    seed_type: str
    row: int | None = None
    column: int | None = None
    channel: int | None = None
    position: int | None = None
    age_days: int
    seeded_date: str
    planned_transplanting_date: str | None = None
    transplanted_date: str | None = None
    planned_harvesting_date: str | None = None
    overdue_days: int | None = None
    health_status: HealthStatus
    size: CropSize
    created: datetime


class CropDataPublic(SQLModel):
    id: str
    container_id: str
    tray_id: str | None
    panel_id: str | None
    seed_type: str
    row: int | None = None
    column: int | None = None
    channel: int | None = None
    position: int | None = None
    age_days: int
    seeded_date: str
    planned_transplanting_date: str | None = None
    transplanted_date: str | None = None
    planned_harvesting_date: str | None = None
    overdue_days: int | None = None
    health_status: HealthStatus
    size: CropSize
    created: datetime


class TrayDataCreate(SQLModel):
    shelf_id: str
    position: str
    label: str


class TrayDataPublic(SQLModel):
    id: str
    utilization_percentage: int
    crop_count: int
    utilization_level: UtilizationLevel
    rfid_tag: str
    shelf: ShelfType | None
    slot_number: int | None
    is_on_shelf: bool
    crops: list[CropDataPublic]


class TrayResponse(SQLModel):
    tray: TrayDataPublic
    message: str


class ChannelData(SQLModel):
    id: str
    panel_id: str
    crop_id: str | None
    position: int


class PanelChannelData(SQLModel):
    channel_number: int
    crops: list[CropDataPublic]


class WallData(SQLModel):
    id: str
    type: WallType
    channels: list[ChannelData]


class PanelData(SQLModel):
    id: str
    container_id: str
    utilization_percentage: int
    crop_count: int
    utilization_level: UtilizationLevel
    rfid_tag: str
    wall: WallType | None
    slot_number: int | None
    is_on_wall: bool
    created: datetime


class PanelDataCreate(SQLModel):
    position: str
    label: str


class PanelDataPublic(SQLModel):
    id: str
    utilization_percentage: int
    crop_count: int
    utilization_level: UtilizationLevel
    rfid_tag: str
    wall: WallType | None
    slot_number: int | None
    is_on_wall: bool
    channels: list[PanelChannelData]


class PanelResponse(SQLModel):
    panel: PanelDataPublic
    message: str


class NurseryStationData(SQLModel):
    utilization_percentage: int
    upper_shelf: ShelfData
    lower_shelf: ShelfData
    off_shelf_trays: list["TrayDataPublic"]


class CultivationAreaData(SQLModel):
    container_id: str
    panels: list[PanelDataPublic]
    date: datetime | None


class CropHistoryEvent(SQLModel):
    date: str
    event: str
    location: dict
    health_status: HealthStatus
    size: CropSize
    notes: str


class CropHistory(SQLModel):
    crop_id: str
    container_id: str
    events: list[CropHistoryEvent]
    start_date: datetime | None
    end_date: datetime | None


# Tray/Panel Provisioning Models

class TrayProvisionRequest(SQLModel):
    rfid_tag: str = Field(min_length=6, max_length=50)
    notes: str | None = Field(default="", max_length=500)


class PanelProvisionRequest(SQLModel):
    rfid_tag: str = Field(min_length=6, max_length=50)
    notes: str | None = Field(default="", max_length=500)


class TrayProvisionResponse(SQLModel):
    id: str
    rfid_tag: str
    container_id: str
    shelf: ShelfType | None
    slot_number: int | None
    location_display: str
    notes: str | None
    created: datetime
    message: str


class PanelProvisionResponse(SQLModel):
    id: str
    rfid_tag: str
    container_id: str
    wall: WallType | None
    slot_number: int | None
    location_display: str
    notes: str | None
    created: datetime
    message: str
