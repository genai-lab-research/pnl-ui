from typing import Any, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.schemas.metrics import MetricSnapshot, MetricCreate, MetricResponse, MetricTimeRange

from app.models.models import MetricSnapshot as MetricSnapshotModel
from app.models.models import Container as ContainerModel
from app.models.models import Crop as CropModel
from app.models.enums import CropLifecycleStatus

router = APIRouter()


@router.post("/snapshots", response_model=MetricSnapshot, status_code=status.HTTP_201_CREATED)
def create_metric_snapshot(
    *,
    db: Session = Depends(get_db),
    metric_in: MetricCreate
) -> Any:
    """
    Create a new metric snapshot.
    
    - Requires a valid container ID
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == metric_in.container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Create new metric snapshot
    db_metric = MetricSnapshotModel(
        container_id=metric_in.container_id,
        air_temperature=metric_in.air_temperature,
        humidity=metric_in.humidity,
        co2=metric_in.co2,
        yield_kg=metric_in.yield_kg,
        space_utilization_percentage=metric_in.space_utilization_percentage,
        nursery_utilization_percentage=metric_in.nursery_utilization_percentage,
        cultivation_utilization_percentage=metric_in.cultivation_utilization_percentage,
        timestamp=metric_in.timestamp or datetime.utcnow()
    )
    
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    
    return db_metric


@router.get("/container/{container_id}", response_model=MetricResponse)
def get_container_metrics(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    time_range: MetricTimeRange = MetricTimeRange.WEEK,
    start_date: Optional[datetime] = None
) -> Any:
    """
    Get metrics for a specific container over a time range.
    
    - **time_range**: Time range for metrics (week, month, quarter, year)
    - **start_date**: Optional start date for the time range (defaults to current date)
    """
    # Try to get the container type to determine if it's physical or virtual
    try:
        container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
        if not container:
            # For demo, we'll default to physical if not found, but warn in logs
            container_type = "PHYSICAL"
            print(f"Container {container_id} not found, using PHYSICAL as default container type")
        else:
            container_type = container.type
    except:
        # Default to physical container if error
        container_type = "PHYSICAL"
        print(f"Error getting container {container_id}, using PHYSICAL as default container type")
    
    # Use container ID as a seed for consistent random numbers for this container
    container_seed = int(container_id.replace("-", "")[0:8], 16) % 10000 if container_id else 1234
    
    # Generate appropriate mock data based on time range and container type
    if time_range == MetricTimeRange.WEEK:
        return generate_weekly_container_metrics(container_id, container_type, container_seed)
    elif time_range == MetricTimeRange.MONTH:
        return generate_monthly_container_metrics(container_id, container_type, container_seed)
    elif time_range == MetricTimeRange.QUARTER:
        return generate_quarterly_container_metrics(container_id, container_type, container_seed) 
    else:  # MetricTimeRange.YEAR
        return generate_yearly_container_metrics(container_id, container_type, container_seed)


def generate_weekly_container_metrics(container_id: str, container_type: str = "PHYSICAL", seed: int = 1234) -> MetricResponse:
    """Generate mock weekly metrics data for a specific container"""
    import random
    from datetime import datetime, timedelta
    
    # Seed the random number generator for consistent results
    random.seed(seed)
    
    # Generate data for the last 7 days
    end_date = datetime.utcnow()
    days = []
    for i in range(6, -1, -1):
        days.append((end_date - timedelta(days=i)).strftime("%Y-%m-%d"))
    
    # Set base metrics adjusted by container type
    is_physical = container_type == "PHYSICAL"
    
    # Physical containers have higher yield and utilization rates
    base_yield = 2.5 if is_physical else 1.8
    base_utilization = 85 if is_physical else 70
    
    # Generate yield data with some variation
    yield_data = []
    for i, day in enumerate(days):
        # Add some daily variation with slight upward trend
        daily_factor = 0.95 + (i * 0.01) + random.uniform(-0.1, 0.1)
        yield_data.append({
            "date": day,
            "value": round(base_yield * daily_factor, 1)
        })
    
    # Generate space utilization data
    space_utilization_data = []
    for i, day in enumerate(days):
        # Add some daily variation with slight upward trend
        daily_factor = 0.95 + (i * 0.005) + random.uniform(-0.05, 0.05)
        space_utilization_data.append({
            "date": day,
            "value": round(base_utilization * daily_factor)
        })
    
    # Calculate averages and totals
    avg_yield = round(sum(item["value"] for item in yield_data) / len(yield_data), 1)
    total_yield = round(sum(item["value"] for item in yield_data), 1)
    avg_space_util = round(sum(item["value"] for item in space_utilization_data) / len(space_utilization_data), 1)
    
    # Generate current metrics with realistic values based on container type
    # Physical containers maintain more stable, optimal conditions
    temp_variance = 1.0 if is_physical else 2.0
    current_temp = round(21.0 + random.uniform(-temp_variance, temp_variance), 1)
    
    humidity_variance = 3 if is_physical else 5
    current_humidity = round(68.0 + random.uniform(-humidity_variance, humidity_variance), 1)
    
    co2_variance = 30 if is_physical else 50
    current_co2 = round(800.0 + random.uniform(-co2_variance, co2_variance), 1)
    
    # Crop counts are higher in physical containers
    crop_factor = 1.2 if is_physical else 0.8
    
    return MetricResponse(
        yield_data=yield_data,
        space_utilization_data=space_utilization_data,
        average_yield=avg_yield,
        total_yield=total_yield,
        average_space_utilization=avg_space_util,
        current_temperature=current_temp,
        current_humidity=current_humidity,
        current_co2=current_co2,
        crop_counts={
            "seeded": round(random.randint(20, 30) * crop_factor),
            "transplanted": round(random.randint(40, 60) * crop_factor),
            "harvested": round(random.randint(10, 20) * crop_factor)
        },
        is_daily=True
    )


def generate_monthly_container_metrics(container_id: str, container_type: str = "PHYSICAL", seed: int = 1234) -> MetricResponse:
    """Generate mock monthly metrics data for a specific container"""
    import random
    from datetime import datetime, timedelta
    
    # Seed the random number generator for consistent results
    random.seed(seed)
    
    # Generate data for the last 30 days
    end_date = datetime.utcnow()
    days = []
    for i in range(29, -1, -1):
        days.append((end_date - timedelta(days=i)).strftime("%Y-%m-%d"))
    
    # Set base metrics adjusted by container type
    is_physical = container_type == "PHYSICAL"
    
    # Physical containers have higher yield and utilization rates
    base_yield_start = 2.2 if is_physical else 1.5
    growth_rate = 0.025 if is_physical else 0.018  # Physical containers improve faster
    
    base_utilization = 82 if is_physical else 68
    
    # Generate yield data with some variation and upward trend
    yield_data = []
    for i, day in enumerate(days):
        # Base yield increases over the month with some daily fluctuation
        base_yield = base_yield_start + (i * growth_rate)
        
        # Add some random variation
        daily_factor = 0.9 + random.uniform(0, 0.2)
        
        yield_data.append({
            "date": day,
            "value": round(base_yield * daily_factor, 1)
        })
    
    # Generate space utilization data with fluctuations and slight upward trend
    space_utilization_data = []
    for i, day in enumerate(days):
        # Add slight improvement trend
        trend_factor = 1.0 + (i * 0.002)
        
        # More stable utilization in physical containers
        variance = 5 if is_physical else 8
        
        space_utilization_data.append({
            "date": day,
            "value": round(min(95, base_utilization * trend_factor + random.randint(-variance, variance)))
        })
    
    # Calculate averages and totals
    avg_yield = round(sum(item["value"] for item in yield_data) / len(yield_data), 1)
    total_yield = round(sum(item["value"] for item in yield_data), 1)
    avg_space_util = round(sum(item["value"] for item in space_utilization_data) / len(space_utilization_data), 1)
    
    # Generate current metrics with realistic values based on container type
    # Physical containers maintain more stable, optimal conditions
    temp_variance = 1.0 if is_physical else 2.0
    current_temp = round(21.0 + random.uniform(-temp_variance, temp_variance), 1)
    
    humidity_variance = 3 if is_physical else 5
    current_humidity = round(68.0 + random.uniform(-humidity_variance, humidity_variance), 1)
    
    co2_variance = 30 if is_physical else 50
    current_co2 = round(800.0 + random.uniform(-co2_variance, co2_variance), 1)
    
    # Crop counts are higher in physical containers
    crop_factor = 1.2 if is_physical else 0.8
    
    return MetricResponse(
        yield_data=yield_data,
        space_utilization_data=space_utilization_data,
        average_yield=avg_yield,
        total_yield=total_yield,
        average_space_utilization=avg_space_util,
        current_temperature=current_temp,
        current_humidity=current_humidity,
        current_co2=current_co2,
        crop_counts={
            "seeded": round(random.randint(20, 30) * crop_factor),
            "transplanted": round(random.randint(40, 60) * crop_factor),
            "harvested": round(random.randint(10, 20) * crop_factor)
        },
        is_daily=True
    )


def generate_quarterly_container_metrics(container_id: str, container_type: str = "PHYSICAL", seed: int = 1234) -> MetricResponse:
    """Generate mock quarterly metrics data for a specific container"""
    import random
    from datetime import datetime, timedelta
    
    # Seed the random number generator for consistent results
    random.seed(seed)
    
    # Generate data for 13 weeks (a quarter)
    weeks = []
    for i in range(1, 14):
        weeks.append(f"Week {i}")
    
    # Set base metrics adjusted by container type
    is_physical = container_type == "PHYSICAL"
    
    # Physical containers have higher yield and utilization rates
    base_yield_start = 1.9 if is_physical else 1.4
    growth_rate = 0.18 if is_physical else 0.12  # Physical containers improve faster over quarter
    
    base_utilization_start = 74 if is_physical else 62
    utilization_growth = 0.9 if is_physical else 0.7  # Physical containers' utilization improves faster
    
    # Generate yield data with an upward trend over the quarter
    yield_data = []
    for i, week in enumerate(weeks):
        # Create an upward trend with accelerated growth in later weeks
        week_factor = i / 12  # Normalized week position (0 to 1)
        acceleration = 1.0 + (week_factor * 0.5)  # Accelerated growth in later weeks
        
        base_yield = base_yield_start + (i * growth_rate * acceleration)
        
        # Add some random variation, more stable for physical containers
        variance = 0.3 if is_physical else 0.5
        yield_data.append({
            "date": week,
            "value": round(random.uniform(base_yield - variance, base_yield + variance), 1)
        })
    
    # Generate space utilization data with more pronounced upward trend
    space_utilization_data = []
    for i, week in enumerate(weeks):
        # Create upward trend with slight acceleration
        base_utilization = base_utilization_start + (i * utilization_growth)
        
        # Add some random variation, more stable for physical containers
        variance = 4 if is_physical else 7
        space_utilization_data.append({
            "date": week,
            "value": min(98, round(base_utilization + random.randint(-variance, variance)))
        })
    
    # Calculate averages and totals
    avg_yield = round(sum(item["value"] for item in yield_data) / len(yield_data), 1)
    total_yield = round(sum(item["value"] for item in yield_data), 1)
    avg_space_util = round(sum(item["value"] for item in space_utilization_data) / len(space_utilization_data), 1)
    
    # Generate current metrics with realistic values based on container type
    # Physical containers maintain more stable, optimal conditions
    temp_variance = 1.0 if is_physical else 2.0
    current_temp = round(21.0 + random.uniform(-temp_variance, temp_variance), 1)
    
    humidity_variance = 3 if is_physical else 5
    current_humidity = round(68.0 + random.uniform(-humidity_variance, humidity_variance), 1)
    
    co2_variance = 30 if is_physical else 50
    current_co2 = round(800.0 + random.uniform(-co2_variance, co2_variance), 1)
    
    # Crop counts are higher in physical containers
    crop_factor = 1.2 if is_physical else 0.8
    
    return MetricResponse(
        yield_data=yield_data,
        space_utilization_data=space_utilization_data,
        average_yield=avg_yield,
        total_yield=total_yield,
        average_space_utilization=avg_space_util,
        current_temperature=current_temp,
        current_humidity=current_humidity,
        current_co2=current_co2,
        crop_counts={
            "seeded": round(random.randint(20, 30) * crop_factor),
            "transplanted": round(random.randint(40, 60) * crop_factor),
            "harvested": round(random.randint(10, 20) * crop_factor)
        },
        is_daily=False
    )


def generate_yearly_container_metrics(container_id: str, container_type: str = "PHYSICAL", seed: int = 1234) -> MetricResponse:
    """Generate mock yearly metrics data for a specific container"""
    import random
    
    # Seed the random number generator for consistent results
    random.seed(seed)
    
    # Use months for a year
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # Set base metrics adjusted by container type
    is_physical = container_type == "PHYSICAL"
    
    # Physical containers have higher yield and utilization rates and are less affected by seasons
    # Define yield multipliers for different seasons
    if is_physical:
        # Physical containers have better technology and more stable conditions
        summer_yield = 3.0
        winter_yield = 2.2
        transition_yield = 2.6
        
        # Physical containers maintain better utilization
        summer_utilization = 82
        winter_utilization = 92
        transition_utilization = 86
        
        # Less variance in physical containers
        yield_variance = 0.25
        utilization_variance = 3
    else:
        # Virtual containers more affected by seasons
        summer_yield = 2.6
        winter_yield = 1.6
        transition_yield = 2.0
        
        # Virtual containers have lower utilization overall
        summer_utilization = 70
        winter_utilization = 86
        transition_utilization = 76
        
        # More variance in virtual containers
        yield_variance = 0.4
        utilization_variance = 5
    
    # Generate yield data with seasonal pattern
    yield_data = []
    for i, month in enumerate(months):
        # Create seasonal pattern with differentiating by container type
        if 4 <= i <= 7:  # May-Aug (summer)
            base_yield = summer_yield
        elif i <= 1 or i >= 10:  # Dec-Feb (winter)
            base_yield = winter_yield
        else:
            base_yield = transition_yield
            
        yield_data.append({
            "date": month,
            "value": round(random.uniform(base_yield - yield_variance, base_yield + yield_variance), 1)
        })
    
    # Generate space utilization data with seasonal pattern
    space_utilization_data = []
    for i, month in enumerate(months):
        # Higher utilization in winter when indoor farming is more valuable
        if i <= 1 or i >= 10:  # Dec-Feb (winter)
            base_utilization = winter_utilization
        elif 4 <= i <= 7:  # May-Aug (summer)
            base_utilization = summer_utilization
        else:
            base_utilization = transition_utilization
            
        space_utilization_data.append({
            "date": month,
            "value": random.randint(int(base_utilization) - utilization_variance, int(base_utilization) + utilization_variance)
        })
    
    # Calculate averages and totals
    avg_yield = round(sum(item["value"] for item in yield_data) / len(yield_data), 1)
    total_yield = round(sum(item["value"] for item in yield_data), 1)
    avg_space_util = round(sum(item["value"] for item in space_utilization_data) / len(space_utilization_data), 1)
    
    # Generate current metrics with realistic values based on container type
    # Physical containers maintain more stable, optimal conditions
    temp_variance = 1.0 if is_physical else 2.0
    current_temp = round(21.0 + random.uniform(-temp_variance, temp_variance), 1)
    
    humidity_variance = 3 if is_physical else 5
    current_humidity = round(68.0 + random.uniform(-humidity_variance, humidity_variance), 1)
    
    co2_variance = 30 if is_physical else 50
    current_co2 = round(800.0 + random.uniform(-co2_variance, co2_variance), 1)
    
    # Crop counts are higher in physical containers
    crop_factor = 1.2 if is_physical else 0.8
    
    return MetricResponse(
        yield_data=yield_data,
        space_utilization_data=space_utilization_data,
        average_yield=avg_yield,
        total_yield=total_yield,
        average_space_utilization=avg_space_util,
        current_temperature=current_temp,
        current_humidity=current_humidity,
        current_co2=current_co2,
        crop_counts={
            "seeded": round(random.randint(20, 30) * crop_factor),
            "transplanted": round(random.randint(40, 60) * crop_factor),
            "harvested": round(random.randint(10, 20) * crop_factor)
        },
        is_daily=False
    )


@router.get("/snapshots/{container_id}", response_model=List[MetricSnapshot])
def get_metric_snapshots(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 100
) -> Any:
    """
    Get raw metric snapshots for a container within a date range.
    
    - **start_date**: Optional start date for filtering
    - **end_date**: Optional end date for filtering
    - **limit**: Maximum number of snapshots to return
    """
    # Check if container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    query = db.query(MetricSnapshotModel).filter(MetricSnapshotModel.container_id == container_id)
    
    # Apply date filters if provided
    if start_date:
        query = query.filter(MetricSnapshotModel.timestamp >= start_date)
    if end_date:
        query = query.filter(MetricSnapshotModel.timestamp <= end_date)
    
    # Get the snapshots
    snapshots = query.order_by(MetricSnapshotModel.timestamp.desc()).limit(limit).all()
    
    return snapshots
