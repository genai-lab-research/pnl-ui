from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.core.db import Base


class RecipeMaster(Base):
    __tablename__ = "recipe_master"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    notes = Column(String, nullable=True)

    # Relationships
    recipe_versions = relationship("RecipeVersion", back_populates="recipe_master", cascade="all, delete-orphan")


class RecipeVersion(Base):
    __tablename__ = "recipe_versions"

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipe_master.id"), index=True)
    version = Column(String, nullable=False)
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_to = Column(DateTime(timezone=True), nullable=True)
    tray_density = Column(Float, nullable=True)
    air_temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    co2 = Column(Float, nullable=True)
    water_temperature = Column(Float, nullable=True)
    ec = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    water_hours = Column(Float, nullable=True)
    light_hours = Column(Float, nullable=True)
    created_by = Column(String, nullable=False)

    # Relationships
    recipe_master = relationship("RecipeMaster", back_populates="recipe_versions")
    crops = relationship("Crop", back_populates="recipe_version")
    crop_snapshots = relationship("CropSnapshot", back_populates="recipe_version")