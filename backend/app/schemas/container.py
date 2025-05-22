from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, validator

from app.models.enums import ContainerType, ContainerPurpose, ContainerStatus
from app.schemas.tenant import Tenant
from app.schemas.seed_type import SeedType
from app.schemas.alert import AlertSummary


class LocationBase(BaseModel):
    city: str
    country: str
    address: Optional[str] = None


class EcosystemSettingsBase(BaseModel):
    fa_environment: Optional[str] = None
    pya_environment: Optional[str] = None
    aws_environment: Optional[str] = None
    mbai_environment: Optional[str] = None
    fh_environment: Optional[str] = None


class ContainerBase(BaseModel):
    name: str = Field(..., description="Unique container name")
    type: ContainerType
    tenant_id: str = Field(..., description="ID of associated tenant")
    purpose: ContainerPurpose
    notes: Optional[str] = None
    shadow_service_enabled: bool = False
    ecosystem_connected: bool = False


class ContainerFormRequest(BaseModel):
    name: str = Field(..., description="Container name")
    tenant: str = Field(..., description="Tenant name")
    type: str = Field(..., description="Container type: PHYSICAL or VIRTUAL")
    purpose: str = Field(..., description="Container purpose")
    seed_types: List[str] = Field([], description="List of seed type IDs")
    location: str = Field("", description="Container location")
    notes: Optional[str] = None
    shadow_service_enabled: bool = False
    connect_to_other_systems: bool = False


class ContainerCreate(ContainerBase):
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    location_address: Optional[str] = None
    copied_environment_from: Optional[str] = None
    robotics_simulation_enabled: Optional[bool] = None
    seed_types: List[str] = Field([], description="List of seed type IDs")
    ecosystem_settings: Optional[Dict[str, Any]] = None
    
    @validator('location_city', 'location_country')
    def validate_location_for_physical(cls, v, values):
        if values.get('type') == ContainerType.PHYSICAL and not v:
            raise ValueError('Location is required for physical containers')
        return v


class ContainerUpdate(BaseModel):
    tenant_id: Optional[str] = None
    purpose: Optional[ContainerPurpose] = None
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    location_address: Optional[str] = None
    notes: Optional[str] = None
    shadow_service_enabled: Optional[bool] = None
    copied_environment_from: Optional[str] = None
    robotics_simulation_enabled: Optional[bool] = None
    seed_types: Optional[List[str]] = None
    ecosystem_connected: Optional[bool] = None
    ecosystem_settings: Optional[Dict[str, Any]] = None
    status: Optional[ContainerStatus] = None


class ContainerInDBBase(ContainerBase):
    id: str
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    location_address: Optional[str] = None
    copied_environment_from: Optional[str] = None
    robotics_simulation_enabled: Optional[bool] = None
    ecosystem_settings: Optional[Dict[str, Any]] = None
    status: ContainerStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Container(ContainerInDBBase):
    tenant: Tenant
    seed_types: List[SeedType]
    alerts: List[AlertSummary]


class ContainerSummary(BaseModel):
    id: str
    name: str
    type: ContainerType
    tenant_name: str
    purpose: ContainerPurpose
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    status: ContainerStatus
    created_at: datetime
    updated_at: datetime
    has_alerts: bool

    class Config:
        from_attributes = True


class ContainerList(BaseModel):
    total: int
    results: List[ContainerSummary]


class ContainerStats(BaseModel):
    physical_count: int
    virtual_count: int


class SystemIntegration(BaseModel):
    name: str
    enabled: bool


class SystemIntegrations(BaseModel):
    fa_integration: SystemIntegration
    aws_environment: SystemIntegration
    mbai_environment: SystemIntegration


class Location(BaseModel):
    city: str
    country: str
    address: Optional[str] = None


class ContainerDetail(BaseModel):
    id: str
    name: str
    type: ContainerType
    tenant: str
    purpose: ContainerPurpose
    location: Location
    status: ContainerStatus
    created: datetime
    modified: datetime
    creator: str
    seed_types: List[str]
    notes: Optional[str] = None
    shadow_service_enabled: bool
    ecosystem_connected: bool
    system_integrations: SystemIntegrations

    class Config:
        from_attributes = True