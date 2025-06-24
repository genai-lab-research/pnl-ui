from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, func

from app.models.crop import Crop, CropLocation, CropMetrics, CropStatistics
from app.schemas.crop import CropCreate, CropFilter
from app.core.pagination import PaginationParams, PaginationMeta, paginate_query


class CropLocationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, location_data: dict) -> CropLocation:
        db_location = CropLocation(**location_data)
        self.db.add(db_location)
        self.db.flush()
        return db_location

    def get_by_id(self, location_id: int) -> Optional[CropLocation]:
        return self.db.query(CropLocation).filter(CropLocation.id == location_id).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[CropLocation]:
        """Get all crop locations with offset/limit pagination."""
        return self.db.query(CropLocation).offset(skip).limit(limit).all()
    
    def get_all_paginated(self, pagination: PaginationParams) -> Tuple[List[CropLocation], PaginationMeta]:
        """Get all crop locations with pagination metadata."""
        query = self.db.query(CropLocation)
        return paginate_query(query, pagination)


class CropRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_container_id(
        self, 
        container_id: str, 
        filters: Optional[CropFilter] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Crop]:
        query = self.db.query(Crop).options(
            joinedload(Crop.location),
            joinedload(Crop.metrics),
            joinedload(Crop.statistics)
        ).filter(Crop.container_id == container_id)
        
        if filters:
            if filters.seed_type:
                query = query.filter(Crop.seed_type == filters.seed_type)
            if filters.growth_stage:
                query = query.join(Crop.statistics, isouter=True).filter(
                    CropStatistics.growth_stage == filters.growth_stage
                )
            if filters.min_health_score is not None:
                query = query.join(Crop.metrics, isouter=True).filter(
                    CropMetrics.health_score >= filters.min_health_score
                )
            if filters.max_health_score is not None:
                query = query.join(Crop.metrics, isouter=True).filter(
                    CropMetrics.health_score <= filters.max_health_score
                )
        
        return query.offset(skip).limit(limit).all()
    
    def get_by_container_id_paginated(
        self, 
        container_id: str, 
        pagination: PaginationParams,
        filters: Optional[CropFilter] = None
    ) -> Tuple[List[Crop], PaginationMeta]:
        """Get crops by container with pagination."""
        query = self.db.query(Crop).options(
            joinedload(Crop.location),
            joinedload(Crop.metrics),
            joinedload(Crop.statistics)
        ).filter(Crop.container_id == container_id)
        
        if filters:
            if filters.seed_type:
                query = query.filter(Crop.seed_type == filters.seed_type)
            if filters.growth_stage:
                query = query.join(Crop.statistics, isouter=True).filter(
                    CropStatistics.growth_stage == filters.growth_stage
                )
            if filters.min_health_score is not None:
                query = query.join(Crop.metrics, isouter=True).filter(
                    CropMetrics.health_score >= filters.min_health_score
                )
            if filters.max_health_score is not None:
                query = query.join(Crop.metrics, isouter=True).filter(
                    CropMetrics.health_score <= filters.max_health_score
                )
        
        return paginate_query(query, pagination)
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Crop]:
        """Get all crops with offset/limit pagination."""
        return (
            self.db.query(Crop)
            .options(
                joinedload(Crop.location),
                joinedload(Crop.metrics),
                joinedload(Crop.statistics)
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_all_paginated(self, pagination: PaginationParams) -> Tuple[List[Crop], PaginationMeta]:
        """Get all crops with pagination metadata."""
        query = self.db.query(Crop).options(
            joinedload(Crop.location),
            joinedload(Crop.metrics),
            joinedload(Crop.statistics)
        )
        return paginate_query(query, pagination)

    def get_by_id(self, crop_id: str) -> Optional[Crop]:
        return self.db.query(Crop).options(
            joinedload(Crop.location),
            joinedload(Crop.metrics),
            joinedload(Crop.statistics)
        ).filter(Crop.id == crop_id).first()

    def create(self, crop_data: CropCreate) -> Crop:
        location_repo = CropLocationRepository(self.db)
        
        location_dict = crop_data.location.model_dump()
        db_location = location_repo.create(location_dict)
        
        crop_dict = crop_data.model_dump(exclude={'location'})
        crop_dict['location_id'] = db_location.id
        
        db_crop = Crop(**crop_dict)
        self.db.add(db_crop)
        self.db.flush()
        return db_crop

    def update(self, crop_id: str, crop_data: dict) -> Optional[Crop]:
        db_crop = self.get_by_id(crop_id)
        if not db_crop:
            return None
        
        for field, value in crop_data.items():
            if hasattr(db_crop, field):
                setattr(db_crop, field, value)
        
        self.db.flush()
        return db_crop

    def delete(self, crop_id: str) -> bool:
        db_crop = self.get_by_id(crop_id)
        if not db_crop:
            return False
        
        self.db.delete(db_crop)
        self.db.flush()
        return True