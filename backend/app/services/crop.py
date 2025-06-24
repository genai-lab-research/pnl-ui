from typing import List, Optional
from sqlalchemy.orm import Session

from app.repositories.crop import CropRepository
from app.repositories.container import ContainerRepository
from app.schemas.crop import (
    CropCreate, CropResponse, CropFilter, CropDetailedResponse,
    CropMetricsCreate, CropMetricsResponse, CropStatisticsCreate, CropStatisticsResponse
)
from app.core.pagination import PaginationParams, PaginatedResponse
from app.models.crop import CropMetrics, CropStatistics


class CropService:
    def __init__(self, db: Session):
        self.db = db
        self.crop_repo = CropRepository(db)
        self.container_repo = ContainerRepository(db)

    def get_crops_by_container(
        self, 
        container_id: str, 
        filters: Optional[CropFilter] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[CropResponse]:
        container = self.container_repo.get_by_id(container_id)
        if not container:
            raise ValueError(f"Container with id {container_id} not found")
        
        crops = self.crop_repo.get_by_container_id(container_id, filters, skip, limit)
        return [CropResponse.model_validate(crop) for crop in crops]
    
    def get_crops_by_container_paginated(
        self, 
        container_id: str, 
        pagination: PaginationParams,
        filters: Optional[CropFilter] = None
    ) -> PaginatedResponse[CropResponse]:
        """Get crops by container with pagination."""
        container = self.container_repo.get_by_id(container_id)
        if not container:
            raise ValueError(f"Container with id {container_id} not found")
        
        crops, meta = self.crop_repo.get_by_container_id_paginated(container_id, pagination, filters)
        crop_responses = [CropResponse.model_validate(crop) for crop in crops]
        return PaginatedResponse(data=crop_responses, meta=meta)
    
    def get_all_crops(self, skip: int = 0, limit: int = 100) -> List[CropResponse]:
        """Get all crops with offset/limit pagination."""
        crops = self.crop_repo.get_all(skip, limit)
        return [CropResponse.model_validate(crop) for crop in crops]
    
    def get_all_crops_paginated(self, pagination: PaginationParams) -> PaginatedResponse[CropResponse]:
        """Get all crops with pagination."""
        crops, meta = self.crop_repo.get_all_paginated(pagination)
        crop_responses = [CropResponse.model_validate(crop) for crop in crops]
        return PaginatedResponse(data=crop_responses, meta=meta)

    def get_crop(self, crop_id: str) -> Optional[CropResponse]:
        crop = self.crop_repo.get_by_id(crop_id)
        if not crop:
            return None
        return CropResponse.model_validate(crop)
    
    def get_crop_detailed(self, crop_id: str) -> Optional[CropDetailedResponse]:
        """Get detailed crop information including metrics and statistics."""
        crop = self.crop_repo.get_by_id(crop_id)
        if not crop:
            return None
        
        # Get recent metrics (last 30 days)
        recent_metrics = self.get_crop_recent_metrics(crop_id)
        metrics_history = self.get_crop_metrics_history(crop_id)
        
        crop_dict = crop.__dict__.copy()
        crop_dict['recent_metrics'] = recent_metrics
        crop_dict['metrics_history'] = metrics_history
        
        return CropDetailedResponse.model_validate(crop_dict)

    def create_crop(self, crop_data: CropCreate) -> CropResponse:
        container = self.container_repo.get_by_id(crop_data.container_id)
        if not container:
            raise ValueError(f"Container with id {crop_data.container_id} not found")
        
        existing_crop = self.crop_repo.get_by_id(crop_data.id)
        if existing_crop:
            raise ValueError(f"Crop with id {crop_data.id} already exists")
        
        db_crop = self.crop_repo.create(crop_data)
        return CropResponse.model_validate(db_crop)

    def update_crop(self, crop_id: str, crop_data: dict) -> Optional[CropResponse]:
        db_crop = self.crop_repo.update(crop_id, crop_data)
        if not db_crop:
            return None
        return CropResponse.model_validate(db_crop)

    def delete_crop(self, crop_id: str) -> bool:
        return self.crop_repo.delete(crop_id)
    
    def get_crop_by_container_and_id(self, container_id: str, crop_id: str) -> Optional[CropResponse]:
        """Get a crop by ID and validate it belongs to the specified container."""
        container = self.container_repo.get_by_id(container_id)
        if not container:
            raise ValueError(f"Container with id {container_id} not found")
        
        crop = self.crop_repo.get_by_id(crop_id)
        if not crop:
            return None
            
        if crop.container_id != container_id:
            raise ValueError(f"Crop {crop_id} does not belong to container {container_id}")
            
        return CropResponse.model_validate(crop)
    
    # Crop Metrics Methods
    def add_crop_metrics(self, metrics_data: CropMetricsCreate) -> CropMetricsResponse:
        """Add new metrics data for a crop."""
        crop = self.crop_repo.get_by_id(metrics_data.crop_id)
        if not crop:
            raise ValueError(f"Crop with id {metrics_data.crop_id} not found")
        
        metrics = CropMetrics(
            crop_id=metrics_data.crop_id,
            recorded_at=metrics_data.recorded_at,
            height_cm=metrics_data.height_cm,
            leaf_count=metrics_data.leaf_count,
            stem_diameter_mm=metrics_data.stem_diameter_mm,
            leaf_area_cm2=metrics_data.leaf_area_cm2,
            biomass_g=metrics_data.biomass_g,
            health_score=metrics_data.health_score,
            disease_detected=metrics_data.disease_detected,
            pest_detected=metrics_data.pest_detected,
            stress_level=metrics_data.stress_level,
            temperature_c=metrics_data.temperature_c,
            humidity_percent=metrics_data.humidity_percent,
            light_intensity_umol=metrics_data.light_intensity_umol,
            ph_level=metrics_data.ph_level,
            ec_level=metrics_data.ec_level,
            nitrogen_ppm=metrics_data.nitrogen_ppm,
            phosphorus_ppm=metrics_data.phosphorus_ppm,
            potassium_ppm=metrics_data.potassium_ppm,
            calcium_ppm=metrics_data.calcium_ppm,
            magnesium_ppm=metrics_data.magnesium_ppm
        )
        
        self.db.add(metrics)
        self.db.commit()
        self.db.refresh(metrics)
        
        return CropMetricsResponse.model_validate(metrics)
    
    def get_crop_metrics_history(self, crop_id: str, limit: int = 100) -> List[CropMetricsResponse]:
        """Get historical metrics for a crop."""
        metrics = self.db.query(CropMetrics).filter(
            CropMetrics.crop_id == crop_id
        ).order_by(CropMetrics.recorded_at.desc()).limit(limit).all()
        
        return [CropMetricsResponse.model_validate(m) for m in metrics]
    
    def get_crop_recent_metrics(self, crop_id: str) -> Optional[CropMetricsResponse]:
        """Get the most recent metrics for a crop."""
        metrics = self.db.query(CropMetrics).filter(
            CropMetrics.crop_id == crop_id
        ).order_by(CropMetrics.recorded_at.desc()).first()
        
        if metrics:
            return CropMetricsResponse.model_validate(metrics)
        return None
    
    # Crop Statistics Methods
    def update_crop_statistics(self, stats_data: CropStatisticsCreate) -> CropStatisticsResponse:
        """Update or create crop statistics."""
        crop = self.crop_repo.get_by_id(stats_data.crop_id)
        if not crop:
            raise ValueError(f"Crop with id {stats_data.crop_id} not found")
        
        # Check if statistics already exist
        existing_stats = self.db.query(CropStatistics).filter(
            CropStatistics.crop_id == stats_data.crop_id
        ).first()
        
        if existing_stats:
            # Update existing statistics
            for field, value in stats_data.model_dump(exclude_unset=True, exclude={'crop_id'}).items():
                setattr(existing_stats, field, value)
            
            self.db.commit()
            self.db.refresh(existing_stats)
            return CropStatisticsResponse.model_validate(existing_stats)
        else:
            # Create new statistics
            stats = CropStatistics(**stats_data.model_dump())
            self.db.add(stats)
            self.db.commit()
            self.db.refresh(stats)
            return CropStatisticsResponse.model_validate(stats)
    
    def get_crop_statistics(self, crop_id: str) -> Optional[CropStatisticsResponse]:
        """Get statistics for a crop."""
        stats = self.db.query(CropStatistics).filter(
            CropStatistics.crop_id == crop_id
        ).first()
        
        if stats:
            return CropStatisticsResponse.model_validate(stats)
        return None
    
    def calculate_crop_statistics(self, crop_id: str) -> Optional[CropStatisticsResponse]:
        """Calculate and update crop statistics based on historical metrics data."""
        crop = self.crop_repo.get_by_id(crop_id)
        if not crop:
            return None
        
        # Get all metrics for this crop
        metrics = self.db.query(CropMetrics).filter(
            CropMetrics.crop_id == crop_id
        ).order_by(CropMetrics.recorded_at.asc()).all()
        
        if not metrics:
            return None
        
        # Calculate growth statistics
        heights = [m.height_cm for m in metrics if m.height_cm is not None]
        max_height = max(heights) if heights else None
        
        # Calculate daily growth rate
        avg_growth_rate = None
        if len(heights) > 1:
            first_height = heights[0]
            last_height = heights[-1]
            first_date = next(m.recorded_at for m in metrics if m.height_cm == first_height)
            last_date = next(m.recorded_at for m in metrics if m.height_cm == last_height)
            days_diff = (last_date - first_date).days
            if days_diff > 0:
                avg_growth_rate = (last_height - first_height) / days_diff
        
        # Calculate health trends
        health_scores = [m.health_score for m in metrics if m.health_score is not None]
        health_trend = "stable"
        if len(health_scores) >= 3:
            recent_avg = sum(health_scores[-3:]) / 3
            earlier_avg = sum(health_scores[:3]) / 3
            if recent_avg > earlier_avg + 5:
                health_trend = "improving"
            elif recent_avg < earlier_avg - 5:
                health_trend = "declining"
        
        # Create statistics data
        stats_data = CropStatisticsCreate(
            crop_id=crop_id,
            avg_daily_growth_rate=avg_growth_rate,
            max_recorded_height=max_height,
            total_leaf_count=max([m.leaf_count for m in metrics if m.leaf_count is not None], default=None),
            overall_health_trend=health_trend,
            survival_rate=95.0,  # Default value, can be calculated based on actual data
            resource_efficiency=85.0,  # Default value, can be calculated based on actual data
        )
        
        return self.update_crop_statistics(stats_data)