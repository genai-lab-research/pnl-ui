from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database.database import get_db
from app.models.enums import ContainerType, ContainerStatus, ContainerPurpose, FAEnvironment, AWSEnvironment, MBAIEnvironment, MetricTimeRange
from app.schemas.container import (
    Container, ContainerCreate, ContainerList, ContainerSummary, ContainerStats, 
    ContainerUpdate, ContainerFormRequest, ContainerDetail, Location, 
    SystemIntegration, SystemIntegrations
)
from app.schemas.metrics import ContainerMetricsDetail, SingleMetricData
from app.schemas.crop import ContainerCrop, ContainerCropsList
from app.schemas.activity import ContainerActivity, ContainerActivityList, ActivityUser, ActivityDetails

# Placeholder for future CRUD operations
# In a real implementation, these would be imported from a CRUD module
from app.models.models import Container as ContainerModel
from app.models.models import Tenant, Alert, SeedType, MetricSnapshot, Crop as CropModel, ActivityLog as ActivityLogModel
from sqlalchemy import func, desc

router = APIRouter()


@router.get("/", response_model=ContainerList)
def list_containers(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    tenant_id: Optional[str] = None,
    type: Optional[ContainerType] = None,
    purpose: Optional[str] = None,
    status: Optional[ContainerStatus] = None,
    has_alerts: Optional[bool] = None,
    location: Optional[str] = None
) -> Any:
    """
    List containers with optional filtering.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **name**: Filter by container name (partial match)
    - **tenant_id**: Filter by tenant ID
    - **type**: Filter by container type (Physical or Virtual)
    - **purpose**: Filter by purpose (Development, Research, Production)
    - **status**: Filter by status (Created, Active, Maintenance, Inactive)
    - **has_alerts**: If true, only return containers with active alerts
    - **location**: Filter by location (partial match on city or country)
    """
    query = db.query(ContainerModel)
    
    # Apply filters
    if name:
        query = query.filter(ContainerModel.name.ilike(f"%{name}%"))
    if tenant_id:
        query = query.filter(ContainerModel.tenant_id == tenant_id)
    if type:
        query = query.filter(ContainerModel.type == type)
    if purpose:
        query = query.filter(ContainerModel.purpose == purpose)
    if status:
        query = query.filter(ContainerModel.status == status)
    if location:
        query = query.filter(
            (ContainerModel.location_city.ilike(f"%{location}%")) | 
            (ContainerModel.location_country.ilike(f"%{location}%"))
        )
    
    # Handle alert filtering - this is more complex and requires a join/subquery
    if has_alerts is not None:
        if has_alerts:
            query = query.join(Alert).filter(Alert.active == True).distinct()
        else:
            # No alerts or only inactive alerts
            subquery = db.query(Alert.container_id).filter(Alert.active == True).distinct().subquery()
            query = query.filter(~ContainerModel.id.in_(subquery))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    containers = query.offset(skip).limit(limit).all()
    
    # Convert to summary objects
    results = []
    for container in containers:
        has_active_alerts = any(alert.active for alert in container.alerts)
        summary = ContainerSummary(
            id=container.id,
            name=container.name,
            type=container.type,
            tenant_name=container.tenant.name,
            purpose=container.purpose,
            location_city=container.location_city,
            location_country=container.location_country,
            status=container.status,
            created_at=container.created_at,
            updated_at=container.updated_at,
            has_alerts=has_active_alerts
        )
        results.append(summary)
    
    return ContainerList(total=total, results=results)


