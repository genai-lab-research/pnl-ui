import random
from datetime import datetime, timedelta
from faker import Faker
from typing import Dict, Any, List

fake = Faker()

def create_recipe_applications_seed_data(
    container_count: int = 50, 
    recipe_version_count: int = 20,
    applications_per_container: int = 5
) -> List[Dict[str, Any]]:
    """Generate seed data for recipe_applications table"""
    recipe_applications_seeds = []
    
    # List of users who apply recipes
    users = [
        "farm_manager", "lead_botanist", "cultivation_tech", 
        "system_admin", "research_scientist", "crop_specialist",
        "operations_lead", "automation_system"
    ]
    
    # Environment sync statuses
    sync_statuses = [
        "synced", "pending", "failed", "partial", 
        "manual_override", "timeout", "disconnected"
    ]
    
    application_id = 1
    
    for container_id in range(1, container_count + 1):
        # Generate 3-8 applications per container with realistic timing
        num_applications = random.randint(3, applications_per_container)
        
        # Start from 3 months ago and work forward
        current_date = fake.date_time_between(start_date='-90d', end_date='-60d')
        previous_recipe_id = None
        
        for app_num in range(num_applications):
            recipe_version_id = random.randint(1, recipe_version_count)
            applied_by = fake.random_element(users)
            
            # Generate realistic changes summary
            changes_summary = {}
            if previous_recipe_id:
                # Compare with previous recipe (simplified simulation)
                parameter_changes = {}
                if fake.boolean(chance_of_getting_true=70):
                    parameter_changes["air_temperature"] = {
                        "from": round(random.uniform(18, 26), 1),
                        "to": round(random.uniform(18, 26), 1)
                    }
                if fake.boolean(chance_of_getting_true=60):
                    parameter_changes["humidity"] = {
                        "from": round(random.uniform(60, 85), 1),
                        "to": round(random.uniform(60, 85), 1)
                    }
                if fake.boolean(chance_of_getting_true=50):
                    parameter_changes["ph"] = {
                        "from": round(random.uniform(5.5, 7.0), 1),
                        "to": round(random.uniform(5.5, 7.0), 1)
                    }
                if fake.boolean(chance_of_getting_true=40):
                    parameter_changes["light_hours"] = {
                        "from": round(random.uniform(12, 18), 1),
                        "to": round(random.uniform(12, 18), 1)
                    }
                
                changes_summary = {
                    "total_parameters_changed": len(parameter_changes),
                    "parameter_changes": parameter_changes,
                    "change_reason": fake.random_element([
                        "growth_optimization", "pest_prevention", "seasonal_adjustment",
                        "yield_improvement", "energy_efficiency", "crop_health_response"
                    ])
                }
            else:
                changes_summary = {
                    "initial_application": True,
                    "baseline_setup": True,
                    "change_reason": "initial_recipe_application"
                }
            
            recipe_applications_seeds.append({
                "id": application_id,
                "container_id": container_id,
                "recipe_version_id": recipe_version_id,
                "applied_at": current_date,
                "applied_by": applied_by,
                "previous_recipe_version_id": previous_recipe_id,
                "changes_summary": changes_summary,
                "environment_sync_status": fake.random_element(sync_statuses)
            })
            
            # Update for next iteration
            application_id += 1
            previous_recipe_id = recipe_version_id
            # Add 1-3 weeks between applications
            current_date += timedelta(days=random.randint(7, 21))
    
    return recipe_applications_seeds


def create_performance_test_applications(container_count: int = 200) -> List[Dict[str, Any]]:
    """Create large dataset for performance testing"""
    return create_recipe_applications_seed_data(
        container_count=container_count,
        recipe_version_count=50,
        applications_per_container=15
    )


def create_recipe_applications_by_size(size: str = "medium") -> List[Dict[str, Any]]:
    """Create different sizes of recipe application datasets"""
    size_mapping = {
        "small": {"containers": 10, "versions": 10, "apps": 3},
        "medium": {"containers": 50, "versions": 20, "apps": 5}, 
        "large": {"containers": 100, "versions": 30, "apps": 8},
        "xlarge": {"containers": 200, "versions": 50, "apps": 15}
    }
    
    config = size_mapping.get(size, size_mapping["medium"])
    return create_recipe_applications_seed_data(
        container_count=config["containers"],
        recipe_version_count=config["versions"],
        applications_per_container=config["apps"]
    )


# Edge case test data
def create_edge_case_applications() -> List[Dict[str, Any]]:
    """Create edge cases for testing"""
    edge_cases = []
    
    # Application with no previous recipe (use container ID 1)
    edge_cases.append({
        "id": 9999,
        "container_id": 1,
        "recipe_version_id": 1,
        "applied_at": datetime.now() - timedelta(days=1),
        "applied_by": "system_admin",
        "previous_recipe_version_id": None,
        "changes_summary": {"initial_application": True},
        "environment_sync_status": "synced"
    })
    
    # Application with sync failure (use container ID 2)
    edge_cases.append({
        "id": 10000,
        "container_id": 2,
        "recipe_version_id": 2,
        "applied_at": datetime.now(),
        "applied_by": "automation_system",
        "previous_recipe_version_id": 1,
        "changes_summary": {"emergency_override": True, "reason": "system_failure"},
        "environment_sync_status": "failed"
    })
    
    return edge_cases


# Sample data for immediate use
recipe_applications_sample = create_recipe_applications_seed_data(10, 5, 3)