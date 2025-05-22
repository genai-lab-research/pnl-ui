from datetime import datetime
from typing import List, Optional
import uuid

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Table
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON

from app.database.database import Base
from app.models.enums import (
    ContainerType, ContainerPurpose, ContainerStatus, AlertSeverity,
    DeviceStatus, ShelfPosition, WallPosition, CropLifecycleStatus,
    CropHealthCheck, LocationType, AlertRelatedObjectType, InventoryStatus,
    FAEnvironment, PYAEnvironment, AWSEnvironment, MBAIEnvironment,
    FHEnvironment, CropLocationType, ActorType
)

# Association table for many-to-many relationship between Container and SeedType
container_seed_types = Table(
    'container_seed_types',
    Base.metadata,
    Column('container_id', String, ForeignKey('containers.id')),
    Column('seed_type_id', String, ForeignKey('seed_types.id'))
)

class Container(Base):
    __tablename__ = 'containers'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)
    type = Column(Enum(ContainerType), nullable=False)
    tenant_id = Column(String, ForeignKey('tenants.id'), nullable=False)
    purpose = Column(Enum(ContainerPurpose), nullable=False)
    location_city = Column(String)
    location_country = Column(String)
    location_address = Column(String)
    notes = Column(String)
    shadow_service_enabled = Column(Boolean, default=False)
    copied_environment_from = Column(String, ForeignKey('containers.id'))
    robotics_simulation_enabled = Column(Boolean, default=False)
    ecosystem_connected = Column(Boolean, default=False)
    ecosystem_settings = Column(MutableDict.as_mutable(JSON))
    status = Column(Enum(ContainerStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    tenant = relationship("Tenant", back_populates="containers")
    seed_types = relationship("SeedType", secondary=container_seed_types, back_populates="containers")
    alerts = relationship("Alert", back_populates="container")
    devices = relationship("Device", back_populates="container")
    trays = relationship("Tray", back_populates="container")
    panels = relationship("Panel", back_populates="container")
    activity_logs = relationship("ActivityLog", back_populates="container")
    metric_snapshots = relationship("MetricSnapshot", back_populates="container")


class Tenant(Base):
    __tablename__ = 'tenants'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)

    # Relationships
    containers = relationship("Container", back_populates="tenant")


class SeedType(Base):
    __tablename__ = 'seed_types'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    variety = Column(String)
    supplier = Column(String)
    batch_id = Column(String)

    # Relationships
    containers = relationship("Container", secondary=container_seed_types, back_populates="seed_types")
    crops = relationship("Crop", back_populates="seed_type_ref")


class Alert(Base):
    __tablename__ = 'alerts'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    description = Column(String, nullable=False)
    severity = Column(Enum(AlertSeverity), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    active = Column(Boolean, default=True)
    related_object_type = Column(Enum(AlertRelatedObjectType))
    related_object_id = Column(String)

    # Relationships
    container = relationship("Container", back_populates="alerts")


class Device(Base):
    __tablename__ = 'devices'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    name = Column(String, nullable=False)
    model = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    firmware_version = Column(String)
    port = Column(String)
    status = Column(Enum(DeviceStatus), nullable=False)
    last_active_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    container = relationship("Container", back_populates="devices")


class Tray(Base):
    __tablename__ = 'trays'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    rfid_tag = Column(String, unique=True, nullable=False)
    shelf = Column(Enum(ShelfPosition))
    slot_number = Column(Integer)
    utilization_percentage = Column(Float, default=0)
    provisioned_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(InventoryStatus), default=InventoryStatus.AVAILABLE)
    capacity = Column(Integer)
    tray_type = Column(String)

    # Relationships
    container = relationship("Container", back_populates="trays")
    crops = relationship("Crop", back_populates="tray")


class Panel(Base):
    __tablename__ = 'panels'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    rfid_tag = Column(String, unique=True, nullable=False)
    wall = Column(Enum(WallPosition))
    slot_number = Column(Integer)
    utilization_percentage = Column(Float, default=0)
    provisioned_at = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(InventoryStatus), default=InventoryStatus.AVAILABLE)
    capacity = Column(Integer)
    panel_type = Column(String)

    # Relationships
    container = relationship("Container", back_populates="panels")
    crops = relationship("Crop", back_populates="panel")


class Crop(Base):
    __tablename__ = 'crops'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    seed_type_id = Column(String, ForeignKey('seed_types.id'), nullable=False)
    seed_date = Column(DateTime, nullable=False)
    transplanting_date_planned = Column(DateTime)
    harvesting_date_planned = Column(DateTime)
    transplanted_date = Column(DateTime)
    harvesting_date = Column(DateTime)
    lifecycle_status = Column(Enum(CropLifecycleStatus), nullable=False)
    health_check = Column(Enum(CropHealthCheck), nullable=False, default=CropHealthCheck.HEALTHY)
    
    # Location info
    current_location_type = Column(Enum(CropLocationType))
    tray_id = Column(String, ForeignKey('trays.id'))
    panel_id = Column(String, ForeignKey('panels.id'))
    
    # Position in tray
    tray_row = Column(Integer)
    tray_column = Column(Integer)
    
    # Position in panel
    panel_channel = Column(Integer)
    panel_position = Column(Float)
    
    # Physical properties
    radius = Column(Float)
    width = Column(Float)
    height = Column(Float)
    area = Column(Float)
    weight = Column(Float)

    # Relationships
    seed_type_ref = relationship("SeedType", back_populates="crops")
    tray = relationship("Tray", back_populates="crops")
    panel = relationship("Panel", back_populates="crops")
    history = relationship("CropHistoryEntry", back_populates="crop")


class CropHistoryEntry(Base):
    __tablename__ = 'crop_history_entries'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String, ForeignKey('crops.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event = Column(String, nullable=False)
    performed_by = Column(String, nullable=False)
    notes = Column(String)

    # Relationships
    crop = relationship("Crop", back_populates="history")


class ActivityLog(Base):
    __tablename__ = 'activity_logs'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    action_type = Column(String, nullable=False)
    actor_type = Column(Enum(ActorType), nullable=False)
    actor_id = Column(String, nullable=False)
    description = Column(String, nullable=False)

    # Relationships
    container = relationship("Container", back_populates="activity_logs")


class MetricSnapshot(Base):
    __tablename__ = 'metric_snapshots'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    container_id = Column(String, ForeignKey('containers.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    air_temperature = Column(Float)
    humidity = Column(Float)
    co2 = Column(Float)
    yield_kg = Column(Float)
    space_utilization_percentage = Column(Float)
    nursery_utilization_percentage = Column(Float)
    cultivation_utilization_percentage = Column(Float)

    # Relationships
    container = relationship("Container", back_populates="metric_snapshots")


class EnvironmentLinks(Base):
    __tablename__ = 'environment_links'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    fa_alpha = Column(String)
    fa_prod = Column(String)
    pya_dev = Column(String)
    pya_test = Column(String)
    pya_stage = Column(String)
    aws_dev = Column(String)
    aws_prod = Column(String)
    mbai_prod = Column(String)
    fh_prod = Column(String)