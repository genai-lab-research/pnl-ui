"""Seed data for MetricSnapshot model using Faker"""
from typing import List, Dict, Any
from datetime import datetime, timedelta
from faker import Faker
import random

fake = Faker()

def generate_metric_snapshots(container_count: int = 12, days_back: int = 30) -> List[Dict[str, Any]]:
    """Generate metric snapshot data using Faker
    
    Args:
        container_count: Number of containers to generate snapshots for
        days_back: How many days back to generate snapshots
    
    Returns:
        List of metric snapshot dictionaries
    """
    snapshots = []
    
    # Generate snapshots for each container
    for container_id in range(1, container_count + 1):
        # Generate multiple snapshots per day for the past days_back days
        for day in range(days_back):
            # Generate 4-6 snapshots per day (every 4-6 hours)
            snapshots_per_day = random.randint(4, 6)
            
            for snapshot_num in range(snapshots_per_day):
                # Calculate timestamp
                base_time = datetime.now() - timedelta(days=day)
                hour_offset = (24 // snapshots_per_day) * snapshot_num
                timestamp = base_time.replace(
                    hour=hour_offset % 24,
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )
                
                # Generate realistic metrics
                snapshot = {
                    "container_id": container_id,
                    "timestamp": timestamp,
                    "air_temperature": round(random.uniform(18.0, 26.0), 1),  # 18-26°C optimal range
                    "humidity": round(random.uniform(60.0, 80.0), 1),  # 60-80% humidity
                    "co2": round(random.uniform(400, 1200), 0),  # 400-1200 ppm CO2
                    "yield_kg": round(random.uniform(0.5, 15.0), 2),  # 0.5-15 kg yield
                    "space_utilization_pct": round(random.uniform(70.0, 95.0), 1),  # 70-95% utilization
                }
                
                snapshots.append(snapshot)
    
    return snapshots

def generate_metric_snapshots_with_trends(container_count: int = 12, days_back: int = 30) -> List[Dict[str, Any]]:
    """Generate metric snapshot data with realistic trends and seasonality
    
    Args:
        container_count: Number of containers to generate snapshots for
        days_back: How many days back to generate snapshots
    
    Returns:
        List of metric snapshot dictionaries with trends
    """
    snapshots = []
    
    # Generate snapshots for each container
    for container_id in range(1, container_count + 1):
        # Set container-specific baseline values
        base_temp = random.uniform(20.0, 24.0)
        base_humidity = random.uniform(65.0, 75.0)
        base_co2 = random.uniform(600, 900)
        base_yield = random.uniform(2.0, 8.0)
        base_utilization = random.uniform(80.0, 90.0)
        
        # Generate multiple snapshots per day for the past days_back days
        for day in range(days_back):
            # Generate 4-6 snapshots per day (every 4-6 hours)
            snapshots_per_day = random.randint(4, 6)
            
            for snapshot_num in range(snapshots_per_day):
                # Calculate timestamp
                base_time = datetime.now() - timedelta(days=day)
                hour_offset = (24 // snapshots_per_day) * snapshot_num
                timestamp = base_time.replace(
                    hour=hour_offset % 24,
                    minute=random.randint(0, 59),
                    second=random.randint(0, 59)
                )
                
                # Add daily and seasonal variations
                day_cycle = (snapshot_num / snapshots_per_day) * 2 * 3.14159  # Full day cycle
                seasonal_factor = 1 + 0.1 * (day / days_back)  # Slight seasonal trend
                
                # Temperature varies with time of day
                temp_variation = 2.0 * (0.5 + 0.3 * random.random() + 0.2 * (1 + math.sin(day_cycle)))
                air_temperature = base_temp + temp_variation - 1.0
                
                # Humidity inversely correlated with temperature
                humidity_variation = -0.8 * temp_variation + random.uniform(-3.0, 3.0)
                humidity = base_humidity + humidity_variation
                
                # CO2 varies with plant activity (inverse to light/temperature)
                co2_variation = -50 * math.sin(day_cycle) + random.uniform(-100, 100)
                co2 = base_co2 + co2_variation
                
                # Yield slowly increases over time with some randomness
                yield_trend = (days_back - day) * 0.02  # Slow growth over time
                yield_kg = base_yield + yield_trend + random.uniform(-0.5, 0.5)
                
                # Space utilization varies slightly
                utilization_variation = random.uniform(-5.0, 5.0)
                space_utilization_pct = base_utilization + utilization_variation
                
                # Generate realistic metrics with bounds
                snapshot = {
                    "container_id": container_id,
                    "timestamp": timestamp,
                    "air_temperature": round(max(16.0, min(30.0, air_temperature)), 1),
                    "humidity": round(max(50.0, min(90.0, humidity)), 1),
                    "co2": round(max(300, min(1500, co2)), 0),
                    "yield_kg": round(max(0.1, min(20.0, yield_kg)), 2),
                    "space_utilization_pct": round(max(60.0, min(100.0, space_utilization_pct)), 1),
                }
                
                snapshots.append(snapshot)
    
    # Sort by timestamp for realistic ordering
    snapshots.sort(key=lambda x: x["timestamp"])
    return snapshots

# Import math for sine functions
import math

# Generate the actual seed data
metric_snapshot_seeds = generate_metric_snapshots_with_trends(container_count=12, days_back=30)
