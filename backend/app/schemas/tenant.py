"""Tenant schemas for API requests and responses."""

from pydantic import BaseModel, Field


class TenantBase(BaseModel):
    """Base tenant schema."""
    name: str = Field(..., description="Tenant name", max_length=100)


class TenantCreate(TenantBase):
    """Schema for creating a new tenant."""
    pass


class TenantResponse(TenantBase):
    """Schema for tenant API responses."""
    id: int = Field(..., description="Unique tenant identifier")

    class Config:
        from_attributes = True