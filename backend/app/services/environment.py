from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.environment_link import EnvironmentLinkRepository
from app.repositories.container import ContainerRepository
from app.repositories.recipe_version import RecipeVersionRepository
from app.repositories.recipe_application import RecipeApplicationRepository
from app.schemas.environment import (
    EnvironmentStatus, EnvironmentLinksResponse, EnvironmentLinksUpdate,
    EnvironmentLinksUpdateResponse, IframeUrlResponse, ExternalUrlResponse,
    EnvironmentConnectionRequest, EnvironmentConnectionResponse,
    EnvironmentSystemHealth, SessionRefreshResponse, PlaceholderState,
    ConnectionDetails, ContainerContext, MaintenanceWindow
)
from app.core.exceptions import NotFoundException, ValidationException


class EnvironmentService:
    """Service layer for environment management operations"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.environment_repo = EnvironmentLinkRepository(db)
        self.container_repo = ContainerRepository(db)
        self.recipe_version_repo = RecipeVersionRepository(db)
        self.recipe_application_repo = RecipeApplicationRepository(db)

    async def get_environment_status(self, container_id: int) -> EnvironmentStatus:
        """Get environment system connection status for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        environment_link = await self.environment_repo.get_by_container_id(container_id)
        
        if not environment_link:
            return EnvironmentStatus(
                is_connected=False,
                environment_system=None,
                iframe_url=None,
                external_url=None,
                last_sync=None,
                connection_details=None
            )

        # Check if any environment is configured
        has_connection = await self.environment_repo.has_environment_connection(container_id)
        
        if not has_connection:
            return EnvironmentStatus(
                is_connected=False,
                environment_system=None,
                iframe_url=None,
                external_url=None,
                last_sync=None,
                connection_details=None
            )

        # Determine environment system (prioritize FarmHand)
        environment_system = "farmhand" if environment_link.fh else "unknown"
        
        # Generate URLs (mock implementation - replace with actual URL generation logic)
        iframe_url = self._generate_iframe_url(container_id, environment_system)
        external_url = self._generate_external_url(container_id, environment_system)

        connection_details = ConnectionDetails(
            fa=environment_link.fa,
            pya=environment_link.pya,
            aws=environment_link.aws,
            mbai=environment_link.mbai,
            fh=environment_link.fh,
            system_version="1.0.0"  # Mock version
        )

        return EnvironmentStatus(
            is_connected=True,
            environment_system=environment_system,
            iframe_url=iframe_url,
            external_url=external_url,
            last_sync=datetime.utcnow(),  # Mock last sync
            connection_details=connection_details
        )

    async def get_environment_links(self, container_id: int) -> EnvironmentLinksResponse:
        """Get environment links for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        environment_link = await self.environment_repo.get_by_container_id(container_id)
        
        if not environment_link:
            return EnvironmentLinksResponse(
                container_id=container_id,
                fa=None,
                pya=None,
                aws=None,
                mbai=None,
                fh=None
            )

        return EnvironmentLinksResponse(
            container_id=container_id,
            fa=environment_link.fa,
            pya=environment_link.pya,
            aws=environment_link.aws,
            mbai=environment_link.mbai,
            fh=environment_link.fh
        )

    async def update_environment_links(
        self, 
        container_id: int, 
        update_data: EnvironmentLinksUpdate
    ) -> EnvironmentLinksUpdateResponse:
        """Update environment links for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        try:
            await self.environment_repo.update_environment_config(
                container_id=container_id,
                fa=update_data.fa,
                pya=update_data.pya,
                aws=update_data.aws,
                mbai=update_data.mbai,
                fh=update_data.fh
            )

            return EnvironmentLinksUpdateResponse(
                success=True,
                message="Environment links updated successfully",
                updated_at=datetime.utcnow()
            )
        except Exception as e:
            return EnvironmentLinksUpdateResponse(
                success=False,
                message=f"Failed to update environment links: {str(e)}",
                updated_at=datetime.utcnow()
            )

    async def get_iframe_url(
        self, 
        container_id: int, 
        tab: Optional[str] = None,
        refresh: Optional[bool] = False
    ) -> IframeUrlResponse:
        """Generate FarmHand iframe URL for container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Check if environment is connected
        has_connection = await self.environment_repo.has_environment_connection(container_id)
        if not has_connection:
            raise ValidationException("Container is not connected to an environment system")

        iframe_url = self._generate_iframe_url(container_id, "farmhand", tab)
        
        return IframeUrlResponse(
            iframe_url=iframe_url,
            expires_at=datetime.utcnow() + timedelta(hours=8),
            permissions=["read", "write", "control"],  # Mock permissions
            container_context=ContainerContext(
                container_id=container_id,
                environment_id=f"env_{container_id}"
            )
        )

    async def get_external_url(
        self, 
        container_id: int, 
        tab: Optional[str] = None
    ) -> ExternalUrlResponse:
        """Generate FarmHand external URL for container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Check if environment is connected
        has_connection = await self.environment_repo.has_environment_connection(container_id)
        if not has_connection:
            raise ValidationException("Container is not connected to an environment system")

        external_url = self._generate_external_url(container_id, "farmhand", tab)
        
        return ExternalUrlResponse(
            external_url=external_url,
            expires_at=datetime.utcnow() + timedelta(hours=8),
            session_token=f"session_{container_id}_{datetime.utcnow().timestamp()}"
        )

    async def initialize_environment_connection(
        self, 
        container_id: int, 
        connection_request: EnvironmentConnectionRequest
    ) -> EnvironmentConnectionResponse:
        """Initialize environment system connection for a container"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        try:
            # Create or update environment links
            await self.environment_repo.update_environment_config(
                container_id=container_id,
                fa=connection_request.fa,
                pya=connection_request.pya,
                aws=connection_request.aws,
                mbai=connection_request.mbai,
                fh=connection_request.fh
            )

            # Generate initial URLs
            iframe_url = self._generate_iframe_url(container_id, connection_request.environment_system)
            external_url = self._generate_external_url(container_id, connection_request.environment_system)

            return EnvironmentConnectionResponse(
                success=True,
                message="Environment connection initialized successfully",
                connection_id=f"conn_{container_id}_{datetime.utcnow().timestamp()}",
                iframe_url=iframe_url,
                external_url=external_url,
                estimated_setup_time=5  # 5 minutes estimate
            )
        except Exception as e:
            return EnvironmentConnectionResponse(
                success=False,
                message=f"Failed to initialize environment connection: {str(e)}",
                connection_id=None,
                iframe_url=None,
                external_url=None,
                estimated_setup_time=None
            )

    async def get_system_health(self, container_id: int) -> EnvironmentSystemHealth:
        """Get health status of the connected environment system"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Check if environment is connected
        has_connection = await self.environment_repo.has_environment_connection(container_id)
        if not has_connection:
            raise ValidationException("Container is not connected to an environment system")

        # Mock health status - replace with actual health check logic
        return EnvironmentSystemHealth(
            status="healthy",
            last_heartbeat=datetime.utcnow(),
            response_time_ms=150.5,
            system_version="1.2.3",
            features_available=["environment_control", "recipe_management", "monitoring"],
            maintenance_window=MaintenanceWindow(
                scheduled=False,
                start_time=None,
                end_time=None,
                reason=None
            )
        )

    async def refresh_session(self, container_id: int) -> SessionRefreshResponse:
        """Refresh environment system session"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        # Check if environment is connected
        has_connection = await self.environment_repo.has_environment_connection(container_id)
        if not has_connection:
            raise ValidationException("Container is not connected to an environment system")

        try:
            # Generate new URLs
            iframe_url = self._generate_iframe_url(container_id, "farmhand")
            external_url = self._generate_external_url(container_id, "farmhand")

            return SessionRefreshResponse(
                success=True,
                new_iframe_url=iframe_url,
                new_external_url=external_url,
                expires_at=datetime.utcnow() + timedelta(hours=8),
                session_id=f"session_{container_id}_{datetime.utcnow().timestamp()}"
            )
        except Exception as e:
            return SessionRefreshResponse(
                success=False,
                new_iframe_url=None,
                new_external_url=None,
                expires_at=None,
                session_id=None
            )

    async def get_placeholder_state(self, container_id: int, user_permissions: List[str]) -> PlaceholderState:
        """Get placeholder state for unconnected containers"""
        # Verify container exists
        container = await self.container_repo.get(container_id)
        if not container:
            raise NotFoundException(f"Container {container_id} not found")

        can_connect = "environment_connect" in user_permissions
        connection_options = ["farmhand"] if can_connect else None

        return PlaceholderState(
            message="This container is not yet connected to an environment control system.",
            can_connect=can_connect,
            connection_options=connection_options
        )

    def _generate_iframe_url(self, container_id: int, environment_system: str, tab: Optional[str] = None) -> str:
        """Generate iframe URL - replace with actual URL generation logic"""
        base_url = f"https://{environment_system}.example.com/embed"
        params = f"container_id={container_id}"
        if tab:
            params += f"&tab={tab}"
        return f"{base_url}?{params}"

    def _generate_external_url(self, container_id: int, environment_system: str, tab: Optional[str] = None) -> str:
        """Generate external URL - replace with actual URL generation logic"""
        base_url = f"https://{environment_system}.example.com/container"
        params = f"container_id={container_id}"
        if tab:
            params += f"&tab={tab}"
        return f"{base_url}?{params}"