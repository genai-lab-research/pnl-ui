from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func, select
from app.models.container import Container
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerFilter
from app.core.pagination import PaginationParams, PaginationMeta, paginate_query


class ContainerRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, container_data: ContainerCreate) -> Container:
        db_container = Container(**container_data.model_dump())
        self.db.add(db_container)
        self.db.flush()  # Flush to get ID without committing
        return db_container

    def get_by_id(self, container_id: str) -> Optional[Container]:
        return (
            self.db.query(Container)
            .options(joinedload(Container.location))
            .filter(Container.id == container_id)
            .first()
        )


class AsyncContainerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, container_data: ContainerCreate) -> Container:
        db_container = Container(**container_data.model_dump())
        self.db.add(db_container)
        await self.db.flush()
        return db_container

    async def get_by_id(self, container_id: str) -> Optional[Container]:
        stmt = select(Container).options(joinedload(Container.location)).where(Container.id == container_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_all(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        filters: Optional[ContainerFilter] = None
    ) -> List[Container]:
        stmt = select(Container).options(joinedload(Container.location))
        
        if filters:
            stmt = self._apply_filters_async(stmt, filters)
        
        result = await self.db.execute(stmt.offset(skip).limit(limit))
        return result.scalars().all()

    async def get_all_paginated(
        self, 
        pagination: PaginationParams,
        filters: Optional[ContainerFilter] = None
    ) -> Tuple[List[Container], PaginationMeta]:
        stmt = select(Container).options(joinedload(Container.location))
        
        if filters:
            stmt = self._apply_filters_async(stmt, filters)
        
        # Count query
        count_stmt = select(func.count(Container.id))
        if filters:
            count_stmt = self._apply_filters_async(count_stmt, filters)
        
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar()
        
        # Data query
        result = await self.db.execute(
            stmt.offset(pagination.skip).limit(pagination.limit)
        )
        items = result.scalars().all()
        
        meta = PaginationMeta(
            page=pagination.page,
            limit=pagination.limit,
            total=total,
            pages=(total + pagination.limit - 1) // pagination.limit
        )
        
        return items, meta

    def _apply_filters_async(self, stmt, filters: ContainerFilter):
        if filters.search:
            search = f"%{filters.search}%"
            stmt = stmt.where(
                or_(
                    Container.name.ilike(search),
                    Container.tenant.ilike(search),
                    Container.purpose.ilike(search),
                    Container.status.ilike(search)
                )
            )
        
        if filters.type:
            stmt = stmt.where(Container.type == filters.type)
        
        if filters.tenant:
            stmt = stmt.where(Container.tenant == filters.tenant)
        
        if filters.purpose:
            stmt = stmt.where(Container.purpose == filters.purpose)
        
        if filters.status:
            stmt = stmt.where(Container.status == filters.status)
        
        if filters.has_alerts is not None:
            stmt = stmt.where(Container.has_alert == filters.has_alerts)
            
        return stmt

    async def update(self, container_id: str, container_data: ContainerUpdate) -> Optional[Container]:
        db_container = await self.get_by_id(container_id)
        if not db_container:
            return None
        
        update_data = container_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_container, field, value)
        
        await self.db.flush()
        return db_container

    async def delete(self, container_id: str) -> bool:
        db_container = await self.get_by_id(container_id)
        if not db_container:
            return False
        
        await self.db.delete(db_container)
        await self.db.flush()
        return True

    async def get_by_tenant(self, tenant: str) -> List[Container]:
        stmt = select(Container).options(joinedload(Container.location)).where(Container.tenant == tenant)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_with_alerts(self) -> List[Container]:
        stmt = select(Container).options(joinedload(Container.location)).where(Container.has_alert.is_(True))
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_name_and_tenant(self, name: str, tenant: str) -> Optional[Container]:
        stmt = select(Container).where(and_(Container.name == name, Container.tenant == tenant))
        result = await self.db.execute(stmt)
        return result.scalars().first()
