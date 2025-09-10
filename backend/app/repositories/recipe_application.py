from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_
from sqlalchemy.orm import selectinload

from app.repositories.base import BaseRepository
from app.models.recipe_application import RecipeApplication
from app.schemas.recipe import RecipeApplicationRequest


class RecipeApplicationRepository(BaseRepository[RecipeApplication, dict, RecipeApplicationRequest]):
    """Repository for recipe application operations"""

    def __init__(self, db: AsyncSession):
        super().__init__(RecipeApplication, db)

    async def get_by_id(self, id: int) -> Optional[RecipeApplication]:
        """Get recipe application by ID - alias for base get method"""
        return await self.get(id)

    async def get_by_container_id(
        self, 
        container_id: int, 
        limit: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[RecipeApplication]:
        """Get recipe applications for a container with optional filtering"""
        try:
            query = select(RecipeApplication).options(
                selectinload(RecipeApplication.recipe_version),
                selectinload(RecipeApplication.previous_recipe_version),
                selectinload(RecipeApplication.container)
            ).where(RecipeApplication.container_id == container_id)

            # Apply date filters if provided
            if start_date:
                query = query.where(RecipeApplication.applied_at >= start_date)
            if end_date:
                query = query.where(RecipeApplication.applied_at <= end_date)

            # Order by applied_at descending (most recent first)
            query = query.order_by(desc(RecipeApplication.applied_at))

            # Apply limit if provided
            if limit:
                query = query.limit(limit)

            result = await self.db.execute(query)
            return result.scalars().all()
        except Exception as e:
            raise Exception(f"Error retrieving recipe applications for container {container_id}: {str(e)}")

    async def get_latest_by_container_id(self, container_id: int) -> Optional[RecipeApplication]:
        """Get the most recent recipe application for a container"""
        try:
            result = await self.db.execute(
                select(RecipeApplication)
                .options(
                    selectinload(RecipeApplication.recipe_version),
                    selectinload(RecipeApplication.container)
                )
                .where(RecipeApplication.container_id == container_id)
                .order_by(desc(RecipeApplication.applied_at))
                .limit(1)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            raise Exception(f"Error retrieving latest recipe application for container {container_id}: {str(e)}")

    async def create_application(
        self,
        container_id: int,
        recipe_version_id: int,
        applied_by: str,
        previous_recipe_version_id: Optional[int] = None,
        changes_summary: Optional[Dict[str, Any]] = None,
        environment_sync_status: Optional[str] = None
    ) -> RecipeApplication:
        """Create a new recipe application record"""
        try:
            application = RecipeApplication(
                container_id=container_id,
                recipe_version_id=recipe_version_id,
                applied_at=datetime.utcnow(),
                applied_by=applied_by,
                previous_recipe_version_id=previous_recipe_version_id,
                changes_summary=changes_summary,
                environment_sync_status=environment_sync_status or "pending"
            )
            
            self.db.add(application)
            await self.db.commit()
            await self.db.refresh(application)
            return application
            
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Error creating recipe application: {str(e)}")

    async def update_sync_status(
        self, 
        application_id: int, 
        sync_status: str
    ) -> Optional[RecipeApplication]:
        """Update the environment sync status of a recipe application"""
        try:
            application = await self.get_by_id(application_id)
            if application:
                application.environment_sync_status = sync_status
                await self.db.commit()
                await self.db.refresh(application)
                return application
            return None
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Error updating sync status: {str(e)}")

    async def get_applications_by_recipe_version(
        self, 
        recipe_version_id: int
    ) -> List[RecipeApplication]:
        """Get all applications for a specific recipe version"""
        try:
            result = await self.db.execute(
                select(RecipeApplication)
                .options(
                    selectinload(RecipeApplication.container),
                    selectinload(RecipeApplication.recipe_version)
                )
                .where(RecipeApplication.recipe_version_id == recipe_version_id)
                .order_by(desc(RecipeApplication.applied_at))
            )
            return result.scalars().all()
        except Exception as e:
            raise Exception(f"Error retrieving applications for recipe version {recipe_version_id}: {str(e)}")

    async def get_applications_by_user(
        self, 
        applied_by: str, 
        limit: Optional[int] = None
    ) -> List[RecipeApplication]:
        """Get applications by a specific user"""
        try:
            query = select(RecipeApplication).options(
                selectinload(RecipeApplication.container),
                selectinload(RecipeApplication.recipe_version)
            ).where(RecipeApplication.applied_by == applied_by)
            
            query = query.order_by(desc(RecipeApplication.applied_at))
            
            if limit:
                query = query.limit(limit)

            result = await self.db.execute(query)
            return result.scalars().all()
        except Exception as e:
            raise Exception(f"Error retrieving applications by user {applied_by}: {str(e)}")

    async def get_pending_sync_applications(self) -> List[RecipeApplication]:
        """Get applications with pending environment sync"""
        try:
            result = await self.db.execute(
                select(RecipeApplication)
                .options(
                    selectinload(RecipeApplication.container),
                    selectinload(RecipeApplication.recipe_version)
                )
                .where(
                    and_(
                        RecipeApplication.environment_sync_status.in_(["pending", "failed"]),
                        RecipeApplication.applied_at >= datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
                    )
                )
                .order_by(RecipeApplication.applied_at)
            )
            return result.scalars().all()
        except Exception as e:
            raise Exception(f"Error retrieving pending sync applications: {str(e)}")

    async def count_by_container_id(self, container_id: int) -> int:
        """Count total recipe applications for a container"""
        try:
            result = await self.db.execute(
                select(RecipeApplication)
                .where(RecipeApplication.container_id == container_id)
            )
            return len(result.scalars().all())
        except Exception as e:
            raise Exception(f"Error counting recipe applications: {str(e)}")