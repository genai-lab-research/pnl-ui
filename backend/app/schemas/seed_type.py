from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.base import BaseCreateSchema, BaseUpdateSchema


class SeedTypeBase(BaseModel):
    """Base SeedType schema"""
    name: str
    variety: Optional[str] = None
    supplier: Optional[str] = None
    batch_id: Optional[str] = None


class SeedTypeCreate(SeedTypeBase):
    """Schema for creating a new seed type"""
    model_config = ConfigDict(from_attributes=True)


class SeedTypeUpdate(BaseModel):
    """Schema for updating a seed type"""
    model_config = ConfigDict(from_attributes=True)
    
    name: Optional[str] = None
    variety: Optional[str] = None
    supplier: Optional[str] = None
    batch_id: Optional[str] = None


class SeedType(SeedTypeBase):
    """Full SeedType schema with all fields - matches Azure DB schema"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int


class SeedTypeInDB(SeedType):
    """SeedType schema as stored in database"""
    pass


# Alias for API responses
SeedTypeResponse = SeedType