@router.post("/", response_model=Container, status_code=status.HTTP_201_CREATED)
def create_container(
    *,
    db: Session = Depends(get_db),
    container_in: ContainerCreate
) -> Any:
    """
    Create a new container.
    
    - Requires a valid tenant ID
    - For physical containers, location is required
    - Container name must be unique
    """
    # Check if container with this name already exists
    container_exists = db.query(ContainerModel).filter(ContainerModel.name == container_in.name).first()
    if container_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Container with this name already exists"
        )
    
    # Validate tenant exists
    tenant = db.query(Tenant).filter(Tenant.id == container_in.tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    # Validate location is provided for physical containers
    if container_in.type == ContainerType.PHYSICAL:
        if not container_in.location_city or not container_in.location_country:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location (city and country) is required for physical containers"
            )
    
    # Validate seed types exist
    if container_in.seed_types:
        seed_type_ids = container_in.seed_types
        seed_types = db.query(SeedType).filter(SeedType.id.in_(seed_type_ids)).all()
        if len(seed_types) != len(seed_type_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more seed types not found"
            )
    
    # Create new container
    db_container = ContainerModel(
        name=container_in.name,
        type=container_in.type,
        tenant_id=container_in.tenant_id,
        purpose=container_in.purpose,
        location_city=container_in.location_city,
        location_country=container_in.location_country,
        location_address=container_in.location_address,
        notes=container_in.notes,
        shadow_service_enabled=container_in.shadow_service_enabled,
        copied_environment_from=container_in.copied_environment_from,
        robotics_simulation_enabled=container_in.robotics_simulation_enabled,
        ecosystem_connected=container_in.ecosystem_connected,
        ecosystem_settings=container_in.ecosystem_settings,
        status=ContainerStatus.CREATED
    )
    
    db.add(db_container)
    db.commit()
    db.refresh(db_container)
    
    # Add seed types if provided
    if container_in.seed_types:
        for seed_type in seed_types:
            db_container.seed_types.append(seed_type)
        db.commit()
        db.refresh(db_container)
    
    return db_container


@router.get("/stats", response_model=ContainerStats)
def get_container_stats(
    db: Session = Depends(get_db),
) -> Any:
    """
    Get container statistics - counts by type.
    
    Returns counts for physical and virtual containers.
    """
    physical_count = db.query(func.count(ContainerModel.id)).filter(
        ContainerModel.type == ContainerType.PHYSICAL
    ).scalar()
    
    virtual_count = db.query(func.count(ContainerModel.id)).filter(
        ContainerModel.type == ContainerType.VIRTUAL
    ).scalar()
    
    return ContainerStats(
        physical_count=physical_count,
        virtual_count=virtual_count
    )


@router.get("/{container_id}", response_model=ContainerDetail)
def get_container_detail(
    *,
    db: Session = Depends(get_db),
    container_id: str
) -> Any:
    """
    Get detailed information about a specific container by ID.
    
    - Returns container details formatted according to the ContainerDetail schema
    - Includes location data, system integrations, and seed types
    """
    # Check if the container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Get creator (using "System" as a placeholder since we don't have a user model)
    creator = "System"  # In a real app, you'd get this from activity logs or another source
    
    # Extract seed type names
    seed_type_names = [st.name for st in container.seed_types]
    
    # Get system integration info from ecosystem_settings
    ecosystem_settings = container.ecosystem_settings or {}
    
    # Set up system integrations
    fa_integration = SystemIntegration(
        name="Alpha" if ecosystem_settings.get("fa_environment") == "ALPHA" else "Dev",
        enabled=bool(ecosystem_settings.get("fa_environment"))
    )
    
    aws_environment = SystemIntegration(
        name="Dev" if ecosystem_settings.get("aws_environment") == "DEV" else "Prod",
        enabled=bool(ecosystem_settings.get("aws_environment"))
    )
    
    mbai_environment = SystemIntegration(
        name="Prod" if ecosystem_settings.get("mbai_environment") else "Disabled",
        enabled=bool(ecosystem_settings.get("mbai_environment"))
    )
    
    # Create system integrations object
    system_integrations = SystemIntegrations(
        fa_integration=fa_integration,
        aws_environment=aws_environment,
        mbai_environment=mbai_environment
    )
    
    # Create location object
    location = Location(
        city=container.location_city or "",
        country=container.location_country or "",
        address=container.location_address
    )
    
    # Create container detail object
    container_detail = ContainerDetail(
        id=container.id,
        name=container.name,
        type=container.type,
        tenant=container.tenant.name,
        purpose=container.purpose,
        location=location,
        status=container.status,
        created=container.created_at,
        modified=container.updated_at,
        creator=creator,
        seed_types=seed_type_names,
        notes=container.notes,
        shadow_service_enabled=container.shadow_service_enabled,
        ecosystem_connected=container.ecosystem_connected,
        system_integrations=system_integrations
    )
    
    return container_detail


@router.get("/{container_id}/details", response_model=Container)
def get_container_details(
    *,
    db: Session = Depends(get_db),
    container_id: str
) -> Any:
    """
    Get detailed information about a specific container by ID including relationships.
    
    - Returns full container details including tenant, seed types, and active alerts
    - This endpoint is deprecated, use GET /{container_id} instead
    """
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    return container


