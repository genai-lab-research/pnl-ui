from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship

from app.core.db import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    seed_type_id = Column(Integer, ForeignKey("seed_types.id"), index=True)
    tray_id = Column(Integer, ForeignKey("trays.id"), nullable=True, index=True)
    row = Column(Integer, nullable=True)  # Grid row position (1-20)
    column = Column(Integer, nullable=True)  # Grid column position (1-10)
    seed_date = Column(Date, nullable=True)
    transplanting_date_planned = Column(Date, nullable=True)
    transplanting_date = Column(Date, nullable=True)
    harvesting_date_planned = Column(Date, nullable=True)
    harvesting_date = Column(Date, nullable=True)
    lifecycle_status = Column(String(50), nullable=True)
    health_check = Column(String(50), nullable=True)
    current_location = Column(JSON, nullable=True)
    last_location = Column(JSON, nullable=True)
    measurements_id = Column(Integer, ForeignKey("crop_measurements.id"), nullable=True)
    image_url = Column(String(500), nullable=True)
    recipe_version_id = Column(Integer, ForeignKey("recipe_versions.id"), nullable=True)
    accumulated_light_hours = Column(Float, nullable=True)
    accumulated_water_hours = Column(Float, nullable=True)
    notes = Column(String(1000), nullable=True)

    # Relationships
    seed_type = relationship("SeedType", back_populates="crops")
    tray = relationship("Tray", back_populates="crops")
    measurements = relationship("CropMeasurement", back_populates="crops")
    recipe_version = relationship("RecipeVersion", back_populates="crops")
    crop_history = relationship("CropHistory", back_populates="crop", cascade="all, delete-orphan")
    crop_snapshots = relationship("CropSnapshot", back_populates="crop", cascade="all, delete-orphan")