from fastapi.testclient import TestClient

from app.main import app
from app.models import TimeRange

client = TestClient(app)


class TestMetricsAPI:
    """Test the metrics API endpoints."""

    def test_get_container_metrics(self):
        """Test getting metrics for a specific container."""
        # First get a container ID
        containers_response = client.get("/api/v1/containers/")
        assert containers_response.status_code == 200
        containers = containers_response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            # Get metrics for the container
            response = client.get(f"/api/v1/metrics/container/{container_id}")
            assert response.status_code == 200
            data = response.json()

            # Check required fields
            required_fields = [
                "yield_data",
                "space_utilization_data",
                "average_yield",
                "total_yield",
                "average_space_utilization",
                "current_temperature",
                "current_humidity",
                "current_co2",
                "crop_counts",
                "is_daily",
            ]
            for field in required_fields:
                assert field in data

    def test_get_container_metrics_with_time_range(self):
        """Test getting metrics with different time ranges."""
        # Get a container ID
        containers_response = client.get("/api/v1/containers/")
        assert containers_response.status_code == 200
        containers = containers_response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            # Test different time ranges
            for time_range in [
                TimeRange.WEEK,
                TimeRange.MONTH,
                TimeRange.QUARTER,
                TimeRange.YEAR,
            ]:
                response = client.get(
                    f"/api/v1/metrics/container/{container_id}?time_range={time_range}"
                )
                assert response.status_code == 200
                data = response.json()

                # Should have the basic structure
                assert "yield_data" in data
                assert "space_utilization_data" in data

    def test_get_nonexistent_container_metrics(self):
        """Test getting metrics for a non-existent container."""
        response = client.get("/api/v1/metrics/container/nonexistent-id")
        assert (
            response.status_code == 200
        )  # Returns empty data for non-existent containers
        data = response.json()

        # Should return default/empty structure
        assert data["average_yield"] == 0
        assert data["total_yield"] == 0
        assert len(data["yield_data"]) == 0

    def test_get_performance_overview(self):
        """Test getting performance overview."""
        response = client.get("/api/v1/metrics/performance")
        assert response.status_code == 200
        data = response.json()

        # Check required structure
        assert "physical" in data
        assert "virtual" in data

        # Check physical container data
        physical = data["physical"]
        assert "count" in physical
        assert "yield" in physical
        assert "spaceUtilization" in physical

        # Check yield data structure
        yield_data = physical["yield"]
        assert "labels" in yield_data
        assert "data" in yield_data
        assert "avgYield" in yield_data
        assert "totalYield" in yield_data

        # Check space utilization data structure
        space_util = physical["spaceUtilization"]
        assert "labels" in space_util
        assert "data" in space_util
        assert "avgUtilization" in space_util

        # Check virtual container data (same structure)
        virtual = data["virtual"]
        assert "count" in virtual
        assert "yield" in virtual
        assert "spaceUtilization" in virtual

    def test_get_performance_overview_with_time_range(self):
        """Test getting performance overview with different time ranges."""
        for time_range in [
            TimeRange.WEEK,
            TimeRange.MONTH,
            TimeRange.QUARTER,
            TimeRange.YEAR,
        ]:
            response = client.get(
                f"/api/v1/metrics/performance?time_range={time_range}"
            )
            assert response.status_code == 200
            data = response.json()

            # Should have both physical and virtual data
            assert "physical" in data
            assert "virtual" in data

    def test_metrics_data_types(self):
        """Test that metrics data has correct types."""
        # Get a container ID
        containers_response = client.get("/api/v1/containers/")
        assert containers_response.status_code == 200
        containers = containers_response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            response = client.get(f"/api/v1/metrics/container/{container_id}")
            assert response.status_code == 200
            data = response.json()

            # Check data types
            assert isinstance(data["yield_data"], list)
            assert isinstance(data["space_utilization_data"], list)
            assert isinstance(data["average_yield"], (int, float))
            assert isinstance(data["total_yield"], (int, float))
            assert isinstance(data["average_space_utilization"], (int, float))
            assert isinstance(data["current_temperature"], (int, float))
            assert isinstance(data["current_humidity"], (int, float))
            assert isinstance(data["current_co2"], (int, float))
            assert isinstance(data["crop_counts"], dict)
            assert isinstance(data["is_daily"], bool)

            # Check crop counts structure
            crop_counts = data["crop_counts"]
            assert "seeded" in crop_counts
            assert "transplanted" in crop_counts
            assert "harvested" in crop_counts

    def test_yield_and_utilization_data_structure(self):
        """Test that yield and utilization data has correct structure."""
        # Get a container ID
        containers_response = client.get("/api/v1/containers/")
        assert containers_response.status_code == 200
        containers = containers_response.json()["results"]

        if containers:
            container_id = containers[0]["id"]

            response = client.get(f"/api/v1/metrics/container/{container_id}")
            assert response.status_code == 200
            data = response.json()

            # Check yield data structure
            for yield_point in data["yield_data"]:
                assert "date" in yield_point
                assert "value" in yield_point
                assert isinstance(yield_point["date"], str)
                assert isinstance(yield_point["value"], (int, float))

            # Check space utilization data structure
            for util_point in data["space_utilization_data"]:
                assert "date" in util_point
                assert "value" in util_point
                assert isinstance(util_point["date"], str)
                assert isinstance(util_point["value"], (int, float))