@router.put("/{container_id}", response_model=Container)
def update_container(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    container_in: ContainerUpdate
) -> Any:
    """
    Update a container.
    
    - Container name cannot be changed
    - For physical containers, location is required if provided
    """
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Handle updates for fields that are provided
    update_data = container_in.dict(exclude_unset=True)
    
    # Special handling for seed types
    if "seed_types" in update_data:
        seed_type_ids = update_data.pop("seed_types")
        
        # Clear existing seed types
        container.seed_types = []
        db.commit()
        
        # Add new seed types
        if seed_type_ids:
            seed_types = db.query(SeedType).filter(SeedType.id.in_(seed_type_ids)).all()
            if len(seed_types) != len(seed_type_ids):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="One or more seed types not found"
                )
            
            for seed_type in seed_types:
                container.seed_types.append(seed_type)
    
    # Special handling for tenant validation
    if "tenant_id" in update_data:
        tenant = db.query(Tenant).filter(Tenant.id == update_data["tenant_id"]).first()
        if not tenant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tenant not found"
            )
    
    # Update remaining fields
    for field, value in update_data.items():
        setattr(container, field, value)
    
    db.commit()
    db.refresh(container)
    
    return container


@router.delete("/{container_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_container(
    *,
    db: Session = Depends(get_db),
    container_id: str
) -> None:
    """
    Delete a container.
    
    - Completely removes the container and all associated data
    - This is a destructive operation and cannot be undone
    """
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    db.delete(container)
    db.commit()


@router.post("/form", response_model=Container, status_code=status.HTTP_201_CREATED)
def create_container_form(
    *,
    db: Session = Depends(get_db),
    form_data: ContainerFormRequest
) -> Any:
    """
    Create a new container using form data.
    
    - Accepts form data from the Create Container Form
    - Translates the form fields to the internal container model
    - For physical containers, location is parsed into city and country
    - Associates the container with the specified tenant by name
    """
    # Check if container with this name already exists
    container_exists = db.query(ContainerModel).filter(ContainerModel.name == form_data.name).first()
    if container_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Container with this name already exists"
        )
    
    # Find tenant by name
    tenant = db.query(Tenant).filter(Tenant.name == form_data.tenant).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tenant with name '{form_data.tenant}' not found"
        )
    
    # Validate seed types exist
    if form_data.seed_types:
        seed_type_ids = form_data.seed_types
        seed_types = db.query(SeedType).filter(SeedType.id.in_(seed_type_ids)).all()
        if len(seed_types) != len(seed_type_ids):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more seed types not found"
            )
    
    # Parse container type
    try:
        container_type = ContainerType(form_data.type.capitalize())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid container type: {form_data.type}. Must be 'physical' or 'virtual'"
        )
    
    # Parse container purpose
    try:
        container_purpose = ContainerPurpose(form_data.purpose.capitalize())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid container purpose: {form_data.purpose}. Must be 'development', 'research', or 'production'"
        )
    
    # Parse location
    location_city = None
    location_country = None
    if form_data.location:
        location_parts = form_data.location.split(',')
        if len(location_parts) >= 2:
            location_city = location_parts[0].strip()
            location_country = location_parts[1].strip()
        else:
            location_city = form_data.location.strip()
    
    # Validate location for physical containers
    if container_type == ContainerType.PHYSICAL and not location_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location is required for physical containers"
        )
    
    # Create new container
    db_container = ContainerModel(
        name=form_data.name,
        type=container_type,
        tenant_id=tenant.id,
        purpose=container_purpose,
        location_city=location_city,
        location_country=location_country,
        notes=form_data.notes,
        shadow_service_enabled=form_data.shadow_service_enabled,
        ecosystem_connected=form_data.connect_to_other_systems,
        status=ContainerStatus.CREATED
    )
    
    db.add(db_container)
    db.commit()
    db.refresh(db_container)
    
    # Add seed types if provided
    if form_data.seed_types:
        for seed_type in seed_types:
            db_container.seed_types.append(seed_type)
        db.commit()
        db.refresh(db_container)
    
    return db_container


