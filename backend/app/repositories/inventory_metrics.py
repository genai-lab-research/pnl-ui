from typing import Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.inventory_metrics import InventoryMetrics
from app.schemas.inventory_metrics import InventoryMetricsCreate


class InventoryMetricsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_container_and_date(
        self, 
        container_id: str, 
        metrics_date: Optional[date] = None
    ) -> Optional[InventoryMetrics]:
        query = self.db.query(InventoryMetrics).filter(
            InventoryMetrics.container_id == container_id
        )
        
        if metrics_date:
            query = query.filter(InventoryMetrics.date == metrics_date)
        else:
            query = query.filter(InventoryMetrics.date == date.today())
        
        return query.first()

    def get_latest_by_container(self, container_id: str) -> Optional[InventoryMetrics]:
        return self.db.query(InventoryMetrics).filter(
            InventoryMetrics.container_id == container_id
        ).order_by(InventoryMetrics.date.desc()).first()

    def create(self, metrics_data: InventoryMetricsCreate) -> InventoryMetrics:
        metrics_dict = metrics_data.model_dump()
        db_metrics = InventoryMetrics(**metrics_dict)
        self.db.add(db_metrics)
        self.db.flush()
        return db_metrics

    def update(
        self, 
        container_id: str, 
        metrics_date: date, 
        metrics_data: dict
    ) -> Optional[InventoryMetrics]:
        db_metrics = self.get_by_container_and_date(container_id, metrics_date)
        if not db_metrics:
            return None
        
        for field, value in metrics_data.items():
            if hasattr(db_metrics, field):
                setattr(db_metrics, field, value)
        
        self.db.flush()
        return db_metrics

    def delete(self, container_id: str, metrics_date: date) -> bool:
        db_metrics = self.get_by_container_and_date(container_id, metrics_date)
        if not db_metrics:
            return False
        
        self.db.delete(db_metrics)
        self.db.flush()
        return True