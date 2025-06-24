from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator


class LocationBase(BaseModel):
    city: str
    country: str
    address: Optional[str] = None
    
    @field_validator('city', 'country')
    @classmethod
    def validate_non_empty_string(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty')
        return v.strip()


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    city: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None


class LocationResponse(LocationBase):
    id: UUID

    class Config:
        from_attributes = True
