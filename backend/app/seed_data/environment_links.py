import random
from faker import Faker
from typing import Dict, Any, List

fake = Faker()

def create_environment_links_seed_data(container_count: int = 50) -> List[Dict[str, Any]]:
    """Generate seed data for environment_links table"""
    environment_links_seeds = []
    
    for i in range(1, container_count + 1):
        # 70% chance a container has environment links
        if fake.boolean(chance_of_getting_true=70):
            fa_config = {
                "endpoint": fake.url(),
                "auth_token": fake.uuid4(),
                "environment": fake.random_element(["alpha", "prod"]),
                "last_sync": fake.date_time_this_year().isoformat(),
                "status": fake.random_element(["connected", "disconnected", "error"])
            }
            
            pya_config = {
                "api_url": fake.url(),
                "credentials": {
                    "username": fake.user_name(),
                    "password": fake.password()
                },
                "sync_enabled": fake.boolean(),
                "last_activity": fake.date_time_this_month().isoformat()
            }
            
            aws_config = {
                "region": fake.random_element(["us-west-2", "us-east-1", "eu-central-1"]),
                "access_key": fake.pystr(min_chars=20, max_chars=20).upper(),
                "secret_key": fake.pystr(min_chars=40, max_chars=40),
                "bucket": f"farm-data-{fake.slug()}",
                "iot_endpoint": fake.url()
            }
            
            mbai_config = {
                "model_endpoint": fake.url(),
                "api_version": fake.random_element(["v1", "v2", "v3"]),
                "prediction_threshold": round(random.uniform(0.6, 0.95), 2),
                "enabled_models": fake.random_elements(
                    elements=["crop_health", "growth_prediction", "yield_estimation", "pest_detection"],
                    length=random.randint(1, 4),
                    unique=True
                )
            }
            
            fh_config = {
                "farmhand_url": fake.url(),
                "environment": "prod",
                "auth_method": "oauth2",
                "client_id": fake.uuid4(),
                "client_secret": fake.sha256(),
                "scope": ["read", "write", "admin"] if fake.boolean(chance_of_getting_true=20) else ["read", "write"],
                "webhook_url": fake.url(),
                "sync_interval": fake.random_element([300, 600, 1800, 3600])  # seconds
            }
            
            environment_links_seeds.append({
                "container_id": i,
                "fa": fa_config,
                "pya": pya_config,
                "aws": aws_config,
                "mbai": mbai_config,
                "fh": fh_config
            })
        else:
            # Container without environment links (30% chance)
            environment_links_seeds.append({
                "container_id": i,
                "fa": None,
                "pya": None,
                "aws": None,
                "mbai": None,
                "fh": None
            })
    
    return environment_links_seeds


def create_large_environment_links_dataset(size: str = "medium") -> List[Dict[str, Any]]:
    """Create different sizes of environment links datasets"""
    size_mapping = {
        "small": 10,
        "medium": 50, 
        "large": 200,
        "xlarge": 1000
    }
    
    container_count = size_mapping.get(size, 50)
    return create_environment_links_seed_data(container_count)


# Sample data for immediate use
environment_links_sample = create_environment_links_seed_data(10)