from typing import Optional, List
from sqlalchemy.orm import Session
from app.repositories.location import LocationRepository
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse
from app.core.pagination import PaginationParams, PaginatedResponse


class LocationService:
    def __init__(self, db: Session):
        self.repository = LocationRepository(db)

    def create_location(self, location_data: LocationCreate) -> LocationResponse:
        db_location = self.repository.create(location_data)
        return LocationResponse.model_validate(db_location)

    def get_location(self, location_id: int) -> Optional[LocationResponse]:
        db_location = self.repository.get_by_id(location_id)
        if not db_location:
            return None
        return LocationResponse.model_validate(db_location)

    def get_locations(self, skip: int = 0, limit: int = 100) -> List[LocationResponse]:
        db_locations = self.repository.get_all(skip=skip, limit=limit)
        return [LocationResponse.model_validate(location) for location in db_locations]
    
    def get_locations_paginated(self, pagination: PaginationParams) -> PaginatedResponse[LocationResponse]:
        """Get paginated locations with metadata."""
        db_locations, meta = self.repository.get_all_paginated(pagination)
        locations = [LocationResponse.model_validate(location) for location in db_locations]
        return PaginatedResponse(data=locations, meta=meta)

    def update_location(
        self, location_id: int, location_data: LocationUpdate
    ) -> Optional[LocationResponse]:
        db_location = self.repository.update(location_id, location_data)
        if not db_location:
            return None
        return LocationResponse.model_validate(db_location)

    def delete_location(self, location_id: int) -> bool:
        return self.repository.delete(location_id)

    def validate_location_exists(self, location_id: int) -> bool:
        return self.repository.get_by_id(location_id) is not None
