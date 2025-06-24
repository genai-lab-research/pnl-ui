from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base


class Location(Base):
    __tablename__ = "locations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    city = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    address = Column(String, nullable=True)
