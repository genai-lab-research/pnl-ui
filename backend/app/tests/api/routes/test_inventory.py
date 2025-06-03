import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create a test client."""
    return TestClient(app)


class TestInventoryEndpoints:
    """Test cases for inventory API endpoints."""

    def test_get_nursery_station_data_success(self, client: TestClient):
        """Test getting nursery station data - success case."""
        container_id = "container-04"
        response = client.get(f"/api/v1/containers/{container_id}/inventory/nursery")

        assert response.status_code == 200
        data = response.json()

        # Verify nursery station data structure
        assert "utilization_percentage" in data
        assert isinstance(data["utilization_percentage"], int)
        assert 0 <= data["utilization_percentage"] <= 100

        # Verify upper shelf structure
        assert "upper_shelf" in data
        upper_shelf = data["upper_shelf"]
        assert "slots" in upper_shelf
        assert len(upper_shelf["slots"]) == 8  # 8 slots per shelf

        # Verify slot structure
        for slot in upper_shelf["slots"]:
            assert "slot_number" in slot
            assert "occupied" in slot
            assert isinstance(slot["occupied"], bool)
            assert 1 <= slot["slot_number"] <= 8

            if slot["occupied"]:
                assert slot["tray"] is not None
                tray = slot["tray"]
                assert "id" in tray
                assert "utilization_percentage" in tray
                assert "crop_count" in tray
                assert "utilization_level" in tray
                assert "rfid_tag" in tray
                assert "shelf" in tray
                assert "slot_number" in tray
                assert "crops" in tray
                assert isinstance(tray["crops"], list)

                # Verify crop structure if crops exist
                for crop in tray["crops"]:
                    assert "id" in crop
                    assert "seed_type" in crop
                    assert "age_days" in crop
                    assert "seeded_date" in crop
                    assert "health_status" in crop
                    assert "size" in crop
                    assert crop["health_status"] in [
                        "healthy",
                        "treatment_required",
                        "to_be_disposed",
                    ]
                    assert crop["size"] in ["small", "medium", "large"]
            else:
                assert slot["tray"] is None

        # Verify lower shelf structure
        assert "lower_shelf" in data
        lower_shelf = data["lower_shelf"]
        assert "slots" in lower_shelf
        assert len(lower_shelf["slots"]) == 8  # 8 slots per shelf

        # Verify off-shelf trays
        assert "off_shelf_trays" in data
        assert isinstance(data["off_shelf_trays"], list)

        for tray in data["off_shelf_trays"]:
            assert "id" in tray
            assert "utilization_percentage" in tray
            assert "crop_count" in tray
            assert "utilization_level" in tray
            assert "rfid_tag" in tray
            assert tray["is_on_shelf"] is False

    def test_get_nursery_station_data_with_date(self, client: TestClient):
        """Test getting nursery station data with date parameter."""
        container_id = "container-04"
        date = "2025-01-30T10:30:00Z"
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/nursery?date={date}"
        )

        assert response.status_code == 200
        data = response.json()
        assert "utilization_percentage" in data

    def test_get_nursery_station_data_invalid_date(self, client: TestClient):
        """Test getting nursery station data with invalid date format."""
        container_id = "container-04"
        date = "invalid-date"
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/nursery?date={date}"
        )

        assert response.status_code == 400
        data = response.json()
        assert "Invalid date format" in data["detail"]

    def test_get_nursery_station_data_nonexistent_container(self, client: TestClient):
        """Test getting nursery station data for non-existent container."""
        container_id = "nonexistent-container"
        response = client.get(f"/api/v1/containers/{container_id}/inventory/nursery")

        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Container not found"

    def test_get_cultivation_area_data_success(self, client: TestClient):
        """Test getting cultivation area data - success case."""
        container_id = "container-04"
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/cultivation"
        )

        assert response.status_code == 200
        data = response.json()

        # Verify cultivation area data structure
        assert "utilization_percentage" in data
        assert isinstance(data["utilization_percentage"], int)
        assert 0 <= data["utilization_percentage"] <= 100

        # Verify walls structure
        assert "walls" in data
        assert len(data["walls"]) == 4  # 4 walls

        for wall in data["walls"]:
            assert "wall_number" in wall
            assert "name" in wall
            assert "slots" in wall
            assert 1 <= wall["wall_number"] <= 4
            assert len(wall["slots"]) == 22  # 22 slots per wall

            # Verify slot structure
            for slot in wall["slots"]:
                assert "slot_number" in slot
                assert "occupied" in slot
                assert isinstance(slot["occupied"], bool)
                assert 1 <= slot["slot_number"] <= 22

                if slot["occupied"]:
                    assert slot["panel"] is not None
                    panel = slot["panel"]
                    assert "id" in panel
                    assert "utilization_percentage" in panel
                    assert "crop_count" in panel
                    assert "utilization_level" in panel
                    assert "rfid_tag" in panel
                    assert "wall" in panel
                    assert "slot_number" in panel
                    assert "channels" in panel
                    assert isinstance(panel["channels"], list)

                    # Verify channel structure
                    for channel in panel["channels"]:
                        assert "channel_number" in channel
                        assert "crops" in channel
                        assert isinstance(channel["crops"], list)

                        # Verify crop structure if crops exist
                        for crop in channel["crops"]:
                            assert "id" in crop
                            assert "seed_type" in crop
                            assert "age_days" in crop
                            assert "seeded_date" in crop
                            assert "health_status" in crop
                            assert "size" in crop
                            assert "channel" in crop
                            assert "position" in crop
                else:
                    assert slot["panel"] is None

        # Verify overflow panels
        assert "overflow_panels" in data
        assert isinstance(data["overflow_panels"], list)

        for panel in data["overflow_panels"]:
            assert "id" in panel
            assert "utilization_percentage" in panel
            assert "crop_count" in panel
            assert "utilization_level" in panel
            assert "rfid_tag" in panel
            assert panel["is_on_wall"] is False

    def test_get_cultivation_area_data_with_date(self, client: TestClient):
        """Test getting cultivation area data with date parameter."""
        container_id = "container-04"
        date = "2025-01-30T10:30:00Z"
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/cultivation?date={date}"
        )

        assert response.status_code == 200
        data = response.json()
        assert "utilization_percentage" in data

    def test_get_cultivation_area_data_nonexistent_container(self, client: TestClient):
        """Test getting cultivation area data for non-existent container."""
        container_id = "nonexistent-container"
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/cultivation"
        )

        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Container not found"

    def test_provision_tray_success(self, client: TestClient):
        """Test provisioning a new tray - success case."""
        container_id = "container-04"
        tray_data = {
            "utilization_percentage": 50,
            "crop_count": 100,
            "utilization_level": "medium",
            "rfid_tag": "TEST123456",
            "location": {"shelf": "upper", "slot_number": 7},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )

        assert response.status_code == 200
        data = response.json()

        assert "id" in data
        assert data["rfid_tag"] == "TEST123456"
        assert data["location"]["shelf"] == "upper"
        assert data["location"]["slot_number"] == 7
        assert data["status"] == "available"
        assert "provisioned_at" in data

    def test_provision_tray_off_shelf(self, client: TestClient):
        """Test provisioning a tray off-shelf."""
        container_id = "container-04"
        tray_data = {
            "utilization_percentage": 30,
            "crop_count": 60,
            "utilization_level": "low",
            "rfid_tag": "OFFSHELF123",
            "location": {},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )

        assert response.status_code == 200
        data = response.json()

        assert "id" in data
        assert data["rfid_tag"] == "OFFSHELF123"
        assert data["location"]["shelf"] is None
        assert data["location"]["slot_number"] is None

    def test_provision_tray_invalid_shelf(self, client: TestClient):
        """Test provisioning a tray with invalid shelf."""
        container_id = "container-04"
        tray_data = {
            "utilization_percentage": 50,
            "crop_count": 100,
            "utilization_level": "medium",
            "rfid_tag": "INVALID123",
            "location": {"shelf": "invalid_shelf", "slot_number": 5},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )

        assert response.status_code == 400
        data = response.json()
        assert "Shelf must be 'upper' or 'lower'" in data["detail"]

    def test_provision_tray_invalid_slot_number(self, client: TestClient):
        """Test provisioning a tray with invalid slot number."""
        container_id = "container-04"
        tray_data = {
            "utilization_percentage": 50,
            "crop_count": 100,
            "utilization_level": "medium",
            "rfid_tag": "INVALID123",
            "location": {
                "shelf": "upper",
                "slot_number": 15,  # Invalid - should be 1-8
            },
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )

        assert response.status_code == 400
        data = response.json()
        assert "Slot number must be between 1 and 8" in data["detail"]

    def test_provision_tray_nonexistent_container(self, client: TestClient):
        """Test provisioning a tray for non-existent container."""
        container_id = "nonexistent-container"
        tray_data = {
            "utilization_percentage": 50,
            "crop_count": 100,
            "utilization_level": "medium",
            "rfid_tag": "TEST123456",
            "location": {"shelf": "upper", "slot_number": 5},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )

        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Container not found"

    def test_provision_panel_success(self, client: TestClient):
        """Test provisioning a new panel - success case."""
        container_id = "container-04"
        panel_data = {
            "utilization_percentage": 60,
            "crop_count": 36,
            "utilization_level": "medium",
            "rfid_tag": "PANEL123456",
            "location": {"wall": "wall_3", "slot_number": 10},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/panels", json=panel_data
        )

        assert response.status_code == 200
        data = response.json()

        assert "id" in data
        assert data["rfid_tag"] == "PANEL123456"
        assert data["location"]["wall"] == "wall_3"
        assert data["location"]["slot_number"] == 10
        assert data["status"] == "available"
        assert "provisioned_at" in data

    def test_provision_panel_overflow(self, client: TestClient):
        """Test provisioning an overflow panel."""
        container_id = "container-04"
        panel_data = {
            "utilization_percentage": 80,
            "crop_count": 48,
            "utilization_level": "high",
            "rfid_tag": "OVERFLOW123",
            "location": {},
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/panels", json=panel_data
        )

        assert response.status_code == 200
        data = response.json()

        assert "id" in data
        assert data["rfid_tag"] == "OVERFLOW123"
        assert data["location"]["wall"] is None
        assert data["location"]["slot_number"] is None

    def test_provision_panel_invalid_wall(self, client: TestClient):
        """Test provisioning a panel with invalid wall."""
        container_id = "container-04"
        panel_data = {
            "utilization_percentage": 60,
            "crop_count": 36,
            "utilization_level": "medium",
            "rfid_tag": "INVALID123",
            "location": {
                "wall": "wall_5",  # Invalid - should be wall_1 to wall_4
                "slot_number": 10,
            },
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/panels", json=panel_data
        )

        assert response.status_code == 400
        data = response.json()
        assert "Wall must be one of: wall_1, wall_2, wall_3, wall_4" in data["detail"]

    def test_provision_panel_invalid_slot_number(self, client: TestClient):
        """Test provisioning a panel with invalid slot number."""
        container_id = "container-04"
        panel_data = {
            "utilization_percentage": 60,
            "crop_count": 36,
            "utilization_level": "medium",
            "rfid_tag": "INVALID123",
            "location": {
                "wall": "wall_1",
                "slot_number": 25,  # Invalid - should be 1-22
            },
        }

        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/panels", json=panel_data
        )

        assert response.status_code == 400
        data = response.json()
        assert "Slot number must be between 1 and 22" in data["detail"]

    def test_get_crop_history_success(self, client: TestClient):
        """Test getting crop history - success case."""
        container_id = "container-04"
        crop_id = "crop-nursery-001"
        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
        )

        assert response.status_code == 200
        data = response.json()

        assert "crop_id" in data
        assert data["crop_id"] == crop_id
        assert "history" in data
        assert isinstance(data["history"], list)

        # Verify history event structure
        for event in data["history"]:
            assert "date" in event
            assert "event" in event
            assert "location" in event
            assert "health_status" in event
            assert "size" in event
            assert "notes" in event
            assert event["health_status"] in [
                "healthy",
                "treatment_required",
                "to_be_disposed",
            ]
            assert event["size"] in ["small", "medium", "large"]

    def test_get_crop_history_with_date_range(self, client: TestClient):
        """Test getting crop history with date range."""
        container_id = "container-04"
        crop_id = "crop-nursery-001"
        start_date = "2025-01-01T00:00:00Z"
        end_date = "2025-01-31T23:59:59Z"

        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
            f"?start_date={start_date}&end_date={end_date}"
        )

        assert response.status_code == 200
        data = response.json()
        assert "crop_id" in data
        assert "history" in data

    def test_get_crop_history_invalid_start_date(self, client: TestClient):
        """Test getting crop history with invalid start date."""
        container_id = "container-04"
        crop_id = "crop-nursery-001"
        start_date = "invalid-date"

        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
            f"?start_date={start_date}"
        )

        assert response.status_code == 400
        data = response.json()
        assert "Invalid start_date format" in data["detail"]

    def test_get_crop_history_invalid_end_date(self, client: TestClient):
        """Test getting crop history with invalid end date."""
        container_id = "container-04"
        crop_id = "crop-nursery-001"
        end_date = "invalid-date"

        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
            f"?end_date={end_date}"
        )

        assert response.status_code == 400
        data = response.json()
        assert "Invalid end_date format" in data["detail"]

    def test_get_crop_history_nonexistent_container(self, client: TestClient):
        """Test getting crop history for non-existent container."""
        container_id = "nonexistent-container"
        crop_id = "crop-nursery-001"
        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
        )

        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Container not found"

    def test_get_crop_history_nonexistent_crop(self, client: TestClient):
        """Test getting history for non-existent crop."""
        container_id = "container-04"
        crop_id = "nonexistent-crop"
        response = client.get(
            f"/api/v1/containers/{container_id}/crops/{crop_id}/history"
        )

        assert response.status_code == 200
        data = response.json()
        assert data["crop_id"] == crop_id
        assert data["history"] == []


class TestInventoryIntegration:
    """Integration tests for inventory endpoints."""

    def test_full_inventory_workflow(self, client: TestClient):
        """Test complete workflow: get data, provision tray/panel, get data again."""
        container_id = "container-04"

        # 1. Get initial nursery data
        response = client.get(f"/api/v1/containers/{container_id}/inventory/nursery")
        assert response.status_code == 200

        # 2. Provision a new tray
        tray_data = {
            "utilization_percentage": 70,
            "crop_count": 140,
            "utilization_level": "high",
            "rfid_tag": "WORKFLOW123",
            "location": {"shelf": "upper", "slot_number": 8},
        }
        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/trays", json=tray_data
        )
        assert response.status_code == 200

        # 3. Get updated nursery data
        response = client.get(f"/api/v1/containers/{container_id}/inventory/nursery")
        assert response.status_code == 200
        updated_nursery = response.json()

        # 4. Verify the tray was added
        upper_slots = updated_nursery["upper_shelf"]["slots"]
        slot_8 = next(slot for slot in upper_slots if slot["slot_number"] == 8)
        assert slot_8["occupied"] is True
        assert slot_8["tray"]["rfid_tag"] == "WORKFLOW123"

        # 5. Get initial cultivation data
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/cultivation"
        )
        assert response.status_code == 200

        # 6. Provision a new panel
        panel_data = {
            "utilization_percentage": 85,
            "crop_count": 51,
            "utilization_level": "high",
            "rfid_tag": "WORKFLOW456",
            "location": {"wall": "wall_4", "slot_number": 22},
        }
        response = client.post(
            f"/api/v1/containers/{container_id}/inventory/panels", json=panel_data
        )
        assert response.status_code == 200

        # 7. Get updated cultivation data
        response = client.get(
            f"/api/v1/containers/{container_id}/inventory/cultivation"
        )
        assert response.status_code == 200
        updated_cultivation = response.json()

        # 8. Verify the panel was added
        wall_4 = next(
            wall for wall in updated_cultivation["walls"] if wall["wall_number"] == 4
        )
        slot_22 = next(slot for slot in wall_4["slots"] if slot["slot_number"] == 22)
        assert slot_22["occupied"] is True
        assert slot_22["panel"]["rfid_tag"] == "WORKFLOW456"
