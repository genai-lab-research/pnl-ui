from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.db import Base


class CropHistory(Base):
    __tablename__ = "crop_history"

    crop_id = Column(Integer, ForeignKey("crops.id"), primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), primary_key=True)
    event = Column(String, nullable=True)
    performed_by = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    # Relationships
    crop = relationship("Crop", back_populates="crop_history")