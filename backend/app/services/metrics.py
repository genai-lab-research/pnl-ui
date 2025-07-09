"""Metrics service for performance calculations and analytics."""

import logging
from typing import List, Optional
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.container import ContainerRepository
from app.schemas.container import (
    PerformanceMetrics,
    MetricsData,
    YieldMetrics,
    UtilizationMetrics,
    YieldDataPoint,
    UtilizationDataPoint,
    TimeRange
)

logger = logging.getLogger(__name__)


class MetricsService:
    """Service for calculating and aggregating container metrics."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ContainerRepository(db)

    async def get_performance_metrics(
        self,
        time_range: str = "week",
        container_type: str = "all",
        container_ids: Optional[List[int]] = None
    ) -> PerformanceMetrics:
        """Get performance metrics for containers."""
        try:
            # Calculate time range
            time_range_info = self._calculate_time_range(time_range)
            
            # Get physical containers metrics
            physical_metrics = await self._get_metrics_for_type(
                "physical", container_ids, time_range_info
            )
            
            # Get virtual containers metrics
            virtual_metrics = await self._get_metrics_for_type(
                "virtual", container_ids, time_range_info
            )
            
            return PerformanceMetrics(
                physical=physical_metrics,
                virtual=virtual_metrics,
                time_range=time_range_info,
                generated_at=datetime.now().isoformat()
            )
        
        except Exception as e:
            logger.error(f"Error calculating performance metrics: {e}")
            raise

    async def _get_metrics_for_type(
        self,
        container_type: str,
        container_ids: Optional[List[int]],
        time_range: TimeRange
    ) -> MetricsData:
        """Get metrics data for a specific container type."""
        # Get containers for this type
        containers = await self.repository.get_metrics_data(
            container_type=container_type,
            container_ids=container_ids
        )
        
        if not containers:
            # Return empty metrics if no containers
            return MetricsData.model_validate({
                "container_count": 0,
                "yield": YieldMetrics(
                    average=0.0,
                    total=0.0,
                    chart_data=[]
                ),
                "space_utilization": UtilizationMetrics(
                    average=0.0,
                    chart_data=[]
                )
            })
        
        # Calculate yield metrics from latest metric snapshots
        yield_values = []
        utilization_values = []
        
        for container in containers:
            if container.metric_snapshots:
                # Get the latest metric snapshot
                latest_metric = max(container.metric_snapshots, key=lambda m: m.timestamp or datetime.min)
                yield_values.append(latest_metric.yield_kg or 0.0)
                utilization_values.append(latest_metric.space_utilization_pct or 0.0)
            else:
                # Default values if no metrics available
                yield_values.append(0.0)
                utilization_values.append(0.0)
        
        total_yield = sum(yield_values)
        average_yield = total_yield / len(containers) if containers else 0
        average_utilization = sum(utilization_values) / len(containers) if containers else 0
        
        # Generate chart data
        yield_chart_data = self._generate_yield_chart_data(time_range, total_yield, average_yield)
        utilization_chart_data = self._generate_utilization_chart_data(time_range, average_utilization)
        
        yield_metrics = YieldMetrics(
            average=round(average_yield, 2),
            total=round(total_yield, 2),
            chart_data=yield_chart_data
        )
        
        return MetricsData.model_validate({
            "container_count": len(containers),
            "yield": yield_metrics,
            "space_utilization": UtilizationMetrics(
                average=round(average_utilization, 2),
                chart_data=utilization_chart_data
            )
        })

    def _calculate_time_range(self, time_range: str) -> TimeRange:
        """Calculate time range based on type."""
        now = datetime.now(timezone.utc)
        
        if time_range == "week":
            start_date = now - timedelta(days=7)
        elif time_range == "month":
            start_date = now - timedelta(days=30)
        elif time_range == "quarter":
            start_date = now - timedelta(days=90)
        elif time_range == "year":
            start_date = now - timedelta(days=365)
        else:
            # Default to week
            start_date = now - timedelta(days=7)
            time_range = "week"
        
        return TimeRange(
            type=time_range,
            start_date=start_date.isoformat(),
            end_date=now.isoformat()
        )

    def _generate_yield_chart_data(
        self,
        time_range: TimeRange,
        total_yield: float,
        average_yield: float
    ) -> List[YieldDataPoint]:
        """Generate yield chart data points."""
        chart_data = []
        
        # Parse time range
        start_date = datetime.fromisoformat(time_range.start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(time_range.end_date.replace('Z', '+00:00'))
        
        # Ensure dates are timezone-aware
        if start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)
        if end_date.tzinfo is None:
            end_date = end_date.replace(tzinfo=timezone.utc)
        
        # Calculate interval based on time range type
        if time_range.type == "week":
            interval = timedelta(days=1)
            periods = 7
        elif time_range.type == "month":
            interval = timedelta(days=1)
            periods = 30
        elif time_range.type == "quarter":
            interval = timedelta(days=7)
            periods = 13
        else:  # year
            interval = timedelta(days=30)
            periods = 12
        
        # Generate data points with some variation
        current_date = start_date
        for i in range(periods):
            # Add some realistic variation to the data
            variation = 0.8 + (i % 3) * 0.1  # Vary between 0.8 and 1.0
            value = average_yield * variation
            
            # Determine if this is current period or future
            now = datetime.now(timezone.utc)
            is_current_period = current_date.date() == now.date()
            is_future = current_date > now
            
            chart_data.append(YieldDataPoint(
                date=current_date.isoformat(),
                value=round(value, 2),
                is_current_period=is_current_period,
                is_future=is_future
            ))
            
            current_date += interval
        
        return chart_data

    def _generate_utilization_chart_data(
        self,
        time_range: TimeRange,
        average_utilization: float
    ) -> List[UtilizationDataPoint]:
        """Generate utilization chart data points."""
        chart_data = []
        
        # Parse time range
        start_date = datetime.fromisoformat(time_range.start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(time_range.end_date.replace('Z', '+00:00'))
        
        # Ensure dates are timezone-aware
        if start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)
        if end_date.tzinfo is None:
            end_date = end_date.replace(tzinfo=timezone.utc)
        
        # Calculate interval based on time range type
        if time_range.type == "week":
            interval = timedelta(days=1)
            periods = 7
        elif time_range.type == "month":
            interval = timedelta(days=1)
            periods = 30
        elif time_range.type == "quarter":
            interval = timedelta(days=7)
            periods = 13
        else:  # year
            interval = timedelta(days=30)
            periods = 12
        
        # Generate data points with some variation
        current_date = start_date
        for i in range(periods):
            # Add some realistic variation to the data
            variation = 0.9 + (i % 4) * 0.025  # Vary between 0.9 and 0.975
            value = min(average_utilization * variation, 100.0)  # Cap at 100%
            
            # Determine if this is current period or future
            now = datetime.now(timezone.utc)
            is_current_period = current_date.date() == now.date()
            is_future = current_date > now
            
            chart_data.append(UtilizationDataPoint(
                date=current_date.isoformat(),
                value=round(value, 2),
                is_current_period=is_current_period,
                is_future=is_future
            ))
            
            current_date += interval
        
        return chart_data

    async def get_metrics_summary(
        self,
        container_type: Optional[str] = None
    ) -> dict:
        """Get a summary of metrics for dashboard overview."""
        try:
            containers = await self.repository.get_metrics_data(
                container_type=container_type
            )
            
            if not containers:
                return {
                    "total_containers": 0,
                    "total_yield": 0.0,
                    "average_yield": 0.0,
                    "average_utilization": 0.0,
                    "active_containers": 0,
                    "containers_with_alerts": 0
                }
            
            # Calculate summary metrics
            total_containers = len(containers)
            
            # Extract yield and utilization from latest metric snapshots
            total_yield = 0.0
            utilization_values = []
            
            for container in containers:
                if container.metric_snapshots:
                    latest_metric = max(container.metric_snapshots, key=lambda m: m.timestamp or datetime.min)
                    total_yield += latest_metric.yield_kg or 0.0
                    utilization_values.append(latest_metric.space_utilization_pct or 0.0)
                else:
                    utilization_values.append(0.0)
            
            average_yield = total_yield / total_containers if total_containers > 0 else 0
            average_utilization = sum(utilization_values) / len(utilization_values) if utilization_values else 0
            
            # Count active containers
            active_containers = sum(1 for container in containers if container.status == "active")
            
            # Count containers with alerts
            containers_with_alerts = sum(1 for container in containers if container.alerts)
            
            return {
                "total_containers": total_containers,
                "total_yield": round(total_yield, 2),
                "average_yield": round(average_yield, 2),
                "average_utilization": round(average_utilization, 2),
                "active_containers": active_containers,
                "containers_with_alerts": containers_with_alerts
            }
        
        except Exception as e:
            logger.error(f"Error calculating metrics summary: {e}")
            raise

    async def get_container_performance_trend(
        self,
        container_id: int,
        days: int = 30
    ) -> dict:
        """Get performance trend for a specific container."""
        try:
            container = await self.repository.get_with_relationships(container_id)
            if not container:
                return {}
            
            # For now, generate mock trend data
            # In a real application, you'd have historical metrics data
            trend_data = []
            now = datetime.now(timezone.utc)
            
            # Get base values from latest metric snapshot or use defaults
            if container.metric_snapshots:
                latest_metric = max(container.metric_snapshots, key=lambda m: m.timestamp or datetime.min)
                base_yield = latest_metric.yield_kg or 10.0
                base_utilization = latest_metric.space_utilization_pct or 75.0
                base_air_temp = latest_metric.air_temperature or 22.0
                base_humidity = latest_metric.humidity or 65.0
                base_co2 = latest_metric.co2 or 400.0
            else:
                base_yield = 10.0  # Default yield
                base_utilization = 75.0  # Default utilization
                base_air_temp = 22.0
                base_humidity = 65.0
                base_co2 = 400.0
            
            for i in range(days):
                date = now - timedelta(days=days - i)
                
                # Generate realistic trend data with some variation
                # Add some variation (±20%)
                yield_variation = 0.8 + (i % 5) * 0.08
                utilization_variation = 0.9 + (i % 3) * 0.033
                
                trend_data.append({
                    "date": date.isoformat(),
                    "yield_kg": round(base_yield * yield_variation, 2),
                    "space_utilization_pct": round(min(base_utilization * utilization_variation, 100), 2),
                    "air_temperature": base_air_temp + (i % 3 - 1) * 0.5,
                    "humidity": base_humidity + (i % 4 - 2) * 1.0,
                    "co2": base_co2 + (i % 2) * 10
                })
            
            return {
                "container_id": container_id,
                "container_name": container.name,
                "trend_data": trend_data
            }
        
        except Exception as e:
            logger.error(f"Error getting container performance trend for {container_id}: {e}")
            raise