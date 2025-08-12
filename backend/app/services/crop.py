"""Crop service for business logic."""

from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.crop import CropRepository
from app.repositories.crop_history import CropHistoryRepository
from app.repositories.crop_snapshot import CropSnapshotRepository
from app.repositories.crop_measurement import CropMeasurementRepository
from app.schemas.crop import (
    CropTimelapse, CropMetadata, LifecycleMilestones, TimelapseFrame,
    GrowthMetrics, EnvironmentalMetrics, CropHistoryEntry, 
    GrowthChartData, GrowthDataPoint, MetricDefinitions, MetricDefinition,
    NotesUpdateResponse, CropMeasurementUpdate, CropSnapshot, CropSnapshotCreate
)
from app.schemas.recipe import (
    CropCreate, 
    CropUpdate, 
    CropFilterCriteria,
    CropHistoryCreate,
    CropSnapshotFilterCriteria,
    CropMeasurementCreate
)
from app.models.crop import Crop


class CropService:
    """Service for crop business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.crop_repo = CropRepository(db)
        self.history_repo = CropHistoryRepository(db)
        self.snapshot_repo = CropSnapshotRepository(db)
        self.measurement_repo = CropMeasurementRepository(db)
    
    async def get_all_crops(self, criteria: CropFilterCriteria) -> Dict[str, Any]:
        """Get all crops with filtering and pagination."""
        crops = await self.crop_repo.get_filtered(criteria)
        total_count = await self.crop_repo.get_count_filtered(criteria)
        
        return {
            "crops": crops,
            "total_count": total_count,
            "page": criteria.page,
            "limit": criteria.limit,
            "total_pages": (total_count + criteria.limit - 1) // criteria.limit
        }
    
    async def get_crop_by_id(self, crop_id: int) -> Optional[Crop]:
        """Get crop by ID with all relationships."""
        crop = await self.crop_repo.get_with_relationships(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        return crop
    
    async def create_crop(self, crop_data: CropCreate) -> Crop:
        """Create a new crop."""
        # Validate crop data
        await self._validate_crop_data(crop_data)
        
        # Create crop
        crop = await self.crop_repo.create(crop_data)
        
        # Create initial history entry
        if crop:
            history_data = CropHistoryCreate(
                event="Crop created",
                performed_by="system",
                notes=f"Crop created with lifecycle status: {crop.lifecycle_status or 'not specified'}"
            )
            await self.history_repo.create_history_entry(crop.id, history_data)
        
        return crop
    
    async def update_crop(self, crop_id: int, crop_data: CropUpdate) -> Optional[Crop]:
        """Update an existing crop."""
        # Check if crop exists
        existing_crop = await self.crop_repo.get(crop_id)
        if not existing_crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Validate crop data
        await self._validate_crop_data(crop_data)
        
        # Track changes for history
        changes = []
        update_dict = crop_data.model_dump(exclude_unset=True)
        
        for field, new_value in update_dict.items():
            old_value = getattr(existing_crop, field)
            if old_value != new_value:
                changes.append(f"{field}: {old_value} -> {new_value}")
        
        # Update crop
        updated_crop = await self.crop_repo.update(crop_id, crop_data)
        
        # Create history entry if there were changes
        if changes and updated_crop:
            history_data = CropHistoryCreate(
                event="Crop updated",
                performed_by="system",
                notes=f"Fields updated: {', '.join(changes)}"
            )
            await self.history_repo.create_history_entry(crop_id, history_data)
        
        return updated_crop
    
    async def delete_crop(self, crop_id: int) -> bool:
        """Delete a crop and all its related data."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Delete related data
        await self.history_repo.delete_by_crop_id(crop_id)
        await self.snapshot_repo.delete_by_crop_id(crop_id)
        
        # Delete crop
        success = await self.crop_repo.delete(crop_id)
        
        return success
    
    async def get_crop_history(self, crop_id: int) -> List:
        """Get history for a specific crop."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        history = await self.history_repo.get_by_crop_id(crop_id)
        return history
    
    async def add_crop_history(self, crop_id: int, history_data: CropHistoryCreate):
        """Add a new history entry for a crop."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Create history entry
        history = await self.history_repo.create_history_entry(crop_id, history_data)
        return history
    
    async def get_crop_snapshots(self, crop_id: int, criteria: CropSnapshotFilterCriteria) -> List:
        """Get snapshots for a specific crop."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        snapshots = await self.snapshot_repo.get_filtered(crop_id, criteria)
        return snapshots
    
    async def create_crop_snapshot(self, crop_id: int, snapshot_data: CropSnapshotCreate):
        """Create a new snapshot for a crop."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Create snapshot
        snapshot = await self.snapshot_repo.create_snapshot(crop_id, snapshot_data)
        
        # Create history entry
        history_data = CropHistoryCreate(
            event="Snapshot created",
            performed_by="system",
            notes=f"Snapshot created with lifecycle status: {snapshot.lifecycle_status or 'not specified'}"
        )
        await self.history_repo.create_history_entry(crop_id, history_data)
        
        return snapshot
    
    async def create_crop_measurement(self, measurement_data: CropMeasurementCreate):
        """Create a new crop measurement."""
        # Create measurement
        measurement = await self.measurement_repo.create_measurement(measurement_data)
        return measurement
    
    async def get_crop_measurement(self, measurement_id: int):
        """Get crop measurement by ID."""
        measurement = await self.measurement_repo.get_by_id(measurement_id)
        if not measurement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Measurement with ID {measurement_id} not found"
            )
        return measurement
    
    async def _validate_crop_data(self, crop_data: CropCreate) -> None:
        """Validate crop data."""
        # Validate dates
        if crop_data.seed_date and crop_data.transplanting_date_planned:
            if crop_data.seed_date > crop_data.transplanting_date_planned:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Seed date must be before planned transplanting date"
                )
        
        if crop_data.transplanting_date_planned and crop_data.harvesting_date_planned:
            if crop_data.transplanting_date_planned > crop_data.harvesting_date_planned:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Planned transplanting date must be before planned harvesting date"
                )
        
        if crop_data.transplanting_date and crop_data.harvesting_date_planned:
            if crop_data.transplanting_date > crop_data.harvesting_date_planned:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Transplanting date must be before planned harvesting date"
                )
        
        # Validate foreign keys exist
        if crop_data.seed_type_id:
            from app.repositories.seed_type import SeedTypeRepository
            seed_type_repo = SeedTypeRepository(self.db)
            seed_type = await seed_type_repo.get(crop_data.seed_type_id)
            if not seed_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Seed type with ID {crop_data.seed_type_id} not found"
                )
        
        if crop_data.recipe_version_id:
            from app.repositories.recipe_version import RecipeVersionRepository
            version_repo = RecipeVersionRepository(self.db)
            version = await version_repo.get(crop_data.recipe_version_id)
            if not version:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Recipe version with ID {crop_data.recipe_version_id} not found"
                )
    
    async def get_crop_timelapse_data(self, crop_id: int) -> CropTimelapse:
        """Get comprehensive timelapse data for a specific crop."""
        # Get crop with relationships
        crop = await self.crop_repo.get_with_relationships(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Build crop metadata
        crop_metadata = CropMetadata(
            id=crop.id,
            seed_type_id=crop.seed_type_id,
            seed_type=crop.seed_type.name if crop.seed_type else "Unknown",
            variety=crop.seed_type.variety if crop.seed_type else None,
            supplier=crop.seed_type.supplier if crop.seed_type else None,
            batch_id=crop.seed_type.batch_id if crop.seed_type else None,
            location=crop.current_location or {"type": "unknown"}
        )
        
        # Build lifecycle milestones
        lifecycle_milestones = LifecycleMilestones(
            seed_date=crop.seed_date,
            transplanting_date_planned=crop.transplanting_date_planned,
            transplanting_date=crop.transplanting_date,
            harvesting_date_planned=crop.harvesting_date_planned,
            harvesting_date=crop.harvesting_date
        )
        
        # Get timelapse frames from snapshots
        timelapse_frames = await self._build_timelapse_frames(crop_id)
        
        # Get history entries
        history = await self.history_repo.get_by_crop_id(crop_id)
        
        return CropTimelapse(
            crop_metadata=crop_metadata,
            lifecycle_milestones=lifecycle_milestones,
            timelapse_frames=timelapse_frames,
            notes=crop.notes,
            history=[CropHistoryEntry(
                crop_id=h.crop_id,
                timestamp=h.timestamp,
                event=h.event,
                performed_by=h.performed_by,
                notes=h.notes
            ) for h in history]
        )
    
    async def _build_timelapse_frames(self, crop_id: int) -> List[TimelapseFrame]:
        """Build timelapse frames from crop snapshots and measurements."""
        # Get crop snapshots ordered by timestamp
        snapshots = await self.snapshot_repo.get_by_crop_id_ordered(crop_id)
        
        frames = []
        for snapshot in snapshots:
            # Calculate crop age
            crop = await self.crop_repo.get(crop_id)
            crop_age_days = 0
            if crop and crop.seed_date and snapshot.timestamp:
                delta = snapshot.timestamp.date() - crop.seed_date
                crop_age_days = delta.days
            
            # Get measurements for this snapshot
            growth_metrics = GrowthMetrics()
            if snapshot.measurements_id:
                measurement = await self.measurement_repo.get_by_id(snapshot.measurements_id)
                if measurement:
                    growth_metrics = GrowthMetrics(
                        radius=measurement.radius,
                        width=measurement.width,
                        height=measurement.height,
                        area=measurement.area,
                        area_estimated=measurement.area_estimated,
                        weight=measurement.weight,
                        accumulated_light_hours=snapshot.accumulated_light_hours,
                        accumulated_water_hours=snapshot.accumulated_water_hours
                    )
            
            # Environmental metrics (placeholder - could be enhanced with actual recipe data)
            environmental_metrics = EnvironmentalMetrics(
                air_temperature=22.0,  # Could fetch from recipe version
                humidity=65.0,
                co2=1000.0,
                water_temperature=20.0,
                ph=6.5,
                ec=1.8
            )
            
            frame = TimelapseFrame(
                timestamp=snapshot.timestamp,
                crop_age_days=crop_age_days,
                image_url=snapshot.image_url,
                lifecycle_status=snapshot.lifecycle_status,
                health_status=snapshot.health_status,
                growth_metrics=growth_metrics,
                environmental_metrics=environmental_metrics
            )
            frames.append(frame)
        
        return frames
    
    async def get_crop_snapshots_filtered(
        self, crop_id: int, start_date: Optional[datetime], 
        end_date: Optional[datetime], limit: int
    ) -> List[CropSnapshot]:
        """Get filtered crop snapshots."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        snapshots = await self.snapshot_repo.get_filtered_by_dates(
            crop_id, start_date, end_date, limit
        )
        
        return [CropSnapshot(
            id=s.id,
            timestamp=s.timestamp,
            crop_id=s.crop_id,
            lifecycle_status=s.lifecycle_status,
            health_status=s.health_status,
            recipe_version_id=s.recipe_version_id,
            location=s.location,
            measurements_id=s.measurements_id,
            accumulated_light_hours=s.accumulated_light_hours,
            accumulated_water_hours=s.accumulated_water_hours,
            image_url=s.image_url
        ) for s in snapshots]
    
    async def get_crop_growth_chart_data(
        self, crop_id: int, start_date: Optional[datetime], 
        end_date: Optional[datetime], metrics: Optional[List[str]]
    ) -> GrowthChartData:
        """Get growth chart data for visualization."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Get snapshots with measurements
        snapshots = await self.snapshot_repo.get_with_measurements(
            crop_id, start_date, end_date
        )
        
        # Build chart data points
        chart_data = []
        for snapshot in snapshots:
            crop_age_days = 0
            if crop.seed_date and snapshot.timestamp:
                delta = snapshot.timestamp.date() - crop.seed_date
                crop_age_days = delta.days
            
            measurement = snapshot.measurements if hasattr(snapshot, 'measurements') else None
            
            data_point = GrowthDataPoint(
                timestamp=snapshot.timestamp,
                crop_age_days=crop_age_days,
                area=measurement.area if measurement else None,
                area_estimated=measurement.area_estimated if measurement else None,
                weight=measurement.weight if measurement else None,
                accumulated_light_hours=snapshot.accumulated_light_hours,
                accumulated_water_hours=snapshot.accumulated_water_hours,
                air_temperature=22.0,  # Could be enhanced with actual data
                humidity=65.0,
                co2=1000.0,
                water_temperature=20.0,
                ph=6.5,
                ec=1.8
            )
            chart_data.append(data_point)
        
        # Define metric definitions
        metric_definitions = MetricDefinitions(
            area=MetricDefinition(unit="cm²", description="Measured crop area"),
            area_estimated=MetricDefinition(unit="cm²", description="Estimated crop area"),
            weight=MetricDefinition(unit="g", description="Crop weight"),
            accumulated_light_hours=MetricDefinition(unit="hours", description="Total light exposure"),
            accumulated_water_hours=MetricDefinition(unit="hours", description="Total water exposure")
        )
        
        return GrowthChartData(
            chart_data=chart_data,
            metric_definitions=metric_definitions
        )
    
    async def update_crop_notes(self, crop_id: int, notes: str) -> NotesUpdateResponse:
        """Update crop notes."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        # Update notes
        from app.schemas.recipe import CropUpdate
        update_data = CropUpdate(notes=notes)
        updated_crop = await self.crop_repo.update(crop_id, update_data)
        
        if updated_crop:
            # Create history entry
            history_data = CropHistoryCreate(
                event="Notes updated",
                performed_by="user",
                notes="Crop notes were updated"
            )
            await self.history_repo.create_history_entry(crop_id, history_data)
            
            return NotesUpdateResponse(
                success=True,
                message="Notes updated successfully",
                updated_at=datetime.now()
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update notes"
            )
    
    async def get_crop_history_filtered(
        self, crop_id: int, limit: int, start_date: Optional[datetime], 
        end_date: Optional[datetime]
    ) -> List[CropHistoryEntry]:
        """Get filtered crop history."""
        # Check if crop exists
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        history = await self.history_repo.get_filtered(
            crop_id, limit, start_date, end_date
        )
        
        return [CropHistoryEntry(
            crop_id=h.crop_id,
            timestamp=h.timestamp,
            event=h.event,
            performed_by=h.performed_by,
            notes=h.notes
        ) for h in history]
    
    async def get_crop_measurements(self, crop_id: int):
        """Get crop measurements."""
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        if not crop.measurements_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No measurements found for crop {crop_id}"
            )
        
        measurement = await self.measurement_repo.get_by_id(crop.measurements_id)
        if not measurement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Measurement with ID {crop.measurements_id} not found"
            )
        
        return measurement
    
    async def update_crop_measurements(self, crop_id: int, measurement_data: CropMeasurementUpdate):
        """Update crop measurements."""
        crop = await self.crop_repo.get(crop_id)
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {crop_id} not found"
            )
        
        if not crop.measurements_id:
            # Create new measurement if none exists
            new_measurement = await self.measurement_repo.create_measurement(
                CropMeasurementCreate(**measurement_data.model_dump(exclude_unset=True))
            )
            # Update crop to link to new measurement
            from app.schemas.recipe import CropUpdate
            await self.crop_repo.update(crop_id, CropUpdate(measurements_id=new_measurement.id))
            return new_measurement
        else:
            # Update existing measurement
            updated_measurement = await self.measurement_repo.update_measurement(
                crop.measurements_id, measurement_data
            )
            if not updated_measurement:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Measurement with ID {crop.measurements_id} not found"
                )
            return updated_measurement