from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.recipe_application import RecipeApplicationRepository
from app.repositories.recipe_version import RecipeVersionRepository
from app.repositories.recipe_master import RecipeMasterRepository
from app.repositories.container import ContainerRepository
from app.schemas.recipe import (
    ActiveRecipe, RecipeApplicationRequest, RecipeApplicationResponse,
    RecipeApplicationHistory, AvailableRecipeVersion, EnvironmentParameters
)
from app.core.exceptions import NotFoundException, ValidationException


class RecipeApplicationService:
    """Service layer for recipe application operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.recipe_application_repo = RecipeApplicationRepository(db)
        self.recipe_version_repo = RecipeVersionRepository(db)
        self.recipe_master_repo = RecipeMasterRepository(db)
        self.container_repo = ContainerRepository(db)

    async def get_active_recipes(self, container_id: int) -> List[ActiveRecipe]:
        """Get currently active recipes for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Get the latest recipe application
        latest_application = await self.recipe_application_repo.get_latest_by_container_id(container_id)
        
        if not latest_application or not latest_application.recipe_version:
            return []

        recipe_version = latest_application.recipe_version
        
        # Get recipe master for name and crop type
        recipe_master = await self.recipe_master_repo.get(recipe_version.recipe_id)
        if not recipe_master:
            return []

        environment_parameters = EnvironmentParameters(
            tray_density=recipe_version.tray_density,
            air_temperature=recipe_version.air_temperature,
            humidity=recipe_version.humidity,
            co2=recipe_version.co2,
            water_temperature=recipe_version.water_temperature,
            ec=recipe_version.ec,
            ph=recipe_version.ph,
            water_hours=recipe_version.water_hours,
            light_hours=recipe_version.light_hours
        )

        active_recipe = ActiveRecipe(
            recipe_version_id=recipe_version.id,
            recipe_name=recipe_master.name,
            version=recipe_version.version,
            crop_type=recipe_master.crop_type,
            applied_at=latest_application.applied_at,
            applied_by=latest_application.applied_by,
            environment_parameters=environment_parameters
        )

        return [active_recipe]

    async def apply_recipe_version(
        self, 
        container_id: int, 
        request: RecipeApplicationRequest
    ) -> RecipeApplicationResponse:
        """Apply a recipe version to a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Verify recipe version exists
        recipe_version = await self.recipe_version_repo.get(request.recipe_version_id)
        if not recipe_version:
            raise NotFoundException(f"Recipe version {request.recipe_version_id} not found")

        # Check if recipe version is valid (within valid date range)
        now = datetime.utcnow()
        if recipe_version.valid_from and recipe_version.valid_from > now:
            raise ValidationException("Recipe version is not yet valid")
        if recipe_version.valid_to and recipe_version.valid_to < now:
            raise ValidationException("Recipe version has expired")

        try:
            # Get previous recipe version if any
            previous_application = await self.recipe_application_repo.get_latest_by_container_id(container_id)
            previous_recipe_version_id = previous_application.recipe_version_id if previous_application else None

            # Calculate changes summary
            changes_summary = await self._calculate_changes_summary(
                previous_recipe_version_id, 
                request.recipe_version_id
            )

            # Determine environment sync status
            environment_sync_status = "synced" if request.environment_sync else "not_synced"

            # Create recipe application record
            application = await self.recipe_application_repo.create_application(
                container_id=container_id,
                recipe_version_id=request.recipe_version_id,
                applied_by=request.applied_by,
                previous_recipe_version_id=previous_recipe_version_id,
                changes_summary=changes_summary,
                environment_sync_status=environment_sync_status
            )

            # TODO: Implement actual environment system synchronization here
            if request.environment_sync:
                sync_success = await self._sync_with_environment_system(container_id, recipe_version)
                if sync_success:
                    environment_sync_status = "synced"
                else:
                    environment_sync_status = "failed"
                    await self.recipe_application_repo.update_sync_status(application.id, "failed")

            return RecipeApplicationResponse(
                success=True,
                message="Recipe applied successfully",
                application_id=application.id,
                environment_sync_status=environment_sync_status,
                applied_at=application.applied_at
            )

        except Exception as e:
            return RecipeApplicationResponse(
                success=False,
                message=f"Failed to apply recipe: {str(e)}",
                application_id=0,
                environment_sync_status="failed",
                applied_at=datetime.utcnow()
            )

    async def get_recipe_application_history(
        self, 
        container_id: int,
        limit: Optional[int] = 50,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[RecipeApplicationHistory]:
        """Get recipe application history for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        applications = await self.recipe_application_repo.get_by_container_id(
            container_id=container_id,
            limit=limit,
            start_date=start_date,
            end_date=end_date
        )

        history = []
        for app in applications:
            history_item = RecipeApplicationHistory(
                id=app.id,
                container_id=app.container_id,
                recipe_version_id=app.recipe_version_id,
                applied_at=app.applied_at,
                applied_by=app.applied_by,
                previous_recipe_version_id=app.previous_recipe_version_id,
                changes_summary=app.changes_summary,
                environment_sync_status=app.environment_sync_status
            )
            history.append(history_item)

        return history

    async def get_available_recipe_versions(
        self, 
        container_id: int,
        crop_type: Optional[str] = None,
        active_only: bool = True
    ) -> List[AvailableRecipeVersion]:
        """Get available recipe versions that can be applied to a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Get recipe versions with optional filtering
        recipe_versions = await self.recipe_version_repo.get_available_versions(
            crop_type=crop_type,
            active_only=active_only
        )

        available_versions = []
        for version in recipe_versions:
            # Get recipe master information
            recipe_master = await self.recipe_master_repo.get(version.recipe_id)
            if not recipe_master:
                continue

            environment_parameters = EnvironmentParameters(
                tray_density=version.tray_density,
                air_temperature=version.air_temperature,
                humidity=version.humidity,
                co2=version.co2,
                water_temperature=version.water_temperature,
                ec=version.ec,
                ph=version.ph,
                water_hours=version.water_hours,
                light_hours=version.light_hours
            )

            available_version = AvailableRecipeVersion(
                recipe_version_id=version.id,
                recipe_id=recipe_master.id,
                recipe_name=recipe_master.name,
                version=version.version,
                crop_type=recipe_master.crop_type,
                valid_from=version.valid_from,
                valid_to=version.valid_to,
                created_by=version.created_by,
                environment_parameters=environment_parameters
            )
            available_versions.append(available_version)

        return available_versions

    async def _calculate_changes_summary(
        self, 
        previous_recipe_version_id: Optional[int], 
        new_recipe_version_id: int
    ) -> Dict[str, Any]:
        """Calculate summary of changes between recipe versions"""
        if not previous_recipe_version_id:
            return {"type": "initial_application", "changes": []}

        previous_version = await self.recipe_version_repo.get(previous_recipe_version_id)
        new_version = await self.recipe_version_repo.get(new_recipe_version_id)

        if not previous_version or not new_version:
            return {"type": "unknown", "changes": []}

        changes = []
        parameters = [
            "tray_density", "air_temperature", "humidity", "co2", 
            "water_temperature", "ec", "ph", "water_hours", "light_hours"
        ]

        for param in parameters:
            old_value = getattr(previous_version, param, None)
            new_value = getattr(new_version, param, None)
            
            if old_value != new_value:
                changes.append({
                    "parameter": param,
                    "old_value": old_value,
                    "new_value": new_value,
                    "change_type": "modified" if old_value is not None else "added"
                })

        return {
            "type": "version_change",
            "previous_version": previous_version.version,
            "new_version": new_version.version,
            "changes": changes,
            "total_changes": len(changes)
        }

    async def _sync_with_environment_system(self, container_id: int, recipe_version) -> bool:
        """Sync recipe application with external environment system"""
        # TODO: Implement actual synchronization with environment control system
        # This would typically involve:
        # 1. Check if container has environment connection
        # 2. Send recipe parameters to environment system API
        # 3. Verify successful application
        # 4. Handle any errors or retries
        
        # For now, mock successful sync
        try:
            # Simulate API call delay and success
            import asyncio
            await asyncio.sleep(0.1)  # Simulate network delay
            return True  # Mock successful sync
        except Exception:
            return False