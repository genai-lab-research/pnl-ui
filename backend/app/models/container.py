from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base


class Container(Base):
    __tablename__ = "containers"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    name = Column(String, nullable=False, index=True)
    tenant = Column(String, nullable=False, index=True)
    purpose = Column(String, nullable=False)
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"), nullable=False)
    status = Column(String, nullable=False, index=True)
    seed_types = Column(JSON, nullable=True)
    created = Column(DateTime, server_default=func.now(), nullable=False)
    modified = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    has_alert = Column(Boolean, default=False, nullable=False)
    notes = Column(String, nullable=True)
    shadow_service_enabled = Column(Boolean, default=False, nullable=False)
    ecosystem_connected = Column(Boolean, default=False, nullable=False)

    location = relationship("Location", backref="containers")
