from sqlalchemy import Column, Integer, Float
from sqlalchemy.orm import relationship

from app.core.db import Base


class CropMeasurement(Base):
    __tablename__ = "crop_measurements"

    id = Column(Integer, primary_key=True, index=True)
    radius = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    area = Column(Float, nullable=True)
    area_estimated = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

    # Relationships
    crops = relationship("Crop", back_populates="measurements")
    crop_snapshots = relationship("CropSnapshot", back_populates="measurements")