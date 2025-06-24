from typing import List, Optional
from sqlalchemy.orm import Session

from app.repositories.crop import CropLocationRepository
from app.schemas.crop import CropLocationResponse
from app.core.pagination import PaginationParams, PaginatedResponse


class CropLocationService:
    def __init__(self, db: Session):
        self.db = db
        self.crop_location_repo = CropLocationRepository(db)

    def get_crop_location(self, location_id: int) -> Optional[CropLocationResponse]:
        """Get a crop location by ID."""
        location = self.crop_location_repo.get_by_id(location_id)
        if not location:
            return None
        return CropLocationResponse.model_validate(location)

    def get_all_crop_locations(self, skip: int = 0, limit: int = 100) -> List[CropLocationResponse]:
        """Get all crop locations with offset/limit pagination."""
        locations = self.crop_location_repo.get_all(skip, limit)
        return [CropLocationResponse.model_validate(location) for location in locations]

    def get_all_crop_locations_paginated(self, pagination: PaginationParams) -> PaginatedResponse[CropLocationResponse]:
        """Get all crop locations with pagination."""
        locations, meta = self.crop_location_repo.get_all_paginated(pagination)
        location_responses = [CropLocationResponse.model_validate(location) for location in locations]
        return PaginatedResponse(data=location_responses, meta=meta)

    def create_crop_location(self, location_data: dict) -> CropLocationResponse:
        """Create a new crop location."""
        db_location = self.crop_location_repo.create(location_data)
        return CropLocationResponse.model_validate(db_location)