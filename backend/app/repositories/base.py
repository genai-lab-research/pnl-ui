"""Base repository pattern for database operations."""

from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base repository providing common CRUD operations."""

    def __init__(self, model: Type[ModelType], db: AsyncSession):
        """Initialize repository with model and database session."""
        self.model = model
        self.db = db

    async def get(self, id: Any, load_relationships: bool = True) -> Optional[ModelType]:
        """Get a single record by ID."""
        query = select(self.model).where(self.model.id == id)
        
        if load_relationships:
            # Load all relationships to avoid N+1 queries
            for relationship in self.model.__mapper__.relationships:
                query = query.options(selectinload(getattr(self.model, relationship.key)))
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_all(self, load_relationships: bool = True) -> List[ModelType]:
        """Get all records."""
        query = select(self.model)
        
        if load_relationships:
            # Load all relationships to avoid N+1 queries
            for relationship in self.model.__mapper__.relationships:
                query = query.options(selectinload(getattr(self.model, relationship.key)))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        load_relationships: bool = True,
        order_by: Optional[str] = None,
        order_desc: bool = False,
    ) -> List[ModelType]:
        """Get multiple records with pagination."""
        query = select(self.model)
        
        if load_relationships:
            # Load all relationships to avoid N+1 queries
            for relationship in self.model.__mapper__.relationships:
                query = query.options(selectinload(getattr(self.model, relationship.key)))
        
        if order_by and hasattr(self.model, order_by):
            order_column = getattr(self.model, order_by)
            if order_desc:
                query = query.order_by(desc(order_column))
            else:
                query = query.order_by(asc(order_column))
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record."""
        obj_data = obj_in.model_dump() if hasattr(obj_in, 'model_dump') else obj_in
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        id_or_obj: Union[Any, ModelType],
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> Optional[ModelType]:
        """Update an existing record by ID or object."""
        # If first parameter is an ID, get the object first
        if not hasattr(id_or_obj, '_sa_instance_state'):
            db_obj = await self.get(id_or_obj)
            if not db_obj:
                return None
        else:
            db_obj = id_or_obj
        
        obj_data = obj_in.model_dump(exclude_unset=True) if hasattr(obj_in, 'model_dump') else obj_in
        
        for field, value in obj_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, id: Any) -> bool:
        """Delete a record by ID."""
        db_obj = await self.get(id)
        if db_obj:
            await self.db.delete(db_obj)
            await self.db.commit()
            return True
        return False

    async def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filters."""
        query = select(func.count(self.model.id))
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key) and value is not None:
                    column = getattr(self.model, key)
                    query = query.where(column == value)
        
        result = await self.db.execute(query)
        return result.scalar()

    async def exists(self, id: Any) -> bool:
        """Check if record exists by ID."""
        query = select(self.model.id).where(self.model.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def get_by_field(
        self, field: str, value: Any, load_relationships: bool = True
    ) -> Optional[ModelType]:
        """Get a record by a specific field value."""
        if not hasattr(self.model, field):
            return None
        
        query = select(self.model).where(getattr(self.model, field) == value)
        
        if load_relationships:
            for relationship in self.model.__mapper__.relationships:
                query = query.options(selectinload(getattr(self.model, relationship.key)))
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_multi_by_field(
        self,
        field: str,
        value: Any,
        skip: int = 0,
        limit: int = 100,
        load_relationships: bool = True,
    ) -> List[ModelType]:
        """Get multiple records by a specific field value."""
        if not hasattr(self.model, field):
            return []
        
        query = select(self.model).where(getattr(self.model, field) == value)
        
        if load_relationships:
            for relationship in self.model.__mapper__.relationships:
                query = query.options(selectinload(getattr(self.model, relationship.key)))
        
        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()