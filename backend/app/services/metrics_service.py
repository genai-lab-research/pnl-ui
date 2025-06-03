from datetime import datetime
from typing import Any

from app.models import TimeRange
from app.repositories.container_repository import ContainerRepository


class MetricsService:
    def __init__(self):
        self.container_repository = ContainerRepository()

    def get_container_metrics(
        self,
        container_id: str,
        time_range: TimeRange = TimeRange.WEEK,
        start_date: datetime | None = None,
    ) -> Any:
        """Get metrics for a specific container over a time range."""
        metrics = self.container_repository.get_container_metrics(
            container_id, time_range
        )
        if not metrics:
            # Return default metrics structure that matches frontend expectations
            return {
                "temperature": {"current": 22.5, "unit": "°C", "target": 23.0},
                "humidity": {"current": 65, "unit": "%", "target": 60},
                "co2": {"current": 800, "target": 850},
                "yield": {"current": 0, "unit": "KG", "trend": "stable"},
                "nursery_utilization": {"current": 0, "unit": "%", "trend": "stable"},
                "cultivation_utilization": {
                    "current": 0,
                    "unit": "%",
                    "trend": "stable",
                },
            }

        # Convert metrics to the expected format
        metrics_dict = metrics.model_dump()

        return {
            "yield_data": [
                {
                    "date": "2025-05-01",
                    "value": metrics_dict["yield_metric"]["current"],
                },
                {
                    "date": "2025-05-02",
                    "value": metrics_dict["yield_metric"]["current"] + 5,
                },
                {
                    "date": "2025-05-03",
                    "value": metrics_dict["yield_metric"]["current"] - 3,
                },
                {
                    "date": "2025-05-04",
                    "value": metrics_dict["yield_metric"]["current"] + 2,
                },
                {
                    "date": "2025-05-05",
                    "value": metrics_dict["yield_metric"]["current"] + 1,
                },
            ],
            "space_utilization_data": [
                {
                    "date": "2025-05-01",
                    "value": metrics_dict["nursery_utilization"]["current"],
                },
                {
                    "date": "2025-05-02",
                    "value": metrics_dict["nursery_utilization"]["current"] + 2,
                },
                {
                    "date": "2025-05-03",
                    "value": metrics_dict["nursery_utilization"]["current"] - 1,
                },
                {
                    "date": "2025-05-04",
                    "value": metrics_dict["nursery_utilization"]["current"] + 3,
                },
                {
                    "date": "2025-05-05",
                    "value": metrics_dict["nursery_utilization"]["current"],
                },
            ],
            "average_yield": metrics_dict["yield_metric"]["current"],
            "total_yield": metrics_dict["yield_metric"]["current"]
            * 7,  # Mock weekly total
            "average_space_utilization": metrics_dict["nursery_utilization"]["current"],
            "current_temperature": metrics_dict["temperature"]["current"],
            "current_humidity": metrics_dict["humidity"]["current"],
            "current_co2": metrics_dict["co2"]["current"],
            "crop_counts": {"seeded": 25, "transplanted": 15, "harvested": 10},
            "is_daily": True,
        }

    def get_performance_overview(
        self, time_range: TimeRange | None = TimeRange.WEEK
    ) -> Any:
        """Get performance overview for physical and virtual containers."""
        # Get all containers and calculate stats
        containers = self.container_repository.get_containers()

        physical_containers = [c for c in containers if c.type.value == "PHYSICAL"]
        virtual_containers = [c for c in containers if c.type.value == "VIRTUAL"]

        # Mock performance data based on existing metrics
        physical_metrics = None
        virtual_metrics = None

        if physical_containers:
            physical_metrics = self.container_repository.get_container_metrics(
                physical_containers[0].id, time_range
            )

        if virtual_containers:
            virtual_metrics = self.container_repository.get_container_metrics(
                virtual_containers[0].id
                if virtual_containers
                else physical_containers[0].id,
                time_range,
            )

        # Use fallback metrics if none found
        if not physical_metrics and physical_containers:
            physical_base_yield = 63
            physical_base_utilization = 80
        else:
            physical_base_yield = (
                physical_metrics.yield_metric["current"] if physical_metrics else 63
            )
            physical_base_utilization = (
                physical_metrics.nursery_utilization["current"]
                if physical_metrics
                else 80
            )

        if not virtual_metrics and virtual_containers:
            virtual_base_yield = 55
            virtual_base_utilization = 65
        else:
            virtual_base_yield = (
                virtual_metrics.yield_metric["current"] if virtual_metrics else 55
            )
            virtual_base_utilization = (
                virtual_metrics.nursery_utilization["current"]
                if virtual_metrics
                else 65
            )

        return {
            "physical": {
                "count": len(physical_containers),
                "yield": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [25, 20, 24, 18, 23, 19, 22],
                    "avgYield": int(physical_base_yield),
                    "totalYield": int(
                        physical_base_yield * 7 / 5
                    ),  # Weekly total approximation
                },
                "spaceUtilization": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [80, 75, 83, 76, 82, 70, 75],
                    "avgUtilization": int(physical_base_utilization),
                },
            },
            "virtual": {
                "count": len(virtual_containers),
                "yield": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [22, 19, 23, 18, 21, 17, 20],
                    "avgYield": int(virtual_base_yield),
                    "totalYield": int(
                        virtual_base_yield * 7 / 5
                    ),  # Weekly total approximation
                },
                "spaceUtilization": {
                    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    "data": [65, 60, 68, 62, 66, 59, 64],
                    "avgUtilization": int(virtual_base_utilization),
                },
            },
        }
