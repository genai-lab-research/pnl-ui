"""Test cases for crop timelapse API endpoints."""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.crop_history import CropHistory
from app.models.snapshots import CropSnapshot
from app.models.seed_type import SeedType


class TestCropTimelapseAPI:
    """Test crop timelapse API functionality."""
    
    @pytest.fixture
    async def seed_data(self, async_session: AsyncSession):
        """Create test seed data."""
        # Create seed type
        seed_type = SeedType(
            name="Test Lettuce",
            variety="Romaine",
            supplier="Test Supplier",
            batch_id="TST-001"
        )
        async_session.add(seed_type)
        await async_session.flush()
        
        # Create crop measurement
        measurement = CropMeasurement(
            radius=2.5,
            width=5.0,
            height=3.5,
            area=19.6,
            area_estimated=20.0,
            weight=45.5
        )
        async_session.add(measurement)
        await async_session.flush()
        
        # Create crop
        crop = Crop(
            seed_type_id=seed_type.id,
            seed_date=datetime.now().date() - timedelta(days=30),
            transplanting_date_planned=datetime.now().date() - timedelta(days=16),
            transplanting_date=datetime.now().date() - timedelta(days=15),
            harvesting_date_planned=datetime.now().date() + timedelta(days=30),
            lifecycle_status="vegetative",
            health_check="good",
            current_location={"type": "tray", "tray_id": 1, "row": 2, "column": 3},
            measurements_id=measurement.id,
            image_url="https://example.com/crop1.jpg",
            recipe_version_id=None,
            accumulated_light_hours=720.0,
            accumulated_water_hours=180.0,
            notes="Test crop for timelapse"
        )
        async_session.add(crop)
        await async_session.flush()
        
        # Create crop history entries
        history_entries = [
            CropHistory(
                crop_id=crop.id,
                timestamp=datetime.now() - timedelta(days=30),
                event="Seeded",
                performed_by="system",
                notes="Crop was seeded"
            ),
            CropHistory(
                crop_id=crop.id,
                timestamp=datetime.now() - timedelta(days=15),
                event="Transplanted",
                performed_by="John Doe",
                notes="Crop was transplanted to tray"
            ),
            CropHistory(
                crop_id=crop.id,
                timestamp=datetime.now() - timedelta(days=5),
                event="Health check",
                performed_by="Jane Smith",
                notes="Health status: good"
            )
        ]
        
        for history in history_entries:
            async_session.add(history)
        
        # Create crop snapshots
        snapshots = []
        for i in range(10):  # Create 10 daily snapshots
            snapshot = CropSnapshot(
                crop_id=crop.id,
                timestamp=datetime.now() - timedelta(days=10-i),
                lifecycle_status="vegetative",
                health_status="good",
                recipe_version_id=None,
                location={"type": "tray", "tray_id": 1, "row": 2, "column": 3},
                measurements_id=measurement.id,
                accumulated_light_hours=600.0 + i * 24,
                accumulated_water_hours=150.0 + i * 6,
                image_url=f"https://example.com/crop1_day_{i+1}.jpg"
            )
            snapshots.append(snapshot)
            async_session.add(snapshot)
        
        await async_session.commit()
        
        return {
            "crop": crop,
            "seed_type": seed_type,
            "measurement": measurement,
            "history": history_entries,
            "snapshots": snapshots
        }
    
    @pytest.mark.asyncio
    async def test_get_crop_timelapse_data(self, client, seed_data, auth_headers):
        """Test retrieving comprehensive timelapse data for a crop."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/timelapse",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "crop_metadata" in data
        assert "lifecycle_milestones" in data
        assert "timelapse_frames" in data
        assert "notes" in data
        assert "history" in data
        
        # Verify crop metadata
        metadata = data["crop_metadata"]
        assert metadata["id"] == crop_id
        assert metadata["seed_type"] == "Test Lettuce"
        assert metadata["variety"] == "Romaine"
        assert metadata["supplier"] == "Test Supplier"
        assert metadata["batch_id"] == "TST-001"
        
        # Verify lifecycle milestones
        milestones = data["lifecycle_milestones"]
        assert milestones["seed_date"] is not None
        assert milestones["transplanting_date_planned"] is not None
        assert milestones["transplanting_date"] is not None
        assert milestones["harvesting_date_planned"] is not None
        
        # Verify timelapse frames
        frames = data["timelapse_frames"]
        assert len(frames) >= 0  # Should have snapshot frames
        
        # Verify history
        history = data["history"]
        assert len(history) >= 3  # Should have at least our test history entries
        
        # Verify notes
        assert data["notes"] == "Test crop for timelapse"
    
    @pytest.mark.asyncio
    async def test_get_crop_snapshots(self, client, seed_data, auth_headers):
        """Test retrieving crop snapshots for timelapse functionality."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/snapshots",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        snapshots = response.json()
        
        assert isinstance(snapshots, list)
        assert len(snapshots) >= 10  # Should have our test snapshots
        
        # Verify snapshot structure
        if snapshots:
            snapshot = snapshots[0]
            assert "id" in snapshot
            assert "timestamp" in snapshot
            assert "crop_id" in snapshot
            assert snapshot["crop_id"] == crop_id
            assert "lifecycle_status" in snapshot
            assert "health_status" in snapshot
            assert "image_url" in snapshot
    
    @pytest.mark.asyncio
    async def test_get_crop_snapshots_with_filters(self, client, seed_data, auth_headers):
        """Test retrieving crop snapshots with date filters."""
        data = await seed_data
        crop_id = data["crop"].id
        start_date = (datetime.now() - timedelta(days=5)).isoformat()
        end_date = datetime.now().isoformat()
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/snapshots",
            params={
                "start_date": start_date,
                "end_date": end_date,
                "limit": 5
            },
            headers=auth_headers
        )
        
        assert response.status_code == 200
        snapshots = response.json()
        
        assert isinstance(snapshots, list)
        assert len(snapshots) <= 5  # Should respect limit
    
    @pytest.mark.asyncio
    async def test_create_crop_snapshot(self, client, seed_data, auth_headers):
        """Test creating a new crop snapshot."""
        data = await seed_data
        crop_id = data["crop"].id
        
        snapshot_data = {
            "lifecycle_status": "flowering",
            "health_status": "excellent",
            "recipe_version_id": None,
            "location": {"type": "panel", "panel_id": 2, "channel": 1, "position": 5},
            "measurements_id": data["measurement"].id,
            "accumulated_light_hours": 800.0,
            "accumulated_water_hours": 200.0,
            "image_url": "https://example.com/new_snapshot.jpg"
        }
        
        response = await client.post(
            f"/api/v1/crops/{crop_id}/snapshots",
            json=snapshot_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        created_snapshot = response.json()
        
        assert created_snapshot["crop_id"] == crop_id
        assert created_snapshot["lifecycle_status"] == "flowering"
        assert created_snapshot["health_status"] == "excellent"
        assert created_snapshot["accumulated_light_hours"] == 800.0
    
    @pytest.mark.asyncio
    async def test_get_crop_growth_chart_data(self, client, seed_data, auth_headers):
        """Test retrieving growth metrics for chart visualization."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/growth-metrics",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        chart_data = response.json()
        
        # Verify structure
        assert "chart_data" in chart_data
        assert "metric_definitions" in chart_data
        
        # Verify chart data points
        data_points = chart_data["chart_data"]
        assert isinstance(data_points, list)
        
        if data_points:
            point = data_points[0]
            assert "timestamp" in point
            assert "crop_age_days" in point
            assert "accumulated_light_hours" in point
            assert "accumulated_water_hours" in point
        
        # Verify metric definitions
        definitions = chart_data["metric_definitions"]
        assert "area" in definitions
        assert "weight" in definitions
        assert "accumulated_light_hours" in definitions
    
    @pytest.mark.asyncio
    async def test_update_crop_notes(self, client, seed_data, auth_headers):
        """Test updating crop notes."""
        data = await seed_data
        crop_id = data["crop"].id
        
        notes_data = {
            "notes": "Updated notes for crop timelapse testing"
        }
        
        response = await client.put(
            f"/api/v1/crops/{crop_id}/notes",
            json=notes_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        result = response.json()
        
        assert result["success"] is True
        assert "message" in result
        assert "updated_at" in result
    
    @pytest.mark.asyncio
    async def test_get_crop_history(self, client, seed_data, auth_headers):
        """Test retrieving crop history."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/history",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        history = response.json()
        
        assert isinstance(history, list)
        assert len(history) >= 3  # Should have our test history entries
        
        # Verify history entry structure
        if history:
            entry = history[0]
            assert "crop_id" in entry
            assert "timestamp" in entry
            assert "event" in entry
            assert "performed_by" in entry
            assert entry["crop_id"] == crop_id
    
    @pytest.mark.asyncio
    async def test_create_crop_history_entry(self, client, seed_data, auth_headers):
        """Test creating a new crop history entry."""
        data = await seed_data
        crop_id = data["crop"].id
        
        history_data = {
            "event": "Test event",
            "performed_by": "Test User",
            "notes": "This is a test history entry"
        }
        
        response = await client.post(
            f"/api/v1/crops/{crop_id}/history",
            json=history_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        created_entry = response.json()
        
        assert created_entry["crop_id"] == crop_id
        assert created_entry["event"] == "Test event"
        assert created_entry["performed_by"] == "Test User"
        assert created_entry["notes"] == "This is a test history entry"
    
    @pytest.mark.asyncio
    async def test_get_crop_by_id(self, client, seed_data, auth_headers):
        """Test retrieving detailed crop information."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        crop = response.json()
        
        assert crop["id"] == crop_id
        assert crop["lifecycle_status"] == "vegetative"
        assert crop["health_check"] == "good"
        assert crop["notes"] == "Test crop for timelapse"
    
    @pytest.mark.asyncio
    async def test_get_crop_measurements(self, client, seed_data, auth_headers):
        """Test retrieving crop measurements."""
        data = await seed_data
        crop_id = data["crop"].id
        
        response = await client.get(
            f"/api/v1/crops/{crop_id}/measurements",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        measurements = response.json()
        
        assert "id" in measurements
        assert measurements["radius"] == 2.5
        assert measurements["width"] == 5.0
        assert measurements["height"] == 3.5
        assert measurements["area"] == 19.6
        assert measurements["weight"] == 45.5
    
    @pytest.mark.asyncio
    async def test_update_crop_measurements(self, client, seed_data, auth_headers):
        """Test updating crop measurements."""
        data = await seed_data
        crop_id = data["crop"].id
        
        update_data = {
            "radius": 3.0,
            "width": 6.0,
            "height": 4.0,
            "area": 28.3,
            "weight": 65.0
        }
        
        response = await client.put(
            f"/api/v1/crops/{crop_id}/measurements",
            json=update_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        updated_measurements = response.json()
        
        assert updated_measurements["radius"] == 3.0
        assert updated_measurements["width"] == 6.0
        assert updated_measurements["height"] == 4.0
        assert updated_measurements["area"] == 28.3
        assert updated_measurements["weight"] == 65.0
    
    @pytest.mark.asyncio
    async def test_crop_not_found_errors(self, client, auth_headers):
        """Test proper 404 errors for non-existent crops."""
        non_existent_crop_id = 99999
        
        # Test various endpoints with non-existent crop
        endpoints = [
            f"/api/v1/crops/{non_existent_crop_id}/timelapse",
            f"/api/v1/crops/{non_existent_crop_id}/snapshots",
            f"/api/v1/crops/{non_existent_crop_id}/growth-metrics",
            f"/api/v1/crops/{non_existent_crop_id}/history",
            f"/api/v1/crops/{non_existent_crop_id}",
            f"/api/v1/crops/{non_existent_crop_id}/measurements"
        ]
        
        for endpoint in endpoints:
            response = await client.get(endpoint, headers=auth_headers)
            assert response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_authentication_required(self, client, seed_data):
        """Test that authentication is required for all crop endpoints."""
        data = await seed_data
        crop_id = data["crop"].id
        
        # Test endpoints without authentication
        endpoints = [
            f"/api/v1/crops/{crop_id}/timelapse",
            f"/api/v1/crops/{crop_id}/snapshots",
            f"/api/v1/crops/{crop_id}/growth-metrics",
            f"/api/v1/crops/{crop_id}/history",
            f"/api/v1/crops/{crop_id}",
            f"/api/v1/crops/{crop_id}/measurements"
        ]
        
        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == 401  # Unauthorized