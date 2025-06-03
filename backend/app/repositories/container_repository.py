from datetime import datetime, timezone
from uuid import uuid4

from app.models import (
    ActivityType,
    ActivityUser,
    Container,
    ContainerActivity,
    ContainerActivityCreate,
    ContainerCreate,
    ContainerCrop,
    ContainerCropCreate,
    ContainerMetrics,
    ContainerMetricsCreate,
    ContainerPurpose,
    ContainerStatus,
    ContainerType,
    ContainerUpdate,
    TimeRange,
)


class ContainerRepository:
    def __init__(self):
        self._containers: dict[str, Container] = {}
        self._metrics: dict[str, list[ContainerMetrics]] = {}
        self._crops: dict[str, list[ContainerCrop]] = {}
        self._activities: dict[str, list[ContainerActivity]] = {}
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        """Initialize repository with mock data from the specifications."""
        # Mock container data
        container = Container(
            id="container-04",
            name="farm-container-04",
            type=ContainerType.PHYSICAL,
            tenant="tenant-123",
            purpose=ContainerPurpose.DEVELOPMENT,
            location={
                "city": "Lviv",
                "country": "Ukraine",
                "address": "123 Innovation Park",
            },
            status=ContainerStatus.ACTIVE,
            created=datetime.fromisoformat("2023-01-30T09:30:00+00:00"),
            modified=datetime.fromisoformat("2023-01-30T11:14:00+00:00"),
            creator="Mia Adams",
            seed_types=["Someroots", "sunflower", "Someroots", "Someroots"],
            notes="Primary production container for Farm A.",
            shadow_service_enabled=False,
            ecosystem_connected=True,
            system_integrations={
                "fa_integration": {"name": "Alpha", "enabled": True},
                "aws_environment": {"name": "Dev", "enabled": True},
                "mbai_environment": {"name": "Disabled", "enabled": False},
            },
        )
        self._containers["container-04"] = container

        # Mock metrics data that matches the frontend MetricCards example
        metrics = ContainerMetrics(
            id=uuid4(),
            container_id="container-04",
            time_range=TimeRange.WEEK,
            temperature={
                "current": 20,
                "unit": "°C",
                "target": 21,
                "target_display": "21°C",
            },
            humidity={
                "current": 65,
                "unit": "%",
                "target": 68,
                "target_display": "68%",
            },
            co2={
                "current": 860,
                "unit": "ppm",
                "target": 900,
                "target_display": "800-900ppm",
            },
            yield_metric={
                "current": 51,
                "unit": "KG",
                "trend": 1.5,
                "target_display": "+1.5Kg",
            },
            nursery_utilization={
                "current": 75,
                "unit": "%",
                "trend": 5,
                "target_display": "+5%",
            },
            cultivation_utilization={
                "current": 90,
                "unit": "%",
                "trend": 15,
                "target_display": "+15%",
            },
        )
        self._metrics["container-04"] = [metrics]

        # Mock crops data
        crops = [
            ContainerCrop(
                id="crop-001",
                container_id="container-04",
                seed_type="Salanova Cousteau",
                cultivation_area=40,
                nursery_table=30,
                last_sd="2025-01-30",
                last_td="2025-01-30",
                last_hd=None,
                avg_age=26,
                overdue=2,
            ),
            ContainerCrop(
                id="crop-002",
                container_id="container-04",
                seed_type="Kiribati",
                cultivation_area=50,
                nursery_table=20,
                last_sd="2025-01-30",
                last_td="2025-01-30",
                last_hd=None,
                avg_age=30,
                overdue=0,
            ),
            ContainerCrop(
                id="crop-003",
                container_id="container-04",
                seed_type="Rex Butterhead",
                cultivation_area=65,
                nursery_table=10,
                last_sd="2025-01-10",
                last_td="2025-01-20",
                last_hd="2025-01-01",
                avg_age=22,
                overdue=0,
            ),
            ContainerCrop(
                id="crop-004",
                container_id="container-04",
                seed_type="Lollo Rossa",
                cultivation_area=35,
                nursery_table=25,
                last_sd="2025-01-15",
                last_td="2025-01-20",
                last_hd="2025-01-02",
                avg_age=18,
                overdue=1,
            ),
        ]
        self._crops["container-04"] = crops

        # Mock activities data
        activities = [
            ContainerActivity(
                id="activity-001",
                container_id="container-04",
                type=ActivityType.SEEDED,
                timestamp=datetime.fromisoformat("2025-04-13T12:30:00+00:00"),
                description="Seeded Salanova Cousteau in Nursery",
                user={"name": "Emily Chen", "role": "Operator"},
                details={"seed_type": "Salanova Cousteau", "location": "Nursery"},
            ),
            ContainerActivity(
                id="activity-002",
                container_id="container-04",
                type=ActivityType.SYNCED,
                timestamp=datetime.fromisoformat("2025-04-13T09:45:00+00:00"),
                description="Data synced",
                user={"name": "System", "role": "Automated"},
                details={},
            ),
            ContainerActivity(
                id="activity-003",
                container_id="container-04",
                type=ActivityType.ENVIRONMENT_CHANGED,
                timestamp=datetime.fromisoformat("2025-04-10T10:00:00+00:00"),
                description="Environment mode switched to Auto",
                user={"name": "Marius Johnson", "role": "Administrator"},
                details={"previous_mode": "Manual", "new_mode": "Auto"},
            ),
            ContainerActivity(
                id="activity-004",
                container_id="container-04",
                type=ActivityType.CREATED,
                timestamp=datetime.fromisoformat("2025-04-10T09:00:00+00:00"),
                description="Container created",
                user={"name": "System", "role": "Automated"},
                details={},
            ),
            ContainerActivity(
                id="activity-005",
                container_id="container-04",
                type=ActivityType.MAINTENANCE,
                timestamp=datetime.fromisoformat("2025-04-09T10:00:00+00:00"),
                description="Container maintenance performed",
                user={"name": "Maintenance Team", "role": "Technical"},
                details={
                    "maintenance_type": "Scheduled",
                    "notes": "Regular system check",
                },
            ),
        ]
        self._activities["container-04"] = activities

    # Container CRUD operations
    def get_container_by_id(self, container_id: str) -> Container | None:
        """Get a container by its ID."""
        return self._containers.get(container_id)

    def get_containers(self, skip: int = 0, limit: int = 100) -> list[Container]:
        """Get all containers with pagination."""
        containers = list(self._containers.values())
        return containers[skip : skip + limit]

    def create_container(self, container_data: ContainerCreate) -> Container:
        """Create a new container."""
        container_id = f"container-{len(self._containers) + 1:03d}"
        container_dict = container_data.model_dump()

        # Convert location and system_integrations to dict if they are objects
        location_dict = container_dict["location"]
        if hasattr(location_dict, "model_dump"):
            location_dict = location_dict.model_dump()

        system_integrations_dict = container_dict["system_integrations"]
        if hasattr(system_integrations_dict, "model_dump"):
            system_integrations_dict = system_integrations_dict.model_dump()

        container = Container(
            id=container_id,
            name=container_dict["name"],
            type=container_dict["type"],
            tenant=container_dict["tenant"],
            purpose=container_dict["purpose"],
            location=location_dict,
            status=container_dict["status"],
            creator=container_dict["creator"],
            seed_types=container_dict["seed_types"],
            notes=container_dict["notes"],
            shadow_service_enabled=container_dict["shadow_service_enabled"],
            ecosystem_connected=container_dict["ecosystem_connected"],
            system_integrations=system_integrations_dict,
            created=datetime.now(timezone.utc),
            modified=datetime.now(timezone.utc),
        )
        self._containers[container_id] = container
        self._metrics[container_id] = []
        self._crops[container_id] = []
        self._activities[container_id] = []

        # Create default crops based on seed types provided during container creation
        if container_dict.get("seed_types"):
            for i, seed_type in enumerate(
                container_dict["seed_types"][:4]
            ):  # Limit to 4 crops
                default_crop = ContainerCrop(
                    id=f"{container_id}-crop-{i+1:03d}",
                    container_id=container_id,
                    seed_type=seed_type,
                    cultivation_area=30 + (i * 10),  # Vary between 30-60
                    nursery_table=20 + (i * 5),  # Vary between 20-35
                    last_sd=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                    last_td=None,
                    last_hd=None,
                    avg_age=0,
                    overdue=0,
                )
                self._crops[container_id].append(default_crop)

        # Create initial activity for container creation
        from app.models import ActivityType, ContainerActivity

        creation_activity = ContainerActivity(
            id=f"activity-{container_id}-001",
            container_id=container_id,
            type=ActivityType.CREATED,
            timestamp=datetime.now(timezone.utc),
            description=f"Container '{container_dict['name']}' was created",
            user=ActivityUser(name=container_dict["creator"], role="Administrator"),
            details={},
        )
        self._activities[container_id].append(creation_activity)

        return container

    def update_container(
        self, container_id: str, container_data: ContainerUpdate
    ) -> Container | None:
        """Update an existing container."""
        if container_id not in self._containers:
            return None

        container = self._containers[container_id]
        update_data = container_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(container, field, value)
        container.modified = datetime.now(timezone.utc)
        return container

    def delete_container(self, container_id: str) -> bool:
        """Delete a container and all related data."""
        if container_id not in self._containers:
            return False

        del self._containers[container_id]
        if container_id in self._metrics:
            del self._metrics[container_id]
        if container_id in self._crops:
            del self._crops[container_id]
        if container_id in self._activities:
            del self._activities[container_id]
        return True

    # Metrics operations
    def get_container_metrics(
        self, container_id: str, time_range: TimeRange = TimeRange.WEEK
    ) -> ContainerMetrics | None:
        """Get the latest metrics for a container within the specified time range."""
        if container_id not in self._metrics:
            return None

        metrics_list = self._metrics[container_id]
        # Return the most recent metrics for the given time range
        for metrics in reversed(metrics_list):
            if metrics.time_range == time_range:
                return metrics

        # If no metrics found for the specific time range, return the most recent
        return metrics_list[-1] if metrics_list else None

    def create_container_metrics(
        self, metrics_data: ContainerMetricsCreate
    ) -> ContainerMetrics:
        """Create new metrics for a container."""
        metrics = ContainerMetrics(
            id=uuid4(), **metrics_data.model_dump(), created=datetime.now(timezone.utc)
        )

        if metrics_data.container_id not in self._metrics:
            self._metrics[metrics_data.container_id] = []

        self._metrics[metrics_data.container_id].append(metrics)
        return metrics

    # Crops operations
    def get_container_crops(
        self,
        container_id: str,
        page: int = 0,
        page_size: int = 10,
        seed_type: str | None = None,
    ) -> tuple[list[ContainerCrop], int]:
        """Get crops for a container with pagination and optional filtering."""
        if container_id not in self._crops:
            return [], 0

        crops = self._crops[container_id]

        # Filter by seed type if specified
        if seed_type:
            crops = [crop for crop in crops if crop.seed_type == seed_type]

        total = len(crops)
        start = page * page_size
        end = start + page_size

        return crops[start:end], total

    def create_container_crop(self, crop_data: ContainerCropCreate) -> ContainerCrop:
        """Create a new crop record for a container."""
        crop_id = f"crop-{len(self._crops.get(crop_data.container_id, [])) + 1:03d}"
        crop = ContainerCrop(id=crop_id, **crop_data.model_dump())

        if crop_data.container_id not in self._crops:
            self._crops[crop_data.container_id] = []

        self._crops[crop_data.container_id].append(crop)
        return crop

    # Activities operations
    def get_container_activities(
        self, container_id: str, limit: int = 5
    ) -> list[ContainerActivity]:
        """Get recent activities for a container."""
        if container_id not in self._activities:
            return []

        activities = self._activities[container_id]
        # Sort by timestamp descending and return the most recent
        sorted_activities = sorted(activities, key=lambda x: x.timestamp, reverse=True)
        return sorted_activities[:limit]

    def create_container_activity(
        self, activity_data: ContainerActivityCreate
    ) -> ContainerActivity:
        """Create a new activity record for a container."""
        activity_id = f"activity-{len(self._activities.get(activity_data.container_id, [])) + 1:03d}"
        activity = ContainerActivity(
            id=activity_id,
            **activity_data.model_dump(),
            timestamp=datetime.now(timezone.utc),
        )

        if activity_data.container_id not in self._activities:
            self._activities[activity_data.container_id] = []

        self._activities[activity_data.container_id].append(activity)
        return activity

    def get_containers_filtered(
        self, skip: int = 0, limit: int = 100, filters: dict = None
    ) -> tuple[list[Container], int]:
        """Get containers with filtering and pagination."""
        containers = list(self._containers.values())

        if filters:
            # Apply filters
            if filters.get("name"):
                containers = [
                    c for c in containers if filters["name"].lower() in c.name.lower()
                ]

            if filters.get("tenant_id"):
                containers = [c for c in containers if c.tenant == filters["tenant_id"]]

            if filters.get("type"):
                containers = [c for c in containers if c.type == filters["type"]]

            if filters.get("purpose"):
                containers = [
                    c for c in containers if c.purpose.value == filters["purpose"]
                ]

            if filters.get("status"):
                containers = [c for c in containers if c.status == filters["status"]]

            if filters.get("location"):
                location_filter = filters["location"].lower()
                containers = [
                    c
                    for c in containers
                    if (
                        location_filter in c.location.get("city", "").lower()
                        or location_filter in c.location.get("country", "").lower()
                    )
                ]

            if filters.get("has_alerts") is not None:
                # Mock alert filtering - in real implementation would check alerts
                if filters["has_alerts"]:
                    # Return subset with mock alerts
                    containers = (
                        containers[: len(containers) // 2] if containers else []
                    )

        total = len(containers)
        return containers[skip : skip + limit], total

    def get_container_stats(self) -> dict:
        """Get container statistics - counts by type."""
        containers = list(self._containers.values())
        physical_count = sum(1 for c in containers if c.type == ContainerType.PHYSICAL)
        virtual_count = sum(1 for c in containers if c.type == ContainerType.VIRTUAL)

        return {"physical_count": physical_count, "virtual_count": virtual_count}
