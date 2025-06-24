from sqlalchemy import Column, String, Integer, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.db import Base


class InventoryMetrics(Base):
    __tablename__ = "inventory_metrics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    container_id = Column(String, ForeignKey("containers.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    nursery_station_utilization = Column(Integer, nullable=False)
    cultivation_area_utilization = Column(Integer, nullable=False)
    
    # Environmental metrics
    air_temperature = Column(Float, nullable=True)  # Temperature in Celsius
    humidity = Column(Integer, nullable=True)  # Humidity percentage 0-100
    co2_level = Column(Integer, nullable=True)  # CO2 level in ppm
    yield_kg = Column(Float, nullable=True)  # Yield in kg

    container = relationship("Container", backref="inventory_metrics")