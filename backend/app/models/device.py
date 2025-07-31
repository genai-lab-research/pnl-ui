"""Device models for IoT device management."""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Device(BaseModel):
    """Device model for IoT devices in containers."""
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    name = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    serial_number = Column(String(100), nullable=True)
    firmware_version = Column(String(50), nullable=True)
    port = Column(String(50), nullable=True)
    status = Column(String(50), nullable=True)
    last_active_at = Column(DateTime(timezone=True), nullable=True)
    
    # Configuration fields
    configuration_settings = Column(JSON, nullable=True)
    configuration_parameters = Column(JSON, nullable=True)
    
    # Diagnostics fields
    diagnostics_uptime = Column(Float, nullable=True)
    diagnostics_error_count = Column(Integer, nullable=True, default=0)
    diagnostics_last_error = Column(String, nullable=True)
    diagnostics_performance_metrics = Column(JSON, nullable=True)
    
    # Connectivity fields
    connectivity_connection_type = Column(String, nullable=True)
    connectivity_signal_strength = Column(Float, nullable=True)
    connectivity_last_heartbeat = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    container = relationship("Container", back_populates="devices")


class DeviceHealthHistory(BaseModel):
    """Device health history tracking model."""
    __tablename__ = "device_health_history"
    
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(
        Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False
    )
    timestamp = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, nullable=False)
    uptime_hours = Column(Float, nullable=False)
    error_count = Column(Integer, nullable=False, default=0)
    performance_score = Column(Float, nullable=False)
    notes = Column(String, nullable=True)
    
    # Relationships
    device = relationship("Device", back_populates="health_history")


# Add health_history relationship to Device model
Device.health_history = relationship(
    "DeviceHealthHistory", back_populates="device", cascade="all, delete-orphan"
)