from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Panel(BaseModel):
    __tablename__ = "panels"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    rfid_tag = Column(String(100), unique=True, nullable=True, index=True)
    location = Column(JSON, nullable=True)
    utilization_pct = Column(Float, nullable=True)
    provisioned_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), nullable=True)
    capacity = Column(Integer, nullable=True)
    panel_type = Column(String(50), nullable=True)

    # Relationships
    container = relationship("Container", back_populates="panels")
    panel_snapshots = relationship("PanelSnapshot", back_populates="panel")