@router.post("/{container_id}/shutdown", response_model=Container)
def shutdown_container(
    *,
    db: Session = Depends(get_db),
    container_id: str
) -> Any:
    """
    Shutdown a container.
    
    - Sets the container status to Inactive
    - Does not delete the container or its data
    """
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    container.status = ContainerStatus.INACTIVE
    db.commit()
    db.refresh(container)
    
    return container


@router.get("/{container_id}/metrics", response_model=ContainerMetricsDetail)
def get_container_metrics(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    time_range: MetricTimeRange = MetricTimeRange.WEEK
) -> Any:
    """
    Get metrics for a specific container.
    
    - **container_id**: Container ID to retrieve metrics for
    - **time_range**: Time range (WEEK, MONTH, QUARTER, YEAR)
    
    Returns detailed metrics including temperature, humidity, CO2, yield, and utilization data
    with current values, units, targets, and trends where applicable.
    """
    # For demo purposes, generate mock metrics data based on container ID and type
    try:
        # Check if the container exists
        container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
        
        # For consistent mock data, use container type to determine metrics pattern
        container_type = "PHYSICAL"
        if container:
            container_type = container.type
        
        # If you provide specific container IDs, you can generate consistent data for them
        container_seed = int(container_id.replace("-", "")[0:8], 16) % 10000 if container_id else 1234
    except:
        # Fall back to physical container type and a default seed if there's an error
        container_type = "PHYSICAL"
        container_seed = 1234
    
    import random
    
    # Seed the random number generator with the container ID for consistent results
    random.seed(container_seed)
    
    # Current values with slight randomization but consistent for each container
    current_temperature = round(20.0 + random.uniform(0, 3), 1)
    current_humidity = round(65.0 + random.uniform(0, 10), 1)
    current_co2 = round(800.0 + random.uniform(0, 100), 1)
    
    # Adjust base values based on container type
    yield_base = 45.0 if container_type == "PHYSICAL" else 35.0
    current_yield = round(yield_base + random.uniform(0, 15), 1)
    
    nursery_base = 70.0 if container_type == "PHYSICAL" else 60.0
    current_nursery = round(nursery_base + random.uniform(0, 15), 1)
    
    cultivation_base = 85.0 if container_type == "PHYSICAL" else 75.0
    current_cultivation = round(cultivation_base + random.uniform(0, 15), 1)
    
    # Generate trends - physical containers generally have slightly better trends
    trend_factor = 1.0 if container_type == "PHYSICAL" else 0.8
    yield_trend = round(random.uniform(0.8, 2.2) * trend_factor, 1)
    nursery_trend = round(random.uniform(3, 8) * trend_factor, 1)
    cultivation_trend = round(random.uniform(5, 20) * trend_factor, 1)
    
    # Target values are the same for all containers
    target_temperature = 21.0
    target_humidity = 68.0
    target_co2 = 800.0
    
    # Prepare response
    return ContainerMetricsDetail(
        temperature=SingleMetricData(
            current=current_temperature,
            unit="°C", 
            target=target_temperature
        ),
        humidity=SingleMetricData(
            current=current_humidity,
            unit="%", 
            target=target_humidity
        ),
        co2=SingleMetricData(
            current=current_co2,
            unit="ppm", 
            target=target_co2
        ),
        **{"yield": SingleMetricData(
            current=current_yield,
            unit="KG", 
            trend=yield_trend
        )},
        nursery_utilization=SingleMetricData(
            current=current_nursery,
            unit="%", 
            trend=nursery_trend
        ),
        cultivation_utilization=SingleMetricData(
            current=current_cultivation,
            unit="%", 
            trend=cultivation_trend
        )
    )


