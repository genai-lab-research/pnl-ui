from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Tenant(BaseModel):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)

    # Relationships
    containers = relationship("Container", back_populates="tenant")
    container_snapshots = relationship("ContainerSnapshot", back_populates="tenant")