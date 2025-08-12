from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Alert(BaseModel):
    """Alert model for container alerts - matches Azure DB schema"""
    __tablename__ = "alerts"
    
    # Only include columns that exist in Azure DB
    container_id = Column(Integer, ForeignKey("containers.id"), nullable=False)
    description = Column(String(500), nullable=False)
    severity = Column(String(20), nullable=False)  # low, medium, high, critical
    active = Column(Boolean, default=True, nullable=False)
    related_object = Column(JSON, nullable=True)
    
    # Relationships - only container relationship since device_id doesn't exist
    container = relationship("Container", back_populates="alerts")