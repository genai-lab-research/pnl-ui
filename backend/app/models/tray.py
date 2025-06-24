from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base


class TrayLocation(Base):
    __tablename__ = "tray_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    shelf = Column(String, nullable=False)
    slot_number = Column(Integer, nullable=False)
    
    tray_id = Column(String, ForeignKey("trays.id"), unique=True)
    tray = relationship("Tray", back_populates="location", uselist=False)


class Tray(Base):
    __tablename__ = "trays"
    
    id = Column(String, primary_key=True, index=True)
    rfid_tag = Column(String, nullable=False, unique=True)
    utilization_percentage = Column(Integer, nullable=False, default=0)
    crop_count = Column(Integer, nullable=False, default=0)
    is_empty = Column(Boolean, nullable=False, default=True)
    provisioned_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    container_id = Column(String, nullable=False)
    
    location = relationship("TrayLocation", back_populates="tray", uselist=False)
    # Note: crops relationship will be handled via queries in repository/service layer