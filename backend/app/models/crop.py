from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Float, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from app.core.db import Base


class CropLocation(Base):
    __tablename__ = "crop_locations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String, nullable=False)
    tray_id = Column(String, ForeignKey("trays.id"), nullable=True)
    panel_id = Column(String, ForeignKey("panels.id"), nullable=True)
    row = Column(Integer, nullable=False)
    column = Column(Integer, nullable=False)
    channel = Column(Integer, nullable=True)
    position = Column(Integer, nullable=False)


class CropMetrics(Base):
    __tablename__ = "crop_metrics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False)
    recorded_at = Column(DateTime, nullable=False)
    
    # Growth metrics
    height_cm = Column(Float, nullable=True)
    leaf_count = Column(Integer, nullable=True)
    stem_diameter_mm = Column(Float, nullable=True)
    leaf_area_cm2 = Column(Float, nullable=True)
    biomass_g = Column(Float, nullable=True)
    
    # Health indicators
    health_score = Column(Float, nullable=True)  # 0-100
    disease_detected = Column(Boolean, default=False)
    pest_detected = Column(Boolean, default=False)
    stress_level = Column(Float, nullable=True)  # 0-100
    
    # Environmental metrics
    temperature_c = Column(Float, nullable=True)
    humidity_percent = Column(Float, nullable=True)
    light_intensity_umol = Column(Float, nullable=True)
    ph_level = Column(Float, nullable=True)
    ec_level = Column(Float, nullable=True)  # Electrical conductivity
    
    # Nutritional metrics
    nitrogen_ppm = Column(Float, nullable=True)
    phosphorus_ppm = Column(Float, nullable=True)
    potassium_ppm = Column(Float, nullable=True)
    calcium_ppm = Column(Float, nullable=True)
    magnesium_ppm = Column(Float, nullable=True)


class CropStatistics(Base):
    __tablename__ = "crop_statistics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    crop_id = Column(String, ForeignKey("crops.id"), nullable=False, unique=True)
    
    # Growth statistics
    avg_daily_growth_rate = Column(Float, nullable=True)  # cm/day
    max_recorded_height = Column(Float, nullable=True)
    total_leaf_count = Column(Integer, nullable=True)
    growth_stage = Column(String, nullable=True)  # seedling, vegetative, flowering, fruiting
    
    # Yield predictions
    predicted_yield_g = Column(Float, nullable=True)
    predicted_harvest_date = Column(DateTime, nullable=True)
    yield_quality_score = Column(Float, nullable=True)  # 0-100
    
    # Performance metrics
    survival_rate = Column(Float, nullable=True)  # 0-100
    resource_efficiency = Column(Float, nullable=True)  # 0-100
    time_to_harvest_days = Column(Integer, nullable=True)
    
    # Environmental adaptation
    temperature_tolerance = Column(Float, nullable=True)  # 0-100
    humidity_tolerance = Column(Float, nullable=True)  # 0-100
    light_efficiency = Column(Float, nullable=True)  # 0-100
    
    # Health history
    disease_resistance = Column(Float, nullable=True)  # 0-100
    pest_resistance = Column(Float, nullable=True)  # 0-100
    overall_health_trend = Column(String, nullable=True)  # improving, stable, declining
    
    # Cultivation details
    variety = Column(String, nullable=True)
    genetic_traits = Column(JSON, nullable=True)
    cultivation_method = Column(String, nullable=True)  # hydroponic, aeroponic, soil
    fertilizer_program = Column(String, nullable=True)
    irrigation_schedule = Column(String, nullable=True)
    
    # Quality metrics
    nutritional_content = Column(JSON, nullable=True)
    taste_profile = Column(JSON, nullable=True)
    appearance_score = Column(Float, nullable=True)  # 0-100
    shelf_life_days = Column(Integer, nullable=True)
    
    # Notes and observations
    cultivation_notes = Column(Text, nullable=True)
    harvest_notes = Column(Text, nullable=True)
    special_observations = Column(Text, nullable=True)


class Crop(Base):
    __tablename__ = "crops"

    id = Column(String, primary_key=True, index=True)
    container_id = Column(String, ForeignKey("containers.id"), nullable=False, index=True)
    seed_type = Column(String, nullable=False, index=True)
    seed_date = Column(DateTime, nullable=False)
    transplanting_date_planned = Column(DateTime, nullable=True)
    harvesting_date_planned = Column(DateTime, nullable=True)
    transplanted_date = Column(DateTime, nullable=True)
    harvesting_date = Column(DateTime, nullable=True)
    age = Column(Integer, nullable=False)
    status = Column(String, nullable=False, index=True)
    overdue_days = Column(Integer, nullable=True, default=0)
    location_id = Column(Integer, ForeignKey("crop_locations.id"), nullable=False)

    container = relationship("Container", backref="crops")
    location = relationship("CropLocation", backref="crops")
    metrics = relationship("CropMetrics", backref="crop", cascade="all, delete-orphan")
    statistics = relationship("CropStatistics", backref="crop", uselist=False, cascade="all, delete-orphan")