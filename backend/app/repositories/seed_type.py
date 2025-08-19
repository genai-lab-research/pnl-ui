"""Seed type repository for database operations."""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.seed_type import SeedType
from app.repositories.base import BaseRepository
from app.schemas.seed_type import SeedTypeCreate, SeedTypeUpdate


class SeedTypeRepository(BaseRepository[SeedType, SeedTypeCreate, SeedTypeUpdate]):
    """Seed type repository."""

    def __init__(self, db: AsyncSession):
        super().__init__(SeedType, db)

    async def get_by_name(self, name: str) -> Optional[SeedType]:
        """Get seed type by name."""
        return await self.get_by_field("name", name)

    async def get_by_supplier(self, supplier: str) -> List[SeedType]:
        """Get seed types by supplier."""
        return await self.get_multi_by_field("supplier", supplier)

    async def get_by_variety(self, variety: str) -> List[SeedType]:
        """Get seed types by variety."""
        return await self.get_multi_by_field("variety", variety)

    async def get_all_suppliers(self) -> List[str]:
        """Get all unique suppliers."""
        query = select(SeedType.supplier).distinct().where(SeedType.supplier.isnot(None))
        result = await self.db.execute(query)
        return [supplier for supplier in result.scalars().all() if supplier]

    async def get_all_varieties(self) -> List[str]:
        """Get all unique varieties."""
        query = select(SeedType.variety).distinct().where(SeedType.variety.isnot(None))
        result = await self.db.execute(query)
        return [variety for variety in result.scalars().all() if variety]