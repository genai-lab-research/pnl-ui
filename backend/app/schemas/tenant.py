from typing import List
from pydantic import BaseModel, Field


class TenantBase(BaseModel):
    name: str = Field(..., description="Tenant name")


class TenantCreate(TenantBase):
    pass


class TenantUpdate(TenantBase):
    pass


class TenantInDBBase(TenantBase):
    id: str

    class Config:
        from_attributes = True


class Tenant(TenantInDBBase):
    pass


class TenantList(BaseModel):
    total: int
    results: List[Tenant]
    
    class Config:
        from_attributes = True