from pydantic import BaseModel, Field
from typing import Optional


class SeedTypeBase(BaseModel):
    name: str = Field(..., description="Seed type name")
    variety: Optional[str] = Field(None, description="Seed variety")
    supplier: Optional[str] = Field(None, description="Seed supplier")
    batch_id: Optional[str] = Field(None, description="Batch identifier")


class SeedTypeCreate(SeedTypeBase):
    pass


class SeedTypeUpdate(SeedTypeBase):
    name: Optional[str] = Field(None, description="Seed type name")


class SeedTypeInDBBase(SeedTypeBase):
    id: str

    class Config:
        from_attributes = True


class SeedType(SeedTypeInDBBase):
    pass