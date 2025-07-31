from sqlalchemy import Column, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.db import Base


class EnvironmentLink(Base):
    __tablename__ = "environment_links"

    container_id = Column(Integer, ForeignKey("containers.id"), primary_key=True, index=True)
    fa = Column(JSON, nullable=True)
    pya = Column(JSON, nullable=True)
    aws = Column(JSON, nullable=True)
    mbai = Column(JSON, nullable=True)
    fh = Column(JSON, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="environment_links")