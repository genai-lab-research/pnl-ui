from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON, Boolean
from sqlalchemy.orm import relationship

from app.core.db import Base


class MetricSnapshot(Base):
    __tablename__ = "metric_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    air_temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    co2 = Column(Float, nullable=True)
    yield_kg = Column(Float, nullable=True)
    space_utilization_pct = Column(Float, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="metric_snapshots")


class ContainerSnapshot(Base):
    __tablename__ = "container_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    type = Column(String, nullable=True)
    status = Column(String, nullable=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    purpose = Column(String, nullable=True)
    location = Column(JSON, nullable=True)
    shadow_service_enabled = Column(Boolean, nullable=True)
    copied_environment_from = Column(Integer, nullable=True)
    robotics_simulation_enabled = Column(Boolean, nullable=True)
    ecosystem_settings = Column(JSON, nullable=True)
    yield_kg = Column(Float, nullable=True)
    space_utilization_pct = Column(Float, nullable=True)
    tray_ids = Column(JSON, nullable=True)  # Store as JSON array for SQLite compatibility
    panel_ids = Column(JSON, nullable=True)  # Store as JSON array for SQLite compatibility

    # Relationships
    container = relationship("Container", back_populates="container_snapshots")
    tenant = relationship("Tenant", back_populates="container_snapshots")


class TraySnapshot(Base):
    __tablename__ = "tray_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    tray_id = Column(Integer, ForeignKey("trays.id"), nullable=True, index=True)
    rfid_tag = Column(String, nullable=True)
    location = Column(JSON, nullable=True)
    crop_count = Column(Integer, nullable=True)
    utilization_percentage = Column(Float, nullable=True)
    status = Column(String, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="tray_snapshots")
    tray = relationship("Tray", back_populates="tray_snapshots")


class PanelSnapshot(Base):
    __tablename__ = "panel_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    panel_id = Column(Integer, ForeignKey("panels.id"), nullable=True, index=True)
    rfid_tag = Column(String, nullable=True)
    location = Column(JSON, nullable=True)
    crop_count = Column(Integer, nullable=True)
    utilization_percentage = Column(Float, nullable=True)
    status = Column(String, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="panel_snapshots")
    panel = relationship("Panel", back_populates="panel_snapshots")


class CropSnapshot(Base):
    __tablename__ = "crop_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    crop_id = Column(Integer, ForeignKey("crops.id"), index=True)
    lifecycle_status = Column(String, nullable=True)
    health_status = Column(String, nullable=True)
    recipe_version_id = Column(Integer, ForeignKey("recipe_versions.id"), nullable=True)
    location = Column(JSON, nullable=True)
    measurements_id = Column(Integer, ForeignKey("crop_measurements.id"), nullable=True)
    accumulated_light_hours = Column(Float, nullable=True)
    accumulated_water_hours = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)

    # Relationships
    crop = relationship("Crop", back_populates="crop_snapshots")
    recipe_version = relationship("RecipeVersion", back_populates="crop_snapshots")
    measurements = relationship("CropMeasurement", back_populates="crop_snapshots")