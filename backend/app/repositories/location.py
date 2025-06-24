from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationUpdate
from app.core.pagination import PaginationParams, PaginationMeta, paginate_query


class LocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, location_data: LocationCreate) -> Location:
        db_location = Location(**location_data.model_dump())
        self.db.add(db_location)
        self.db.flush()
        return db_location

    def get_by_id(self, location_id: int) -> Optional[Location]:
        return self.db.query(Location).filter(Location.id == location_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Location]:
        return self.db.query(Location).offset(skip).limit(limit).all()
    
    def get_all_paginated(self, pagination: PaginationParams) -> Tuple[List[Location], PaginationMeta]:
        """Get all locations with pagination metadata."""
        query = self.db.query(Location)
        return paginate_query(query, pagination)
    
    def count_all(self) -> int:
        """Get total count of locations."""
        return self.db.query(func.count(Location.id)).scalar()

    def update(self, location_id: int, location_data: LocationUpdate) -> Optional[Location]:
        db_location = self.get_by_id(location_id)
        if not db_location:
            return None
        
        update_data = location_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_location, field, value)
        
        self.db.flush()
        return db_location

    def delete(self, location_id: int) -> bool:
        db_location = self.get_by_id(location_id)
        if not db_location:
            return False
        
        self.db.delete(db_location)
        self.db.flush()
        return True

    def get_by_city_and_country(self, city: str, country: str) -> Optional[Location]:
        return (
            self.db.query(Location)
            .filter(Location.city == city, Location.country == country)
            .first()
        )


class AsyncLocationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, location_data: LocationCreate) -> Location:
        db_location = Location(**location_data.model_dump())
        self.db.add(db_location)
        await self.db.flush()
        return db_location

    async def get_by_id(self, location_id: int) -> Optional[Location]:
        stmt = select(Location).where(Location.id == location_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Location]:
        stmt = select(Location).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def get_all_paginated(self, pagination: PaginationParams) -> Tuple[List[Location], PaginationMeta]:
        # Count query
        count_stmt = select(func.count(Location.id))
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar()
        
        # Data query
        stmt = select(Location).offset(pagination.skip).limit(pagination.limit)
        result = await self.db.execute(stmt)
        items = result.scalars().all()
        
        meta = PaginationMeta(
            page=pagination.page,
            limit=pagination.limit,
            total=total,
            pages=(total + pagination.limit - 1) // pagination.limit
        )
        
        return items, meta
    
    async def count_all(self) -> int:
        stmt = select(func.count(Location.id))
        result = await self.db.execute(stmt)
        return result.scalar()

    async def update(self, location_id: int, location_data: LocationUpdate) -> Optional[Location]:
        db_location = await self.get_by_id(location_id)
        if not db_location:
            return None
        
        update_data = location_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_location, field, value)
        
        await self.db.flush()
        return db_location

    async def delete(self, location_id: int) -> bool:
        db_location = await self.get_by_id(location_id)
        if not db_location:
            return False
        
        await self.db.delete(db_location)
        await self.db.flush()
        return True

    async def get_by_city_and_country(self, city: str, country: str) -> Optional[Location]:
        stmt = select(Location).where(Location.city == city, Location.country == country)
        result = await self.db.execute(stmt)
        return result.scalars().first()
