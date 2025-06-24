from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.container import AsyncContainerRepository
from app.repositories.location import AsyncLocationRepository
from app.core.exceptions import ResourceConflictError, ResourceNotFoundError, CustomValidationError
from app.schemas.container import ContainerCreateRequest, ContainerCreate, ContainerUpdate, ContainerResponse, ContainerFilter
from app.core.pagination import PaginationParams, PaginatedResponse


class ContainerService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.container_repo = AsyncContainerRepository(db)
        self.location_repo = AsyncLocationRepository(db)

    async def create_container(self, container_request: ContainerCreateRequest) -> Optional[ContainerResponse]:
        import uuid
        
        # Generate unique container ID
        container_id = str(uuid.uuid4())
        
        # Check if container with same name already exists for this tenant
        existing_container = await self.container_repo.get_by_name_and_tenant(container_request.name, container_request.tenant)
        if existing_container:
            raise ResourceConflictError(
                "Container",
                f"Container with name '{container_request.name}' already exists for tenant '{container_request.tenant}'"
            )

        # Validate location string
        if not container_request.location or not container_request.location.strip():
            raise CustomValidationError("location", container_request.location, "Location cannot be empty")

        # Find or create location based on location string
        location_parts = container_request.location.split(', ')
        city = location_parts[0].strip() if location_parts else container_request.location.strip()
        country = location_parts[1].strip() if len(location_parts) > 1 else "Unknown"

        # Try to find existing location
        location = await self.location_repo.get_by_city_and_country(city, country)
        if not location:
            # Create new location
            from app.schemas.location import LocationCreate
            location_data = LocationCreate(city=city, country=country, address=container_request.location)
            location = await self.location_repo.create(location_data)

        # Create container with the found/created location
        container_data = ContainerCreate(
            id=container_id,
            name=container_request.name,
            tenant=container_request.tenant,
            type=container_request.type,
            purpose=container_request.purpose,
            location_id=location.id,
            status="created",  # Default status
            seed_types=container_request.seed_types,
            has_alert=False,
            notes=container_request.notes,
            shadow_service_enabled=container_request.shadow_service_enabled,
            ecosystem_connected=container_request.connect_to_other_systems
        )

        db_container = await self.container_repo.create(container_data)
        await self.db.commit()
        return ContainerResponse.model_validate(db_container)

    async def get_container(self, container_id: str) -> Optional[ContainerResponse]:
        db_container = await self.container_repo.get_by_id(container_id)
        if not db_container:
            return None
        return ContainerResponse.model_validate(db_container)

    async def get_containers(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        filters: Optional[ContainerFilter] = None
    ) -> List[ContainerResponse]:
        db_containers = await self.container_repo.get_all(skip=skip, limit=limit, filters=filters)
        return [ContainerResponse.model_validate(container) for container in db_containers]
    
    async def get_containers_paginated(
        self, 
        pagination: PaginationParams,
        filters: Optional[ContainerFilter] = None
    ) -> PaginatedResponse[ContainerResponse]:
        db_containers, meta = await self.container_repo.get_all_paginated(pagination, filters)
        containers = [ContainerResponse.model_validate(container) for container in db_containers]
        return PaginatedResponse(data=containers, meta=meta)

    async def update_container(
        self, container_id: str, container_data: ContainerUpdate
    ) -> Optional[ContainerResponse]:
        if container_data.location_id and not await self.location_repo.get_by_id(container_data.location_id):
            raise ResourceNotFoundError("Location", str(container_data.location_id))

        db_container = await self.container_repo.update(container_id, container_data)
        if not db_container:
            raise ResourceNotFoundError("Container", container_id)
        
        await self.db.commit()
        return ContainerResponse.model_validate(db_container)

    async def delete_container(self, container_id: str) -> bool:
        success = await self.container_repo.delete(container_id)
        if not success:
            raise ResourceNotFoundError("Container", container_id)
        
        await self.db.commit()
        return success

    async def get_containers_by_tenant(self, tenant: str) -> List[ContainerResponse]:
        db_containers = await self.container_repo.get_by_tenant(tenant)
        return [ContainerResponse.model_validate(container) for container in db_containers]

    async def get_containers_with_alerts(self) -> List[ContainerResponse]:
        db_containers = await self.container_repo.get_with_alerts()
        return [ContainerResponse.model_validate(container) for container in db_containers]
        
    async def validate_container_exists(self, container_id: str) -> bool:
        db_container = await self.container_repo.get_by_id(container_id)
        return db_container is not None
