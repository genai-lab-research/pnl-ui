from typing import Optional
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.db import Base


class SeedType(Base):
    """Seed type model - matches existing Azure DB schema"""
    __tablename__ = "seed_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=True)
    supplier = Column(String(100), nullable=True)
    batch_id = Column(String(100), nullable=True)
    
    # Relationships
    containers = relationship("Container", secondary="container_seed_types", back_populates="seed_types")
    crops = relationship("Crop", back_populates="seed_type")