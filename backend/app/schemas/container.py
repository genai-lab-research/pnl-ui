from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field

from .location import LocationResponse


class ContainerType(str, Enum):
    PHYSICAL = "physical"
    VIRTUAL = "virtual"


class ContainerPurpose(str, Enum):
    DEVELOPMENT = "development"
    RESEARCH = "research"
    PRODUCTION = "production"
    PROPAGATION = "propagation"


class ContainerStatus(str, Enum):
    CREATED = "created"
    ACTIVE = "active"
    CONNECTED = "connected"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"


class ContainerBase(BaseModel):
    type: ContainerType
    name: str
    tenant: str
    purpose: ContainerPurpose
    location_id: UUID
    status: ContainerStatus
    seed_types: Optional[List[str]] = None
    has_alert: bool = False
    notes: Optional[str] = None
    shadow_service_enabled: bool = False
    ecosystem_connected: bool = False


class ContainerCreateRequest(BaseModel):
    name: str
    tenant: str
    type: ContainerType
    purpose: ContainerPurpose
    location: str  # Location string as per API spec
    seed_types: Optional[List[str]] = None
    notes: Optional[str] = None
    shadow_service_enabled: bool = False
    connect_to_other_systems: bool = False


class ContainerCreate(ContainerBase):
    id: str


class ContainerUpdate(BaseModel):
    type: Optional[ContainerType] = None
    name: Optional[str] = None
    tenant: Optional[str] = None
    purpose: Optional[ContainerPurpose] = None
    location_id: Optional[UUID] = None
    status: Optional[ContainerStatus] = None
    seed_types: Optional[List[str]] = None
    has_alert: Optional[bool] = None
    notes: Optional[str] = None
    shadow_service_enabled: Optional[bool] = None
    ecosystem_connected: Optional[bool] = None


class ContainerResponse(ContainerBase):
    id: str
    created: datetime
    modified: datetime
    location: Optional[LocationResponse] = None

    class Config:
        from_attributes = True


class ContainerFilter(BaseModel):
    search: Optional[str] = None
    type: Optional[ContainerType] = None
    tenant: Optional[str] = None
    purpose: Optional[ContainerPurpose] = None
    status: Optional[ContainerStatus] = None
    has_alerts: Optional[bool] = None