@router.get("/{container_id}/crops", response_model=ContainerCropsList)
def get_container_crops(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    page: int = 0,
    page_size: int = 10,
    seed_type: Optional[str] = None
) -> Any:
    """
    Get crops for a specific container.
    
    - **container_id**: Container ID to retrieve crops for
    - **page**: Page number for pagination (default: 0)
    - **page_size**: Number of items per page (default: 10)
    - **seed_type**: Optional filter by seed type
    
    Returns a paginated list of crops with cultivation details and age information.
    """
    # Check if the container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Build query for crops associated with the container
    # Get all tray IDs and panel IDs belonging to this container
    tray_ids = [tray.id for tray in container.trays]
    panel_ids = [panel.id for panel in container.panels]
    
    # Query crops that are in trays or panels of this container
    query = db.query(CropModel).join(
        SeedType, CropModel.seed_type_id == SeedType.id
    ).filter(
        ((CropModel.tray_id.in_(tray_ids)) if tray_ids else False) | 
        ((CropModel.panel_id.in_(panel_ids)) if panel_ids else False)
    )
    
    # Apply seed_type filter if provided
    if seed_type:
        query = query.join(SeedType).filter(SeedType.name.ilike(f"%{seed_type}%"))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    crops = query.offset(page * page_size).limit(page_size).all()
    
    # Transform crops into ContainerCrop objects
    results = []
    for crop in crops:
        # Calculate age in days
        age_days = (datetime.utcnow() - crop.seed_date).days if crop.seed_date else 0
        
        # Determine if overdue
        overdue = 0
        if crop.lifecycle_status.value == "Seeded" and crop.transplanting_date_planned:
            if crop.transplanting_date_planned < datetime.utcnow():
                overdue = (datetime.utcnow() - crop.transplanting_date_planned).days
        elif crop.lifecycle_status.value == "Transplanted" and crop.harvesting_date_planned:
            if crop.harvesting_date_planned < datetime.utcnow():
                overdue = (datetime.utcnow() - crop.harvesting_date_planned).days
        
        # Format dates as strings
        last_sd = crop.seed_date.date().isoformat() if crop.seed_date else None
        last_td = crop.transplanted_date.date().isoformat() if crop.transplanted_date else None
        last_hd = crop.harvesting_date.date().isoformat() if crop.harvesting_date else None
        
        # Get cultivation area and nursery table info
        cultivation_area = crop.area
        nursery_table = crop.tray_row if crop.tray_id else None
        
        container_crop = ContainerCrop(
            id=crop.id,
            seed_type=crop.seed_type_ref.name,
            cultivation_area=cultivation_area,
            nursery_table=nursery_table,
            last_sd=last_sd,
            last_td=last_td,
            last_hd=last_hd,
            avg_age=age_days,
            overdue=overdue
        )
        results.append(container_crop)
    
    return ContainerCropsList(total=total, results=results)


@router.get("/{container_id}/activities", response_model=ContainerActivityList)
def get_container_activities(
    *,
    db: Session = Depends(get_db),
    container_id: str,
    limit: int = 5
) -> Any:
    """
    Get activity logs for a specific container.
    
    - **container_id**: Container ID to retrieve activities for
    - **limit**: Maximum number of activities to return (default: 5)
    
    Returns a list of container activities with details about the action, user, and timestamp.
    """
    # Check if the container exists
    container = db.query(ContainerModel).filter(ContainerModel.id == container_id).first()
    if not container:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Container not found"
        )
    
    # Query activity logs for the container
    logs = db.query(ActivityLogModel).filter(
        ActivityLogModel.container_id == container_id
    ).order_by(ActivityLogModel.timestamp.desc()).limit(limit).all()
    
    # Transform ActivityLogs to ContainerActivity format
    activities = []
    for log in logs:
        # Map action_type to type enum values specified in the API
        activity_type = "CREATED"  # Default
        if "seed" in log.action_type.lower():
            activity_type = "SEEDED"
        elif "sync" in log.action_type.lower():
            activity_type = "SYNCED"
        elif "environment" in log.action_type.lower():
            activity_type = "ENVIRONMENT_CHANGED"
        elif "maintenance" in log.action_type.lower():
            activity_type = "MAINTENANCE"
        elif "create" in log.action_type.lower():
            activity_type = "CREATED"
            
        # Create user information
        if log.actor_type == "User":
            user_name = log.actor_id  # In a real app, you would look up the user's name
            user_role = "Operator"    # In a real app, you would get the user's role
        else:  # System
            user_name = "System"
            user_role = "Automated"
            
        # Format timestamp to ISO string
        timestamp = log.timestamp.isoformat()
        
        # Additional info might be parsed from description or stored elsewhere in a real app
        additional_info = None
        
        activity = ContainerActivity(
            id=log.id,
            type=activity_type,
            timestamp=timestamp,
            description=log.description,
            user=ActivityUser(
                name=user_name,
                role=user_role
            ),
            details=ActivityDetails(
                additional_info=additional_info
            )
        )
        activities.append(activity)
    
    return ContainerActivityList(activities=activities)