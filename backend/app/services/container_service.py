from typing import Optional, List
from fastapi import HTTPException

from app.models import (
    Container,
    ContainerCreate,
    ContainerCreateFromForm,
    ContainerUpdate,
    ContainerPublic,
    ContainerResponse,
    ContainersPublic,
    ContainerList,
    ContainerSummary,
    ContainerStats,
    ContainerMetrics,
    ContainerMetricsPublic,
    ContainerCrop,
    ContainerCropsPublic,
    ContainerActivity,
    ContainerActivitiesPublic,
    ContainerType,
    ContainerStatus,
    ContainerPurpose,
    TimeRange,
    ContainerLocation,
    SystemIntegrations,
    SystemIntegration,
    MetricValue
)
from app.repositories.container_repository import ContainerRepository


class ContainerService:
    def __init__(self):
        self.repository = ContainerRepository()

    def get_container_by_id(self, container_id: str) -> ContainerPublic:
        """Get a container by its ID."""
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        # Convert the database model to public model with proper typing
        container_dict = container.model_dump()
        return ContainerPublic(
            id=container_dict["id"],
            name=container_dict["name"],
            type=container_dict["type"],
            tenant=container_dict["tenant"],
            purpose=container_dict["purpose"],
            location=ContainerLocation(**container_dict["location"]),
            status=container_dict["status"],
            creator=container_dict["creator"],
            seed_types=container_dict["seed_types"],
            notes=container_dict["notes"],
            shadow_service_enabled=container_dict["shadow_service_enabled"],
            ecosystem_connected=container_dict["ecosystem_connected"],
            system_integrations=SystemIntegrations(
                fa_integration=SystemIntegration(**container_dict["system_integrations"]["fa_integration"]),
                aws_environment=SystemIntegration(**container_dict["system_integrations"]["aws_environment"]),
                mbai_environment=SystemIntegration(**container_dict["system_integrations"]["mbai_environment"])
            ),
            created=container_dict["created"],
            modified=container_dict["modified"]
        )

    def get_containers(self, skip: int = 0, limit: int = 100) -> ContainersPublic:
        """Get all containers with pagination."""
        containers = self.repository.get_containers(skip=skip, limit=limit)
        container_publics = []
        
        for container in containers:
            container_dict = container.model_dump()
            container_public = ContainerPublic(
                id=container_dict["id"],
                name=container_dict["name"],
                type=container_dict["type"],
                tenant=container_dict["tenant"],
                purpose=container_dict["purpose"],
                location=ContainerLocation(**container_dict["location"]),
                status=container_dict["status"],
                creator=container_dict["creator"],
                seed_types=container_dict["seed_types"],
                notes=container_dict["notes"],
                shadow_service_enabled=container_dict["shadow_service_enabled"],
                ecosystem_connected=container_dict["ecosystem_connected"],
                system_integrations=SystemIntegrations(
                    fa_integration=SystemIntegration(**container_dict["system_integrations"]["fa_integration"]),
                    aws_environment=SystemIntegration(**container_dict["system_integrations"]["aws_environment"]),
                    mbai_environment=SystemIntegration(**container_dict["system_integrations"]["mbai_environment"])
                ),
                created=container_dict["created"],
                modified=container_dict["modified"]
            )
            container_publics.append(container_public)
        
        return ContainersPublic(
            data=container_publics,
            count=len(container_publics)
        )
    
    def get_containers_filtered(self, skip: int = 0, limit: int = 100, filters: dict = None) -> ContainerList:
        """Get containers with filtering and pagination for the dashboard list view."""
        containers, total = self.repository.get_containers_filtered(skip=skip, limit=limit, filters=filters or {})
        
        container_summaries = []
        for container in containers:
            container_dict = container.model_dump()
            location = container_dict.get("location", {})
            
            container_summary = ContainerSummary(
                id=container_dict["id"],
                name=container_dict["name"],
                type=container_dict["type"],
                tenant_name=container_dict["tenant"],  # Using tenant as tenant_name for now
                purpose=container_dict["purpose"],
                location_city=location.get("city"),
                location_country=location.get("country"),
                status=container_dict["status"],
                created_at=container_dict["created"],
                updated_at=container_dict["modified"],
                has_alerts=False  # Mock for now, would check alerts in real implementation
            )
            container_summaries.append(container_summary)
        
        return ContainerList(
            total=total,
            results=container_summaries
        )
    
    def get_container_stats(self) -> ContainerStats:
        """Get container statistics - counts by type."""
        return self.repository.get_container_stats()

    def create_container(self, container_data: ContainerCreate) -> ContainerPublic:
        """Create a new container."""
        container = self.repository.create_container(container_data)
        container_dict = container.model_dump()
        return ContainerPublic(
            id=container_dict["id"],
            name=container_dict["name"],
            type=container_dict["type"],
            tenant=container_dict["tenant"],
            purpose=container_dict["purpose"],
            location=ContainerLocation(**container_dict["location"]),
            status=container_dict["status"],
            creator=container_dict["creator"],
            seed_types=container_dict["seed_types"],
            notes=container_dict["notes"],
            shadow_service_enabled=container_dict["shadow_service_enabled"],
            ecosystem_connected=container_dict["ecosystem_connected"],
            system_integrations=SystemIntegrations(
                fa_integration=SystemIntegration(**container_dict["system_integrations"]["fa_integration"]),
                aws_environment=SystemIntegration(**container_dict["system_integrations"]["aws_environment"]),
                mbai_environment=SystemIntegration(**container_dict["system_integrations"]["mbai_environment"])
            ),
            created=container_dict["created"],
            modified=container_dict["modified"]
        )

    def update_container(self, container_id: str, container_data: ContainerUpdate) -> ContainerPublic:
        """Update an existing container."""
        container = self.repository.update_container(container_id, container_data)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        return ContainerPublic(**container.model_dump())

    def delete_container(self, container_id: str) -> bool:
        """Delete a container."""
        success = self.repository.delete_container(container_id)
        if not success:
            raise HTTPException(status_code=404, detail="Container not found")
        
        return True

    def create_container_from_form(self, form_data: ContainerCreateFromForm) -> ContainerResponse:
        """Create a new container from page2 form data."""
        # Parse location string into city/country (assuming format "City, Country")
        location_parts = form_data.location.split(", ") if form_data.location else ["", ""]
        location_city = location_parts[0] if len(location_parts) > 0 else ""
        location_country = location_parts[1] if len(location_parts) > 1 else ""
        
        # Create location object
        location = ContainerLocation(
            city=location_city,
            country=location_country,
            address=form_data.location
        )
        
        # Default system integrations based on connect_to_other_systems flag
        system_integrations = SystemIntegrations(
            fa_integration=SystemIntegration(name="Alpha" if form_data.purpose == ContainerPurpose.PRODUCTION else "Dev", enabled=form_data.connect_to_other_systems),
            aws_environment=SystemIntegration(name="Prod" if form_data.purpose == ContainerPurpose.PRODUCTION else "Dev", enabled=form_data.connect_to_other_systems),
            mbai_environment=SystemIntegration(name="Prod", enabled=False)  # Disabled by default as per spec
        )
        
        # Convert form data to full container create data
        container_data = ContainerCreate(
            name=form_data.name,
            type=form_data.type,
            tenant=form_data.tenant,
            purpose=form_data.purpose,
            location=location,
            status=ContainerStatus.CREATED,
            creator="System",  # Could be set from authenticated user in real app
            seed_types=form_data.seed_types,
            notes=form_data.notes or "",
            shadow_service_enabled=form_data.shadow_service_enabled,
            ecosystem_connected=form_data.connect_to_other_systems,
            system_integrations=system_integrations
        )
        
        # Create container through repository
        container = self.repository.create_container(container_data)
        
        # Return response in page2 format
        return ContainerResponse(
            id=container.id,
            name=container.name,
            type=container.type,
            tenant_name=container.tenant,  # Assuming tenant is tenant name for now
            purpose=container.purpose,
            location_city=location_city,
            location_country=location_country,
            status=container.status,
            created_at=container.created,
            updated_at=container.modified,
            has_alerts=False,
            shadow_service_enabled=container.shadow_service_enabled,
            ecosystem_connected=container.ecosystem_connected
        )

    def get_container_metrics(self, container_id: str, time_range: TimeRange = TimeRange.WEEK) -> ContainerMetricsPublic:
        """Get metrics for a container."""
        # First check if container exists
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        metrics = self.repository.get_container_metrics(container_id, time_range)
        if not metrics:
            # Return default metrics for newly created containers
            default_metrics_dict = {
                "temperature": {"current": 22, "unit": "°C", "target": 23, "target_display": "23°C"},
                "humidity": {"current": 65, "unit": "%", "target": 68, "target_display": "68%"},
                "co2": {"current": 850, "unit": "ppm", "target": 900, "target_display": "800-900ppm"},
                "yield_metric": {"current": 0, "unit": "KG", "trend": 0, "target_display": "0Kg"},
                "nursery_utilization": {"current": 0, "unit": "%", "trend": 0, "target_display": "0%"},
                "cultivation_utilization": {"current": 0, "unit": "%", "trend": 0, "target_display": "0%"}
            }
            
            public_metrics = ContainerMetricsPublic(
                temperature=MetricValue(**default_metrics_dict["temperature"]),
                humidity=MetricValue(**default_metrics_dict["humidity"]),
                co2=MetricValue(**default_metrics_dict["co2"]),
                yield_value=MetricValue(**default_metrics_dict["yield_metric"]),
                nursery_utilization=MetricValue(**default_metrics_dict["nursery_utilization"]),
                cultivation_utilization=MetricValue(**default_metrics_dict["cultivation_utilization"])
            )
        else:
            # Convert to public model, handling the yield field alias
            metrics_dict = metrics.model_dump()
            public_metrics = ContainerMetricsPublic(
                temperature=MetricValue(**metrics_dict["temperature"]),
                humidity=MetricValue(**metrics_dict["humidity"]),
                co2=MetricValue(**metrics_dict["co2"]),
                yield_value=MetricValue(**metrics_dict["yield_metric"]),
                nursery_utilization=MetricValue(**metrics_dict["nursery_utilization"]),
                cultivation_utilization=MetricValue(**metrics_dict["cultivation_utilization"])
            )
        
        # Manual conversion to handle the yield field alias properly
        result_dict = public_metrics.model_dump()
        result_dict["yield"] = result_dict.pop("yield_value")
        return result_dict

    def get_container_crops(
        self, 
        container_id: str, 
        page: int = 0, 
        page_size: int = 10, 
        seed_type: Optional[str] = None
    ) -> ContainerCropsPublic:
        """Get crops for a container with pagination and filtering."""
        # First check if container exists
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        crops, total = self.repository.get_container_crops(
            container_id=container_id,
            page=page,
            page_size=page_size,
            seed_type=seed_type
        )
        
        crop_publics = [
            {
                "id": crop.id,
                "container_id": crop.container_id,
                "seed_type": crop.seed_type,
                "cultivation_area": crop.cultivation_area,
                "nursery_table": crop.nursery_table,
                "last_sd": crop.last_sd,
                "last_td": crop.last_td,
                "last_hd": crop.last_hd,
                "avg_age": crop.avg_age,
                "overdue": crop.overdue
            }
            for crop in crops
        ]
        
        return ContainerCropsPublic(
            total=total,
            results=crop_publics
        )

    def get_container_activities(self, container_id: str, limit: int = 5) -> ContainerActivitiesPublic:
        """Get recent activities for a container."""
        # First check if container exists
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        activities = self.repository.get_container_activities(container_id, limit)
        
        activity_publics = [
            {
                "id": activity.id,
                "container_id": activity.container_id,
                "type": activity.type,
                "timestamp": activity.timestamp,
                "description": activity.description,
                "user": activity.user,
                "details": activity.details
            }
            for activity in activities
        ]
        
        return ContainerActivitiesPublic(activities=activity_publics)

    def get_container_metric_cards(self, container_id: str) -> list[dict]:
        """Get metrics formatted for the MetricCards component."""
        # First check if container exists
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")

        metrics = self.repository.get_container_metrics(container_id, TimeRange.WEEK)
        if not metrics:
            raise HTTPException(status_code=404, detail="Metrics not found for this container")

        # Convert to MetricCards format
        metrics_dict = metrics.model_dump()

        metric_cards = [
            {
                "title": "Air Temperature",
                "value": f"{metrics_dict['temperature']['current']}°C",
                "targetValue": metrics_dict['temperature'].get('target_display', f"{metrics_dict['temperature'].get('target', '')}°C"),
                "icon": "DeviceThermostat"
            },
            {
                "title": "Rel. Humidity",
                "value": f"{metrics_dict['humidity']['current']}%",
                "targetValue": metrics_dict['humidity'].get('target_display', f"{metrics_dict['humidity'].get('target', '')}%"),
                "icon": "WaterDrop"
            },
            {
                "title": "CO₂ Level",
                "value": str(int(metrics_dict['co2']['current'])),
                "targetValue": metrics_dict['co2'].get('target_display', f"{metrics_dict['co2'].get('target', '')}ppm"),
                "icon": "Co2"
            },
            {
                "title": "Yield",
                "value": f"{int(metrics_dict['yield_metric']['current'])}KG",
                "targetValue": metrics_dict['yield_metric'].get('target_display', f"+{metrics_dict['yield_metric'].get('trend', 0)}Kg"),
                "icon": "Agriculture"
            },
            {
                "title": "Nursery Station Utilization",
                "value": f"{int(metrics_dict['nursery_utilization']['current'])}%",
                "targetValue": metrics_dict['nursery_utilization'].get('target_display', f"+{metrics_dict['nursery_utilization'].get('trend', 0)}%"),
                "icon": "CalendarViewMonth"
            },
            {
                "title": "Cultivation Area Utilization",
                "value": f"{int(metrics_dict['cultivation_utilization']['current'])}%",
                "targetValue": metrics_dict['cultivation_utilization'].get('target_display', f"+{metrics_dict['cultivation_utilization'].get('trend', 0)}%"),
                "icon": "ViewWeek"
            }
        ]

        return metric_cards
    
    def shutdown_container(self, container_id: str) -> ContainerPublic:
        """Shutdown a container by setting its status to INACTIVE."""
        container = self.repository.get_container_by_id(container_id)
        if not container:
            raise HTTPException(status_code=404, detail="Container not found")
        
        # Update status to inactive
        from app.models import ContainerUpdate, ContainerStatus
        update_data = ContainerUpdate(status=ContainerStatus.INACTIVE)
        updated_container = self.repository.update_container(container_id, update_data)
        
        if not updated_container:
            raise HTTPException(status_code=500, detail="Failed to shutdown container")
        
        return self.get_container_by_id(container_id)