from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Column, DateTime, Integer, text
from sqlalchemy.ext.declarative import declared_attr
from app.core.db import Base


def utc_now():
    """Return current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class BaseModel(Base):
    """Base model class with common fields"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()