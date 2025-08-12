from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class ActivityLog(BaseModel):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(Integer, ForeignKey("containers.id"), index=True)
    timestamp = Column(DateTime(timezone=True), nullable=True)
    action_type = Column(String, nullable=True)
    actor_type = Column(String, nullable=True)
    actor_id = Column(String, nullable=True)
    description = Column(String, nullable=True)

    # Relationships
    container = relationship("Container", back_populates="activity_logs")