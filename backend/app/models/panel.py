from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base


class PanelLocation(Base):
    __tablename__ = "panel_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    wall = Column(String, nullable=False)
    slot_number = Column(Integer, nullable=False)
    
    panel_id = Column(String, ForeignKey("panels.id"), unique=True)
    panel = relationship("Panel", back_populates="location", uselist=False)


class Panel(Base):
    __tablename__ = "panels"
    
    id = Column(String, primary_key=True, index=True)
    rfid_tag = Column(String, nullable=False, unique=True)
    utilization_percentage = Column(Integer, nullable=False, default=0)
    crop_count = Column(Integer, nullable=False, default=0)
    is_empty = Column(Boolean, nullable=False, default=True)
    provisioned_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    container_id = Column(String, nullable=False)
    
    location = relationship("PanelLocation", back_populates="panel", uselist=False)
    # Note: crops relationship will be handled via queries in repository/service layer