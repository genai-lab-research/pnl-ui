from fastapi import status
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_container_from_form_physical():
    """Test creating a physical container from page2 form data."""
    form_data = {
        "name": "test-farm-container-05",
        "tenant": "tenant-001",
        "type": "PHYSICAL",
        "purpose": "Development",
        "seed_types": ["Someroots", "Basil"],
        "location": "Kyiv, Ukraine",
        "notes": "Test container for development purposes",
        "shadow_service_enabled": True,
        "connect_to_other_systems": True,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["name"] == form_data["name"]
    assert data["type"] == form_data["type"]
    assert data["tenant_name"] == form_data["tenant"]
    assert data["purpose"] == form_data["purpose"]
    assert data["location_city"] == "Kyiv"
    assert data["location_country"] == "Ukraine"
    assert data["status"] == "CREATED"
    assert data["shadow_service_enabled"] == True
    assert data["ecosystem_connected"] == True
    assert data["has_alerts"] == False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_container_from_form_virtual():
    """Test creating a virtual container from page2 form data."""
    form_data = {
        "name": "test-virtual-container-01",
        "tenant": "tenant-002",
        "type": "VIRTUAL",
        "purpose": "Research",
        "seed_types": ["Lettuce", "Kale"],
        "location": "Remote",
        "notes": "Virtual container for research",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["name"] == form_data["name"]
    assert data["type"] == form_data["type"]
    assert data["purpose"] == form_data["purpose"]
    assert data["shadow_service_enabled"] == False
    assert data["ecosystem_connected"] == False


def test_create_container_from_form_production():
    """Test creating a production container with appropriate system integrations."""
    form_data = {
        "name": "production-container-01",
        "tenant": "tenant-003",
        "type": "PHYSICAL",
        "purpose": "Production",
        "seed_types": ["Microgreens", "Arugula"],
        "location": "Warsaw, Poland",
        "notes": "Production environment container",
        "shadow_service_enabled": True,
        "connect_to_other_systems": True,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["purpose"] == "Production"
    assert data["ecosystem_connected"] == True

    # For production purposes, system integrations should use production environments
    # This is tested through the service logic


def test_create_container_from_form_minimal():
    """Test creating a container with minimal required data."""
    form_data = {
        "name": "minimal-container",
        "tenant": "tenant-004",
        "type": "PHYSICAL",
        "purpose": "Development",
        "seed_types": ["Spinach"],
        "location": "Berlin, Germany",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["name"] == form_data["name"]
    assert data["notes"] == ""  # Should default to empty string
    assert data["shadow_service_enabled"] == False
    assert data["ecosystem_connected"] == False


def test_create_container_from_form_validation_errors():
    """Test validation errors for container form creation."""
    # Missing required field
    invalid_form_data = {
        "tenant": "tenant-001",
        "type": "PHYSICAL",
        "purpose": "Development",
        "seed_types": ["Someroots"],
        "location": "Test Location",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
        # Missing required 'name' field
    }

    response = client.post("/api/containers/create-from-form", json=invalid_form_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_container_from_form_invalid_type():
    """Test creating container with invalid type."""
    form_data = {
        "name": "test-container",
        "tenant": "tenant-001",
        "type": "INVALID_TYPE",
        "purpose": "Development",
        "seed_types": ["Someroots"],
        "location": "Test Location",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_container_from_form_invalid_purpose():
    """Test creating container with invalid purpose."""
    form_data = {
        "name": "test-container",
        "tenant": "tenant-001",
        "type": "PHYSICAL",
        "purpose": "InvalidPurpose",
        "seed_types": ["Someroots"],
        "location": "Test Location",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_container_from_form_empty_seed_types():
    """Test creating container with empty seed types list."""
    form_data = {
        "name": "test-container-empty-seeds",
        "tenant": "tenant-001",
        "type": "PHYSICAL",
        "purpose": "Development",
        "seed_types": [],  # Empty list should be allowed
        "location": "Test Location",
        "shadow_service_enabled": False,
        "connect_to_other_systems": False,
    }

    response = client.post("/api/containers/create-from-form", json=form_data)
    assert response.status_code == status.HTTP_201_CREATED

    data = response.json()
    assert data["name"] == form_data["name"]


def test_location_parsing():
    """Test that location string is properly parsed into city and country."""
    test_cases = [
        ("New York, USA", "New York", "USA"),
        ("London, UK", "London", "UK"),
        ("Single Location", "Single Location", ""),
        ("", "", ""),
    ]

    for location, expected_city, expected_country in test_cases:
        form_data = {
            "name": f"test-container-{location.replace(' ', '-').replace(',', '')}",
            "tenant": "tenant-001",
            "type": "PHYSICAL",
            "purpose": "Development",
            "seed_types": ["Someroots"],
            "location": location,
            "shadow_service_enabled": False,
            "connect_to_other_systems": False,
        }

        response = client.post("/api/containers/create-from-form", json=form_data)
        assert response.status_code == status.HTTP_201_CREATED

        data = response.json()
        assert data["location_city"] == expected_city
        assert data["location_country"] == expected_country
