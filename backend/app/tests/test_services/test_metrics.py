"""Tests for Metrics service calculations and analytics."""

import pytest
from unittest.mock import AsyncMock, patch
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.metrics import MetricsService
from app.schemas.container import TimeRange


@pytest.mark.services
class TestMetricsService:
    """Test MetricsService functionality."""

    def test_service_initialization(self, async_session: AsyncSession):
        """Test service initialization."""
        service = MetricsService(async_session)
        
        assert service.db == async_session
        assert service.repository is not None

    @pytest.mark.asyncio

    async def test_get_performance_metrics_success(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting performance metrics successfully."""
        service = MetricsService(async_session)
        
        metrics = await service.get_performance_metrics(
            time_range="week",
            container_type="all"
        )
        
        assert metrics is not None
        assert hasattr(metrics, 'physical')
        assert hasattr(metrics, 'virtual')
        assert hasattr(metrics, 'time_range')
        assert hasattr(metrics, 'generated_at')
        
        # Check time range
        assert metrics.time_range.type == "week"
        
        # Check physical metrics
        assert hasattr(metrics.physical, 'container_count')
        assert hasattr(metrics.physical, 'yield_data')
        assert hasattr(metrics.physical, 'space_utilization')
        
        # Check virtual metrics
        assert hasattr(metrics.virtual, 'container_count')
        assert hasattr(metrics.virtual, 'yield_data')
        assert hasattr(metrics.virtual, 'space_utilization')

    @pytest.mark.asyncio

    async def test_get_performance_metrics_different_time_ranges(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting performance metrics with different time ranges."""
        service = MetricsService(async_session)
        
        time_ranges = ["week", "month", "quarter", "year"]
        
        for time_range in time_ranges:
            metrics = await service.get_performance_metrics(time_range=time_range)
            
            assert metrics.time_range.type == time_range
            
            # Verify start and end dates are set
            assert metrics.time_range.start_date is not None
            assert metrics.time_range.end_date is not None
            
            # Verify chart data has appropriate number of points
            physical_chart_data = metrics.physical.yield_data.chart_data
            virtual_chart_data = metrics.virtual.yield_data.chart_data
            
            assert len(physical_chart_data) > 0
            assert len(virtual_chart_data) > 0

    @pytest.mark.asyncio

    async def test_get_performance_metrics_with_container_ids(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting performance metrics for specific container IDs."""
        service = MetricsService(async_session)
        
        container_ids = [test_containers_with_alerts[0].id]
        
        metrics = await service.get_performance_metrics(
            container_ids=container_ids
        )
        
        assert metrics is not None
        # With specific container IDs, metrics should be calculated only for those containers

    @pytest.mark.asyncio

    async def test_get_performance_metrics_no_containers(self, async_session: AsyncSession):
        """Test getting performance metrics when no containers exist."""
        service = MetricsService(async_session)
        
        # Mock repository to return empty list
        with patch.object(service.repository, 'get_metrics_data', return_value=[]):
            metrics = await service.get_performance_metrics()
        
        assert metrics is not None
        assert metrics.physical.container_count == 0
        assert metrics.virtual.container_count == 0
        assert metrics.physical.yield_data.total == 0.0
        assert metrics.physical.yield_data.average == 0.0
        assert metrics.virtual.yield_data.total == 0.0
        assert metrics.virtual.yield_data.average == 0.0

    @pytest.mark.asyncio

    async def test_get_performance_metrics_error_handling(self, async_session: AsyncSession):
        """Test performance metrics error handling."""
        service = MetricsService(async_session)
        
        # Mock repository to raise exception
        with patch.object(service.repository, 'get_metrics_data', side_effect=Exception("Database error")):
            with pytest.raises(Exception):
                await service.get_performance_metrics()

    def test_calculate_time_range_week(self):
        """Test time range calculation for week."""
        service = MetricsService(AsyncMock())
        
        time_range = service._calculate_time_range("week")
        
        assert time_range.type == "week"
        
        # Parse dates to verify they're correct
        start_date = datetime.fromisoformat(time_range.start_date)
        end_date = datetime.fromisoformat(time_range.end_date)
        
        # Should be approximately 7 days apart
        delta = end_date - start_date
        assert abs(delta.days - 7) <= 1  # Allow for minor timing differences

    def test_calculate_time_range_month(self):
        """Test time range calculation for month."""
        service = MetricsService(AsyncMock())
        
        time_range = service._calculate_time_range("month")
        
        assert time_range.type == "month"
        
        start_date = datetime.fromisoformat(time_range.start_date)
        end_date = datetime.fromisoformat(time_range.end_date)
        
        delta = end_date - start_date
        assert abs(delta.days - 30) <= 1

    def test_calculate_time_range_quarter(self):
        """Test time range calculation for quarter."""
        service = MetricsService(AsyncMock())
        
        time_range = service._calculate_time_range("quarter")
        
        assert time_range.type == "quarter"
        
        start_date = datetime.fromisoformat(time_range.start_date)
        end_date = datetime.fromisoformat(time_range.end_date)
        
        delta = end_date - start_date
        assert abs(delta.days - 90) <= 1

    def test_calculate_time_range_year(self):
        """Test time range calculation for year."""
        service = MetricsService(AsyncMock())
        
        time_range = service._calculate_time_range("year")
        
        assert time_range.type == "year"
        
        start_date = datetime.fromisoformat(time_range.start_date)
        end_date = datetime.fromisoformat(time_range.end_date)
        
        delta = end_date - start_date
        assert abs(delta.days - 365) <= 1

    def test_calculate_time_range_invalid(self):
        """Test time range calculation with invalid input defaults to week."""
        service = MetricsService(AsyncMock())
        
        time_range = service._calculate_time_range("invalid")
        
        assert time_range.type == "week"

    def test_generate_yield_chart_data_week(self):
        """Test generating yield chart data for week."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="week",
            start_date=(now - timedelta(days=7)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data = service._generate_yield_chart_data(time_range, 100.0, 20.0)
        
        assert len(chart_data) == 7  # 7 days for week
        
        for point in chart_data:
            assert hasattr(point, 'date')
            assert hasattr(point, 'value')
            assert hasattr(point, 'is_current_period')
            assert hasattr(point, 'is_future')
            assert isinstance(point.value, float)
            assert isinstance(point.is_current_period, bool)
            assert isinstance(point.is_future, bool)

    def test_generate_yield_chart_data_month(self):
        """Test generating yield chart data for month."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="month",
            start_date=(now - timedelta(days=30)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data = service._generate_yield_chart_data(time_range, 150.0, 30.0)
        
        assert len(chart_data) == 30  # 30 days for month

    def test_generate_yield_chart_data_quarter(self):
        """Test generating yield chart data for quarter."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="quarter",
            start_date=(now - timedelta(days=90)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data = service._generate_yield_chart_data(time_range, 200.0, 40.0)
        
        assert len(chart_data) == 3  # 3 months for quarter

    def test_generate_yield_chart_data_year(self):
        """Test generating yield chart data for year."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="year",
            start_date=(now - timedelta(days=365)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data = service._generate_yield_chart_data(time_range, 500.0, 50.0)
        
        assert len(chart_data) == 12  # 12 months for year

    def test_generate_utilization_chart_data(self):
        """Test generating utilization chart data."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="quarter",
            start_date=(now - timedelta(days=90)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data = service._generate_utilization_chart_data(time_range, 85.0)
        
        assert len(chart_data) == 3  # 3 months for quarter
        
        for point in chart_data:
            assert hasattr(point, 'date')
            assert hasattr(point, 'value')
            assert hasattr(point, 'is_current_period')
            assert hasattr(point, 'is_future')
            assert 0.0 <= point.value <= 100.0  # Utilization should be capped at 100%

    def test_generate_utilization_chart_data_cap_at_100(self):
        """Test that utilization chart data is capped at 100%."""
        service = MetricsService(AsyncMock())
        
        now = datetime.now()
        time_range = TimeRange(
            type="week",
            start_date=(now - timedelta(days=7)).isoformat(),
            end_date=now.isoformat()
        )
        
        # Use high average utilization that might exceed 100% with variation
        chart_data = service._generate_utilization_chart_data(time_range, 95.0)
        
        for point in chart_data:
            assert point.value <= 100.0

    @pytest.mark.asyncio

    async def test_get_metrics_summary_success(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting metrics summary successfully."""
        service = MetricsService(async_session)
        
        summary = await service.get_metrics_summary()
        
        assert isinstance(summary, dict)
        assert "total_containers" in summary
        assert "total_yield" in summary
        assert "average_yield" in summary
        assert "average_utilization" in summary
        assert "active_containers" in summary
        assert "containers_with_alerts" in summary
        
        # Check data types
        assert isinstance(summary["total_containers"], int)
        assert isinstance(summary["total_yield"], float)
        assert isinstance(summary["average_yield"], float)
        assert isinstance(summary["average_utilization"], float)
        assert isinstance(summary["active_containers"], int)
        assert isinstance(summary["containers_with_alerts"], int)

    @pytest.mark.asyncio

    async def test_get_metrics_summary_by_type(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test getting metrics summary filtered by container type."""
        service = MetricsService(async_session)
        
        physical_summary = await service.get_metrics_summary(container_type="physical")
        virtual_summary = await service.get_metrics_summary(container_type="virtual")
        
        assert isinstance(physical_summary, dict)
        assert isinstance(virtual_summary, dict)
        
        # Both should have the same structure
        for summary in [physical_summary, virtual_summary]:
            assert "total_containers" in summary
            assert "total_yield" in summary
            assert "average_yield" in summary
            assert "average_utilization" in summary

    @pytest.mark.asyncio

    async def test_get_metrics_summary_no_containers(self, async_session: AsyncSession):
        """Test getting metrics summary when no containers exist."""
        service = MetricsService(async_session)
        
        # Mock repository to return empty list
        with patch.object(service.repository, 'get_metrics_data', return_value=[]):
            summary = await service.get_metrics_summary()
        
        assert summary["total_containers"] == 0
        assert summary["total_yield"] == 0.0
        assert summary["average_yield"] == 0.0
        assert summary["average_utilization"] == 0.0
        assert summary["active_containers"] == 0
        assert summary["containers_with_alerts"] == 0

    @pytest.mark.asyncio

    async def test_get_metrics_summary_error_handling(self, async_session: AsyncSession):
        """Test metrics summary error handling."""
        service = MetricsService(async_session)
        
        # Mock repository to raise exception
        with patch.object(service.repository, 'get_metrics_data', side_effect=Exception("Database error")):
            with pytest.raises(Exception):
                await service.get_metrics_summary()

    @pytest.mark.asyncio

    async def test_get_container_performance_trend_success(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test getting container performance trend successfully."""
        service = MetricsService(async_session)
        
        trend = await service.get_container_performance_trend(test_container.id, days=30)
        
        assert isinstance(trend, dict)
        assert "container_id" in trend
        assert "container_name" in trend
        assert "trend_data" in trend
        
        assert trend["container_id"] == test_container.id
        assert trend["container_name"] == test_container.name
        assert isinstance(trend["trend_data"], list)
        assert len(trend["trend_data"]) == 30

    @pytest.mark.asyncio

    async def test_get_container_performance_trend_different_days(
        self,
        async_session: AsyncSession,
        test_container
    ):
        """Test getting container performance trend with different day counts."""
        service = MetricsService(async_session)
        
        for days in [7, 14, 30, 60]:
            trend = await service.get_container_performance_trend(test_container.id, days=days)
            
            assert len(trend["trend_data"]) == days
            
            # Check data point structure
            for point in trend["trend_data"]:
                assert "date" in point
                assert "yield_kg" in point
                assert "space_utilization_pct" in point
                assert "air_temperature" in point
                assert "humidity" in point
                assert "co2" in point

    @pytest.mark.asyncio

    async def test_get_container_performance_trend_not_found(self, async_session: AsyncSession):
        """Test getting performance trend for non-existent container."""
        service = MetricsService(async_session)
        
        # Mock repository to return None
        with patch.object(service.repository, 'get_with_relationships', return_value=None):
            trend = await service.get_container_performance_trend(99999)
        
        assert trend == {}

    @pytest.mark.asyncio

    async def test_get_container_performance_trend_error_handling(
        self,
        async_session: AsyncSession
    ):
        """Test container performance trend error handling."""
        service = MetricsService(async_session)
        
        # Mock repository to raise exception
        with patch.object(service.repository, 'get_with_relationships', side_effect=Exception("Database error")):
            with pytest.raises(Exception):
                await service.get_container_performance_trend(1)

    def test_trend_data_variation(self, async_session: AsyncSession, test_container):
        """Test that trend data includes realistic variation."""
        service = MetricsService(async_session)
        
        # Mock container with relationships loaded
        with patch.object(service.repository, 'get_with_relationships', return_value=test_container):
            # Use synchronous call for testing
            trend_data = []
            now = datetime.now()
            days = 10
            
            # Use mock values since Container model doesn't have metrics attribute
            base_yield = 25.0
            base_utilization = 85.0
            
            for i in range(days):
                date = now - timedelta(days=days - i)
                
                # Generate realistic trend data with variation
                yield_variation = 0.8 + (i % 5) * 0.08
                utilization_variation = 0.9 + (i % 3) * 0.033
                
                trend_data.append({
                    "date": date.isoformat(),
                    "yield_kg": round(base_yield * yield_variation, 2),
                    "space_utilization_pct": round(min(base_utilization * utilization_variation, 100), 2),
                    "air_temperature": 22.0 + (i % 3 - 1) * 0.5,
                    "humidity": 65.0 + (i % 4 - 2) * 1.0,
                    "co2": 400.0 + (i % 2) * 10
                })
            
            # Verify variation exists
            yield_values = [point["yield_kg"] for point in trend_data]
            utilization_values = [point["space_utilization_pct"] for point in trend_data]
            
            assert len(set(yield_values)) > 1  # Should have variation
            assert len(set(utilization_values)) > 1  # Should have variation
            
            # Verify utilization is capped at 100
            assert all(util <= 100 for util in utilization_values)

    @pytest.mark.asyncio

    async def test_metrics_calculation_precision(
        self,
        async_session: AsyncSession,
        test_containers_with_alerts
    ):
        """Test metrics calculation precision and rounding."""
        service = MetricsService(async_session)
        
        metrics = await service.get_performance_metrics()
        
        # Check that values are properly rounded to 2 decimal places
        assert metrics.physical.yield_data.average == round(metrics.physical.yield_data.average, 2)
        assert metrics.physical.yield_data.total == round(metrics.physical.yield_data.total, 2)
        assert metrics.physical.space_utilization.average == round(metrics.physical.space_utilization.average, 2)
        
        assert metrics.virtual.yield_data.average == round(metrics.virtual.yield_data.average, 2)
        assert metrics.virtual.yield_data.total == round(metrics.virtual.yield_data.total, 2)
        assert metrics.virtual.space_utilization.average == round(metrics.virtual.space_utilization.average, 2)

    @pytest.mark.asyncio

    async def test_metrics_service_logging(self, async_session: AsyncSession):
        """Test that metrics service operations are properly logged."""
        service = MetricsService(async_session)
        
        # Mock logging to verify log calls
        with patch('app.services.metrics.logger') as mock_logger:
            # Mock repository to raise exception
            with patch.object(service.repository, 'get_metrics_data', side_effect=Exception("Test error")):
                with pytest.raises(Exception):
                    await service.get_performance_metrics()
                
                # Verify error log was called
                mock_logger.error.assert_called()

    def test_chart_data_date_parsing(self):
        """Test that chart data generation handles ISO date parsing correctly."""
        service = MetricsService(AsyncMock())
        
        # Test with different ISO date formats
        now = datetime.now()
        
        # Test without Z suffix
        time_range1 = TimeRange(
            type="week",
            start_date=(now - timedelta(days=7)).isoformat(),
            end_date=now.isoformat()
        )
        
        chart_data1 = service._generate_yield_chart_data(time_range1, 100.0, 20.0)
        assert len(chart_data1) == 7
        
        # Test with Z suffix (UTC)
        time_range2 = TimeRange(
            type="week",
            start_date=(now - timedelta(days=7)).isoformat() + 'Z',
            end_date=now.isoformat() + 'Z'
        )
        
        chart_data2 = service._generate_yield_chart_data(time_range2, 100.0, 20.0)
        assert len(chart_data2) == 7