from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.repositories.base import BaseRepository
from app.models.environment_link import EnvironmentLink
from app.schemas.environment import EnvironmentLinksUpdate


class EnvironmentLinkRepository(BaseRepository[EnvironmentLink, dict, EnvironmentLinksUpdate]):
    """Repository for environment link operations"""

    def __init__(self, db: AsyncSession):
        super().__init__(EnvironmentLink, db)

    async def get_by_id(self, id: int) -> Optional[EnvironmentLink]:
        """Get environment link by ID - alias for base get method"""
        return await self.get(id)

    async def get_by_container_id(self, container_id: int) -> Optional[EnvironmentLink]:
        """Get environment links by container ID"""
        try:
            result = await self.db.execute(
                select(EnvironmentLink).where(EnvironmentLink.container_id == container_id)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            raise Exception(f"Error retrieving environment links for container {container_id}: {str(e)}")

    async def create_or_update(self, container_id: int, environment_data: Dict[str, Any]) -> EnvironmentLink:
        """Create new environment link or update existing one"""
        try:
            # Check if environment link already exists
            existing = await self.get_by_container_id(container_id)
            
            if existing:
                # Update existing record
                for key, value in environment_data.items():
                    if hasattr(existing, key):
                        setattr(existing, key, value)
                await self.db.commit()
                await self.db.refresh(existing)
                return existing
            else:
                # Create new record
                environment_link = EnvironmentLink(
                    container_id=container_id,
                    **environment_data
                )
                self.db.add(environment_link)
                await self.db.commit()
                await self.db.refresh(environment_link)
                return environment_link
                
        except IntegrityError as e:
            await self.db.rollback()
            raise Exception(f"Integrity error creating/updating environment link: {str(e)}")
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Error creating/updating environment link: {str(e)}")

    async def update_environment_config(
        self, 
        container_id: int, 
        fa: Optional[Dict[str, Any]] = None,
        pya: Optional[Dict[str, Any]] = None,
        aws: Optional[Dict[str, Any]] = None,
        mbai: Optional[Dict[str, Any]] = None,
        fh: Optional[Dict[str, Any]] = None
    ) -> EnvironmentLink:
        """Update specific environment configurations"""
        try:
            environment_link = await self.get_by_container_id(container_id)
            if not environment_link:
                # Create new environment link if it doesn't exist
                environment_link = EnvironmentLink(container_id=container_id)
                self.db.add(environment_link)

            # Update only provided configurations
            if fa is not None:
                environment_link.fa = fa
            if pya is not None:
                environment_link.pya = pya
            if aws is not None:
                environment_link.aws = aws
            if mbai is not None:
                environment_link.mbai = mbai
            if fh is not None:
                environment_link.fh = fh

            await self.db.commit()
            await self.db.refresh(environment_link)
            return environment_link
            
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Error updating environment configuration: {str(e)}")

    async def delete_by_container_id(self, container_id: int) -> bool:
        """Delete environment links for a container"""
        try:
            environment_link = await self.get_by_container_id(container_id)
            if environment_link:
                await self.db.delete(environment_link)
                await self.db.commit()
                return True
            return False
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Error deleting environment links: {str(e)}")

    async def has_environment_connection(self, container_id: int) -> bool:
        """Check if container has any environment connection"""
        try:
            environment_link = await self.get_by_container_id(container_id)
            if not environment_link:
                return False
            
            # Check if any environment configuration is present
            return any([
                environment_link.fa,
                environment_link.pya,
                environment_link.aws,
                environment_link.mbai,
                environment_link.fh
            ])
        except Exception as e:
            raise Exception(f"Error checking environment connection: {str(e)}")