"""Event tracking service for container operations."""

import logging
from typing import Optional, Dict, Any
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request

from app.repositories.container import ContainerRepository
from app.schemas.container import ActivityLogCreate

logger = logging.getLogger(__name__)


class EventTracker:
    """Service for tracking container events and operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ContainerRepository(db)

    async def track_container_creation(
        self, 
        container_id: int, 
        container_name: str,
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container creation event."""
        try:
            activity_data = ActivityLogCreate(
                action_type="container_created",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=f"Container '{container_name}' was created"
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked container creation event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track container creation event: {e}")

    async def track_container_update(
        self, 
        container_id: int, 
        container_name: str,
        old_container: Dict[str, Any],
        new_changes: Dict[str, Any],
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container update event - only log fields that actually changed."""
        try:
            change_descriptions = []
            
            # Only process fields that actually changed
            for field, new_value in new_changes.items():
                # Skip None values (fields that weren't updated)
                if new_value is None:
                    continue
                    
                # Get the old value for comparison
                old_value = getattr(old_container, field, None)
                
                # Skip if values are the same
                if old_value == new_value:
                    continue
                
                # Create human-readable descriptions for actual changes
                if field == 'name':
                    change_descriptions.append(f"Name changed from '{old_value}' to '{new_value}'")
                elif field == 'type':
                    change_descriptions.append(f"Type changed from '{old_value}' to '{new_value}'")
                elif field == 'purpose':
                    change_descriptions.append(f"Purpose changed from '{old_value}' to '{new_value}'")
                elif field == 'status':
                    change_descriptions.append(f"Status changed from '{old_value}' to '{new_value}'")
                elif field == 'tenant_id':
                    change_descriptions.append(f"Tenant changed")
                elif field == 'notes':
                    change_descriptions.append("Notes updated")
                elif field == 'shadow_service_enabled':
                    action = 'enabled' if new_value else 'disabled'
                    change_descriptions.append(f"Shadow service {action}")
                elif field == 'ecosystem_connected':
                    action = 'enabled' if new_value else 'disabled'
                    change_descriptions.append(f"Ecosystem connection {action}")
                elif field == 'robotics_simulation_enabled':
                    action = 'enabled' if new_value else 'disabled'
                    change_descriptions.append(f"Robotics simulation {action}")
                elif field == 'location':
                    change_descriptions.append("Location updated")
                elif field == 'ecosystem_settings':
                    change_descriptions.append("Ecosystem settings updated")
            
            # Only create an activity log if there are actual changes
            if not change_descriptions:
                logger.debug(f"No actual changes detected for container {container_id}, skipping event log")
                return
            
            description = f"Container '{container_name}' updated: {', '.join(change_descriptions)}"
            
            activity_data = ActivityLogCreate(
                action_type="container_updated",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=description
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked container update event for container {container_id}: {', '.join(change_descriptions)}")
            
        except Exception as e:
            logger.error(f"Failed to track container update event: {e}")

    async def track_container_deletion(
        self, 
        container_id: int, 
        container_name: str,
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container deletion event."""
        try:
            activity_data = ActivityLogCreate(
                action_type="container_deleted",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=f"Container '{container_name}' was deleted"
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked container deletion event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track container deletion event: {e}")

    async def track_container_shutdown(
        self, 
        container_id: int, 
        container_name: str,
        reason: Optional[str] = None,
        force: bool = False,
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container shutdown event."""
        try:
            description = f"Container '{container_name}' was shut down"
            if reason:
                description += f" - Reason: {reason}"
            if force:
                description += " (forced shutdown)"
            
            activity_data = ActivityLogCreate(
                action_type="container_shutdown",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=description
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked container shutdown event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track container shutdown event: {e}")

    async def track_container_status_change(
        self, 
        container_id: int, 
        container_name: str,
        old_status: str,
        new_status: str,
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container status change event."""
        try:
            activity_data = ActivityLogCreate(
                action_type="status_changed",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=f"Container '{container_name}' status changed from '{old_status}' to '{new_status}'"
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked status change event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track container status change event: {e}")

    async def track_settings_change(
        self, 
        container_id: int, 
        container_name: str,
        settings_changed: Dict[str, Any],
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track container settings change event."""
        try:
            settings_descriptions = []
            for setting, value in settings_changed.items():
                if isinstance(value, bool):
                    settings_descriptions.append(f"{setting} {'enabled' if value else 'disabled'}")
                else:
                    settings_descriptions.append(f"{setting} updated")
            
            description = f"Container '{container_name}' settings changed: {', '.join(settings_descriptions)}"
            
            activity_data = ActivityLogCreate(
                action_type="settings_changed",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=description
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked settings change event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track container settings change event: {e}")

    async def track_environment_link_change(
        self, 
        container_id: int, 
        container_name: str,
        link_changes: Dict[str, Any],
        user_info: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ) -> None:
        """Track environment link change event."""
        try:
            description = f"Container '{container_name}' environment links updated"
            
            activity_data = ActivityLogCreate(
                action_type="environment_links_updated",
                actor_type="user" if user_info else "system",
                actor_id=user_info.get("username", "system") if user_info else "system",
                description=description
            )
            
            await self.repository.create_activity_log(container_id, activity_data.model_dump())
            logger.info(f"Tracked environment link change event for container {container_id}")
            
        except Exception as e:
            logger.error(f"Failed to track environment link change event: {e}")

    def _extract_user_info(self, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant user information for event tracking."""
        return {
            "username": current_user.get("username", "unknown_user"),
            "user_id": current_user.get("user_id", "unknown")
        }