from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common fields"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime


class BaseCreateSchema(BaseModel):
    """Base create schema without ID and timestamps"""
    model_config = ConfigDict(from_attributes=True)


class BaseUpdateSchema(BaseModel):
    """Base update schema for partial updates"""
    model_config = ConfigDict(from_attributes=True)


class SuccessResponse(BaseModel):
    """Standard success response schema"""
    success: bool
    message: str
    deleted_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)