#!/usr/bin/env python3
"""Integration test script for the Container Management API
This is not a unit test - it's an integration test that requires a running server.
Run this separately from pytest.
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def integration_test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.status_code} - {response.json()}")
    assert response.status_code == 200

def integration_test_create_location():
    """Test creating a location"""
    location_data = {
        "city": "New York",
        "country": "USA", 
        "address": "123 Main St"
    }
    response = requests.post(f"{BASE_URL}/api/locations/", json=location_data)
    print(f"Create location: {response.status_code}")
    if response.status_code == 201:
        location = response.json()
        print(f"Created location: {location}")
        return location["id"]
    else:
        print(f"Error: {response.text}")
        return None

def integration_test_list_locations():
    """Test listing locations"""
    response = requests.get(f"{BASE_URL}/api/locations/")
    print(f"List locations: {response.status_code}")
    if response.status_code == 200:
        locations = response.json()
        print(f"Found {len(locations)} locations")
        return locations
    else:
        print(f"Error: {response.text}")
        return []

def integration_test_create_container(location_id):
    """Test creating a container"""
    container_data = {
        "id": "container-001",
        "type": "physical",
        "name": "Test Container",
        "tenant": "tenant-001",
        "purpose": "development",
        "location_id": location_id,
        "status": "active",
        "seed_types": ["seed-type-1", "seed-type-2"],
        "has_alert": False,
        "notes": "Test container for API validation",
        "shadow_service_enabled": True,
        "ecosystem_connected": True
    }
    response = requests.post(f"{BASE_URL}/api/containers/", json=container_data)
    print(f"Create container: {response.status_code}")
    if response.status_code == 201:
        container = response.json()
        print(f"Created container: {container['id']}")
        return container
    else:
        print(f"Error: {response.text}")
        return None

def integration_test_list_containers():
    """Test listing containers"""
    response = requests.get(f"{BASE_URL}/api/containers/")
    print(f"List containers: {response.status_code}")
    if response.status_code == 200:
        containers = response.json()
        print(f"Found {len(containers)} containers")
        return containers
    else:
        print(f"Error: {response.text}")
        return []

def integration_test_cors():
    """Test CORS configuration"""
    headers = {"Origin": "http://localhost:3000"}
    response = requests.get(f"{BASE_URL}/health", headers=headers)
    print(f"CORS test: {response.status_code}")
    cors_headers = response.headers.get('access-control-allow-origin')
    print(f"CORS headers: {cors_headers}")
    assert cors_headers == "http://localhost:3000"

def main():
    """Run all tests"""
    print("=== Container Management API Tests ===\n")
    
    # Test health
    integration_test_health()
    
    # Test CORS
    integration_test_cors()
    
    # Test locations
    print("\n--- Testing Locations ---")
    location_id = integration_test_create_location()
    if not location_id:
        print("Failed to create location!")
        sys.exit(1)
    
    locations = integration_test_list_locations()
    
    # Test containers
    print("\n--- Testing Containers ---")
    container = integration_test_create_container(location_id)
    if not container:
        print("Failed to create container!")
        sys.exit(1)
    
    containers = integration_test_list_containers()
    
    print("\n=== All tests completed successfully! ===")

if __name__ == "__main__":
    main()