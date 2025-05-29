#!/usr/bin/env python3
"""
Standalone test for container API endpoints.
Tests the complete backend implementation without database dependencies.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from fastapi.testclient import TestClient
from app.api.routes.containers import router
from fastapi import FastAPI

# Create a test app with just the containers router
app = FastAPI()
app.include_router(router, prefix="/containers")

client = TestClient(app)


def test_get_container_by_id_success():
    """Test getting a container by ID - success case."""
    container_id = "container-04"
    response = client.get(f"/containers/{container_id}")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify container data structure
    assert data["id"] == container_id
    assert data["name"] == "farm-container-04"
    assert data["type"] == "PHYSICAL"
    assert data["tenant"] == "tenant-123"
    assert data["purpose"] == "Development"
    assert data["status"] == "ACTIVE"
    assert data["creator"] == "Mia Adams"
    assert data["seed_types"] == ["Someroots", "sunflower", "Someroots", "Someroots"]
    assert data["notes"] == "Primary production container for Farm A."
    assert data["shadow_service_enabled"] is False
    assert data["ecosystem_connected"] is True
    
    # Verify location structure
    assert "location" in data
    assert data["location"]["city"] == "Lviv"
    assert data["location"]["country"] == "Ukraine"
    assert data["location"]["address"] == "123 Innovation Park"
    
    # Verify system integrations
    assert "system_integrations" in data
    integrations = data["system_integrations"]
    assert integrations["fa_integration"]["name"] == "Alpha"
    assert integrations["fa_integration"]["enabled"] is True
    assert integrations["aws_environment"]["name"] == "Dev"
    assert integrations["aws_environment"]["enabled"] is True
    assert integrations["mbai_environment"]["name"] == "Disabled"
    assert integrations["mbai_environment"]["enabled"] is False

    print("✓ test_get_container_by_id_success passed")


def test_get_container_by_id_not_found():
    """Test getting a container by ID - not found case."""
    response = client.get("/containers/non-existent-id")
    
    assert response.status_code == 404
    assert "Container not found" in response.json()["detail"]
    
    print("✓ test_get_container_by_id_not_found passed")


def test_get_containers_list():
    """Test getting list of containers."""
    response = client.get("/containers/")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "data" in data
    assert "count" in data
    assert isinstance(data["data"], list)
    assert data["count"] >= 1
    
    # Verify first container
    first_container = data["data"][0]
    assert "id" in first_container
    assert "name" in first_container
    assert "type" in first_container
    
    print("✓ test_get_containers_list passed")


def test_get_container_metrics_success():
    """Test getting container metrics - success case."""
    container_id = "container-04"
    response = client.get(f"/containers/{container_id}/metrics")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify metrics structure
    required_metrics = ["temperature", "humidity", "co2", "yield", "nursery_utilization", "cultivation_utilization"]
    for metric in required_metrics:
        assert metric in data
        metric_data = data[metric]
        assert "current" in metric_data
        assert "unit" in metric_data
        assert isinstance(metric_data["current"], (int, float))
        assert isinstance(metric_data["unit"], str)
    
    # Verify specific values from mock data
    assert data["temperature"]["current"] == 20
    assert data["temperature"]["unit"] == "°C"
    assert data["temperature"]["target"] == 21
    
    assert data["humidity"]["current"] == 65
    assert data["humidity"]["unit"] == "%"
    assert data["humidity"]["target"] == 68
    
    assert data["co2"]["current"] == 860
    assert data["co2"]["unit"] == "ppm"
    assert data["co2"]["target"] == 800
    
    print("✓ test_get_container_metrics_success passed")


def test_get_container_crops_success():
    """Test getting container crops - success case."""
    container_id = "container-04"
    response = client.get(f"/containers/{container_id}/crops")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify crops structure
    assert "total" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["total"] == 4
    
    # Verify first crop
    first_crop = data["results"][0]
    required_fields = ["id", "seed_type", "cultivation_area", "nursery_table", "last_sd", "last_td", "last_hd", "avg_age", "overdue"]
    for field in required_fields:
        assert field in first_crop
    
    # Verify specific values from mock data
    assert first_crop["seed_type"] == "Salanova Cousteau"
    assert first_crop["cultivation_area"] == 40
    assert first_crop["nursery_table"] == 30
    
    print("✓ test_get_container_crops_success passed")


def test_get_container_activities_success():
    """Test getting container activities - success case."""
    container_id = "container-04"
    response = client.get(f"/containers/{container_id}/activities")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify activities structure
    assert "activities" in data
    assert isinstance(data["activities"], list)
    assert len(data["activities"]) <= 5  # Default limit
    
    # Verify first activity
    first_activity = data["activities"][0]
    required_fields = ["id", "type", "timestamp", "description", "user", "details"]
    for field in required_fields:
        assert field in first_activity
    
    # Verify user structure
    user = first_activity["user"]
    assert "name" in user
    assert "role" in user
    
    # Verify specific values from mock data (activities are sorted by timestamp desc)
    assert first_activity["type"] in ["SEEDED", "SYNCED", "ENVIRONMENT_CHANGED", "CREATED", "MAINTENANCE"]
    
    print("✓ test_get_container_activities_success passed")


def test_create_container_success():
    """Test creating a new container - success case."""
    container_data = {
        "name": "test-container-01",
        "type": "VIRTUAL",
        "tenant": "test-tenant",
        "purpose": "Research",
        "location": {
            "city": "Kyiv",
            "country": "Ukraine",
            "address": "456 Research Ave"
        },
        "status": "CREATED",
        "creator": "Test User",
        "seed_types": ["Lettuce", "Spinach"],
        "notes": "Test container for research purposes",
        "shadow_service_enabled": True,
        "ecosystem_connected": False,
        "system_integrations": {
            "fa_integration": {
                "name": "Dev",
                "enabled": False
            },
            "aws_environment": {
                "name": "Test",
                "enabled": True
            },
            "mbai_environment": {
                "name": "Disabled",
                "enabled": False
            }
        }
    }
    
    response = client.post("/containers/", json=container_data)
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify created container
    assert data["name"] == container_data["name"]
    assert data["type"] == container_data["type"]
    assert data["tenant"] == container_data["tenant"]
    assert "id" in data
    assert "created" in data
    assert "modified" in data
    
    print("✓ test_create_container_success passed")


def test_update_container_success():
    """Test updating an existing container - success case."""
    container_id = "container-04"
    update_data = {
        "notes": "Updated notes for this container",
        "status": "MAINTENANCE"
    }
    
    response = client.put(f"/containers/{container_id}", json=update_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["notes"] == update_data["notes"]
    assert data["status"] == update_data["status"]
    
    print("✓ test_update_container_success passed")


def test_delete_container_success():
    """Test deleting a container - success case."""
    # First create a container to delete
    container_data = {
        "name": "to-be-deleted",
        "type": "VIRTUAL",
        "tenant": "test-tenant",
        "purpose": "Development",
        "location": {
            "city": "Test City",
            "country": "Test Country",
            "address": "Test Address"
        },
        "status": "CREATED",
        "creator": "Test User",
        "seed_types": [],
        "notes": "Container to be deleted",
        "shadow_service_enabled": False,
        "ecosystem_connected": False,
        "system_integrations": {
            "fa_integration": {"name": "Dev", "enabled": False},
            "aws_environment": {"name": "Dev", "enabled": False},
            "mbai_environment": {"name": "Disabled", "enabled": False}
        }
    }
    
    create_response = client.post("/containers/", json=container_data)
    assert create_response.status_code == 200
    created_container = create_response.json()
    container_id = created_container["id"]
    
    # Now delete the container
    delete_response = client.delete(f"/containers/{container_id}")
    
    assert delete_response.status_code == 200
    assert "deleted successfully" in delete_response.json()["message"]
    
    # Verify container is deleted
    get_response = client.get(f"/containers/{container_id}")
    assert get_response.status_code == 404
    
    print("✓ test_delete_container_success passed")


def run_all_tests():
    """Run all container API tests."""
    print("Running Container API Tests")
    print("=" * 50)
    
    try:
        test_get_container_by_id_success()
        test_get_container_by_id_not_found()
        test_get_containers_list()
        test_get_container_metrics_success()
        test_get_container_crops_success()
        test_get_container_activities_success()
        test_create_container_success()
        test_update_container_success()
        test_delete_container_success()
        
        print("\n" + "=" * 50)
        print("✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)