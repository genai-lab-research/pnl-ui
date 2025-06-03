from datetime import datetime
from typing import Any

from fastapi import APIRouter, Query

from app.models import TimeRange
from app.services.metrics_service import MetricsService

router = APIRouter()
metrics_service = MetricsService()


@router.get("/container/{container_id}")
def get_container_metrics(
    container_id: str,
    time_range: TimeRange = Query(default=TimeRange.WEEK),
    start_date: datetime | None = Query(default=None),
) -> Any:
    """
    Get metrics for a specific container over a time range.
    """
    return metrics_service.get_container_metrics(
        container_id=container_id, time_range=time_range, start_date=start_date
    )


@router.get("/performance")
def get_performance_overview(
    time_range: TimeRange | None = Query(default=TimeRange.WEEK),
) -> Any:
    """
    Get performance overview for physical and virtual containers.
    """
    return metrics_service.get_performance_overview(time_range=time_range)
