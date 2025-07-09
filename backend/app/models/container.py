from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Table, Boolean, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from app.core.db import Base


# Association table for container-seed_type many-to-many relationship
container_seed_types = Table(
    'container_seed_types',
    Base.metadata,
    Column('container_id', Integer, ForeignKey('containers.id'), primary_key=True),
    Column('seed_type_id', Integer, ForeignKey('seed_types.id'), primary_key=True)
)


class Container(BaseModel):
    """Container model with all properties and relationships"""
    __tablename__ = "containers"
    
    name = Column(String(255), nullable=False, unique=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    type = Column(String(100), nullable=True)
    purpose = Column(String(500), nullable=True)
    location = Column(JSON, nullable=True)
    notes = Column(String(1000), nullable=True)
    shadow_service_enabled = Column(Boolean, default=False, nullable=True)
    copied_environment_from = Column(Integer, nullable=True)
    robotics_simulation_enabled = Column(Boolean, default=False, nullable=True)
    ecosystem_connected = Column(Boolean, default=False, nullable=True)
    ecosystem_settings = Column(JSON, nullable=True)
    status = Column(String(50), nullable=True, default="created")
    
    # Relationships
    tenant = relationship("Tenant", back_populates="containers")
    seed_types = relationship("SeedType", secondary=container_seed_types, back_populates="containers")
    alerts = relationship("Alert", back_populates="container")
    devices = relationship("Device", back_populates="container")
    trays = relationship("Tray", back_populates="container")
    panels = relationship("Panel", back_populates="container")
    activity_logs = relationship("ActivityLog", back_populates="container")
    metric_snapshots = relationship("MetricSnapshot", back_populates="container")
    container_snapshots = relationship("ContainerSnapshot", back_populates="container")
    tray_snapshots = relationship("TraySnapshot", back_populates="container")
    panel_snapshots = relationship("PanelSnapshot", back_populates="container")
    environment_links = relationship("EnvironmentLink", back_populates="container", uselist=False)

