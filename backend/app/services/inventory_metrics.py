from typing import Optional
from datetime import date, datetime
from sqlalchemy.orm import Session

from app.repositories.inventory_metrics import InventoryMetricsRepository
from app.repositories.container import ContainerRepository
from app.schemas.inventory_metrics import (
    InventoryMetricsCreate, 
    InventoryMetricsResponse, 
    InventoryMetricsQuery
)


class InventoryMetricsService:
    def __init__(self, db: Session):
        self.db = db
        self.metrics_repo = InventoryMetricsRepository(db)
        self.container_repo = ContainerRepository(db)

    def get_metrics(
        self, 
        container_id: str, 
        query_params: Optional[InventoryMetricsQuery] = None
    ) -> Optional[InventoryMetricsResponse]:
        container = self.container_repo.get_by_id(container_id)
        if not container:
            raise ValueError(f"Container with id {container_id} not found")
        
        metrics_date = None
        if query_params and query_params.date:
            try:
                metrics_date = datetime.strptime(query_params.date, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD")
        
        metrics = self.metrics_repo.get_by_container_and_date(container_id, metrics_date)
        
        if not metrics:
            metrics = self.metrics_repo.get_latest_by_container(container_id)
        
        if not metrics:
            return InventoryMetricsResponse(
                id=0,
                container_id=container_id,
                date=date.today(),
                nursery_station_utilization=0,
                cultivation_area_utilization=0
            )
        
        return InventoryMetricsResponse.model_validate(metrics)

    def create_metrics(self, metrics_data: InventoryMetricsCreate) -> InventoryMetricsResponse:
        container = self.container_repo.get_by_id(metrics_data.container_id)
        if not container:
            raise ValueError(f"Container with id {metrics_data.container_id} not found")
        
        existing_metrics = self.metrics_repo.get_by_container_and_date(
            metrics_data.container_id, 
            metrics_data.date
        )
        if existing_metrics:
            raise ValueError(
                f"Metrics for container {metrics_data.container_id} on {metrics_data.date} already exist"
            )
        
        db_metrics = self.metrics_repo.create(metrics_data)
        return InventoryMetricsResponse.model_validate(db_metrics)

    def update_metrics(
        self, 
        container_id: str, 
        metrics_date: date, 
        metrics_data: dict
    ) -> Optional[InventoryMetricsResponse]:
        container = self.container_repo.get_by_id(container_id)
        if not container:
            raise ValueError(f"Container with id {container_id} not found")
        
        db_metrics = self.metrics_repo.update(container_id, metrics_date, metrics_data)
        if not db_metrics:
            return None
        return InventoryMetricsResponse.model_validate(db_metrics)

    def delete_metrics(self, container_id: str, metrics_date: date) -> bool:
        return self.metrics_repo.delete(container_id, metrics_date)