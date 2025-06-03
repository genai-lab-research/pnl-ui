from datetime import datetime, timedelta, timezone

from app.models import (
    PanelChannelData,
    CropData,
    CropDataPublic,
    CropHistory,
    CropHistoryEvent,
    CropSize,
    CultivationAreaData,
    HealthStatus,
    NurseryStationData,
    PanelData,
    PanelDataCreate,
    PanelDataPublic,
    ShelfData,
    ShelfType,
    SlotData,
    TrayData,
    TrayDataCreate,
    TrayDataPublic,
    UtilizationLevel,
    WallData,
    WallType,
)


class InventoryRepository:
    def __init__(self):
        self._trays: dict[
            str, dict[str, TrayData]
        ] = {}  # container_id -> tray_id -> TrayData
        self._panels: dict[
            str, dict[str, PanelData]
        ] = {}  # container_id -> panel_id -> PanelData
        self._crops: dict[
            str, dict[str, CropData]
        ] = {}  # container_id -> crop_id -> CropData
        self._crop_history: dict[str, list[CropHistoryEvent]] = {}  # crop_id -> events
        self._initialize_mock_data()

    def _initialize_mock_data(self):
        """Initialize repository with mock data for container-04."""
        container_id = "container-04"

        # Initialize empty dictionaries for the container
        self._trays[container_id] = {}
        self._panels[container_id] = {}
        self._crops[container_id] = {}

        # Create mock trays for nursery station
        self._create_nursery_mock_data(container_id)

        # Create mock panels for cultivation area
        self._create_cultivation_mock_data(container_id)

    def _create_nursery_mock_data(self, container_id: str):
        """Create mock data for nursery station."""
        # Mock tray on upper shelf slot 1
        tray1 = TrayData(
            id="TR-10-595383-3131",
            container_id=container_id,
            utilization_percentage=85,
            crop_count=170,
            utilization_level=UtilizationLevel.HIGH,
            rfid_tag="A1B2C3D4",
            shelf=ShelfType.UPPER,
            slot_number=1,
            is_on_shelf=True,
            created=datetime.now(timezone.utc) - timedelta(days=15),
        )
        self._trays[container_id]["TR-10-595383-3131"] = tray1

        # Mock tray on lower shelf slot 3
        tray2 = TrayData(
            id="TR-10-595383-3132",
            container_id=container_id,
            utilization_percentage=60,
            crop_count=120,
            utilization_level=UtilizationLevel.MEDIUM,
            rfid_tag="E5F6G7H8",
            shelf=ShelfType.LOWER,
            slot_number=3,
            is_on_shelf=True,
            created=datetime.now(timezone.utc) - timedelta(days=10),
        )
        self._trays[container_id]["TR-10-595383-3132"] = tray2

        # Mock off-shelf tray
        tray3 = TrayData(
            id="TR-10-595383-3133",
            container_id=container_id,
            utilization_percentage=30,
            crop_count=60,
            utilization_level=UtilizationLevel.LOW,
            rfid_tag="I9J0K1L2",
            shelf=None,
            slot_number=None,
            is_on_shelf=False,
            created=datetime.now(timezone.utc) - timedelta(days=5),
        )
        self._trays[container_id]["TR-10-595383-3133"] = tray3

        # Create mock crops for tray1
        for i in range(5):
            crop = CropData(
                id=f"crop-nursery-{i+1:03d}",
                container_id=container_id,
                tray_id="TR-10-595383-3131",
                panel_id=None,
                seed_type="Someroots",
                row=5 + i,
                column=10 + i,
                age_days=14 + i,
                seeded_date=(
                    datetime.now(timezone.utc) - timedelta(days=14 + i)
                ).strftime("%Y-%m-%d"),
                planned_transplanting_date=(
                    datetime.now(timezone.utc) + timedelta(days=7 - i)
                ).strftime("%Y-%m-%d"),
                transplanted_date=None,
                planned_harvesting_date=(
                    datetime.now(timezone.utc) + timedelta(days=45 - i)
                ).strftime("%Y-%m-%d"),
                overdue_days=max(0, i - 2),
                health_status=HealthStatus.HEALTHY
                if i < 3
                else HealthStatus.TREATMENT_REQUIRED,
                size=CropSize.MEDIUM,
                created=datetime.now(timezone.utc) - timedelta(days=14 + i),
            )
            self._crops[container_id][crop.id] = crop

            # Create history for this crop
            self._crop_history[crop.id] = [
                CropHistoryEvent(
                    date=crop.seeded_date,
                    event="seeded",
                    location={
                        "type": "tray",
                        "tray_id": "TR-10-595383-3131",
                        "row": crop.row,
                        "column": crop.column,
                    },
                    health_status=HealthStatus.HEALTHY,
                    size=CropSize.SMALL,
                    notes="Initial seeding",
                ),
                CropHistoryEvent(
                    date=(datetime.now(timezone.utc) - timedelta(days=7)).strftime(
                        "%Y-%m-%d"
                    ),
                    event="growth_update",
                    location={
                        "type": "tray",
                        "tray_id": "TR-10-595383-3131",
                        "row": crop.row,
                        "column": crop.column,
                    },
                    health_status=crop.health_status,
                    size=crop.size,
                    notes="Normal growth progression",
                ),
            ]

    def _create_cultivation_mock_data(self, container_id: str):
        """Create mock data for cultivation area."""
        # Mock panel on wall 1 slot 1
        panel1 = PanelData(
            id="PN-10-662850-5223",
            container_id=container_id,
            utilization_percentage=75,
            crop_count=45,
            utilization_level=UtilizationLevel.HIGH,
            rfid_tag="J9K0L1M2",
            wall=WallType.WALL_1,
            slot_number=1,
            is_on_wall=True,
            created=datetime.now(timezone.utc) - timedelta(days=20),
        )
        self._panels[container_id]["PN-10-662850-5223"] = panel1

        # Mock panel on wall 2 slot 5
        panel2 = PanelData(
            id="PN-10-662850-5224",
            container_id=container_id,
            utilization_percentage=40,
            crop_count=20,
            utilization_level=UtilizationLevel.LOW,
            rfid_tag="N3O4P5Q6",
            wall=WallType.WALL_2,
            slot_number=5,
            is_on_wall=True,
            created=datetime.now(timezone.utc) - timedelta(days=15),
        )
        self._panels[container_id]["PN-10-662850-5224"] = panel2

        # Mock overflow panel
        panel3 = PanelData(
            id="PN-10-662850-5225",
            container_id=container_id,
            utilization_percentage=90,
            crop_count=60,
            utilization_level=UtilizationLevel.HIGH,
            rfid_tag="R7S8T9U0",
            wall=None,
            slot_number=None,
            is_on_wall=False,
            created=datetime.now(timezone.utc) - timedelta(days=8),
        )
        self._panels[container_id]["PN-10-662850-5225"] = panel3

        # Create mock crops for panel1
        for channel in range(1, 4):  # 3 channels
            for position in range(1, 16):  # 15 positions per channel
                crop = CropData(
                    id=f"crop-panel-{channel}-{position:02d}",
                    container_id=container_id,
                    tray_id=None,
                    panel_id="PN-10-662850-5223",
                    seed_type="Basil"
                    if channel == 1
                    else "Lettuce"
                    if channel == 2
                    else "Spinach",
                    channel=channel,
                    position=position,
                    age_days=28 + position,
                    seeded_date=(
                        datetime.now(timezone.utc) - timedelta(days=28 + position)
                    ).strftime("%Y-%m-%d"),
                    transplanted_date=(
                        datetime.now(timezone.utc) - timedelta(days=14 + position)
                    ).strftime("%Y-%m-%d"),
                    planned_harvesting_date=(
                        datetime.now(timezone.utc) + timedelta(days=30 - position)
                    ).strftime("%Y-%m-%d"),
                    overdue_days=max(0, position - 10),
                    health_status=HealthStatus.HEALTHY
                    if position < 10
                    else HealthStatus.TREATMENT_REQUIRED,
                    size=CropSize.LARGE if position > 10 else CropSize.MEDIUM,
                    created=datetime.now(timezone.utc) - timedelta(days=28 + position),
                )
                self._crops[container_id][crop.id] = crop

                # Create history for this crop
                self._crop_history[crop.id] = [
                    CropHistoryEvent(
                        date=crop.seeded_date,
                        event="seeded",
                        location={
                            "type": "tray",
                            "tray_id": "TR-10-595383-3131",
                            "row": 1,
                            "column": position,
                        },
                        health_status=HealthStatus.HEALTHY,
                        size=CropSize.SMALL,
                        notes="Initial seeding in nursery",
                    ),
                    CropHistoryEvent(
                        date=crop.transplanted_date,
                        event="transplanted",
                        location={
                            "type": "panel",
                            "panel_id": "PN-10-662850-5223",
                            "channel": channel,
                            "position": position,
                        },
                        health_status=HealthStatus.HEALTHY,
                        size=CropSize.MEDIUM,
                        notes="Transplanted to cultivation area",
                    ),
                ]

    # Nursery Station Operations

    def get_nursery_station_data(
        self, container_id: str, date: datetime | None = None
    ) -> NurseryStationData:
        """Get nursery station layout and tray data."""
        if container_id not in self._trays:
            self._trays[container_id] = {}
            self._crops[container_id] = {}

        # Get all trays for this container
        trays = list(self._trays[container_id].values())
        crops = list(self._crops[container_id].values())

        # Separate on-shelf and off-shelf trays
        on_shelf_trays = [t for t in trays if t.is_on_shelf]
        off_shelf_trays = [t for t in trays if not t.is_on_shelf]

        # Create slots for upper and lower shelves (8 slots each)
        upper_slots = []
        lower_slots = []

        for slot_num in range(1, 9):
            # Upper shelf
            upper_tray = next(
                (
                    t
                    for t in on_shelf_trays
                    if t.shelf == ShelfType.UPPER and t.slot_number == slot_num
                ),
                None,
            )
            upper_slot = SlotData(
                slot_number=slot_num,
                occupied=upper_tray is not None,
                tray=self._tray_to_public(upper_tray, crops) if upper_tray else None,
            )
            upper_slots.append(upper_slot)

            # Lower shelf
            lower_tray = next(
                (
                    t
                    for t in on_shelf_trays
                    if t.shelf == ShelfType.LOWER and t.slot_number == slot_num
                ),
                None,
            )
            lower_slot = SlotData(
                slot_number=slot_num,
                occupied=lower_tray is not None,
                tray=self._tray_to_public(lower_tray, crops) if lower_tray else None,
            )
            lower_slots.append(lower_slot)

        # Calculate utilization
        occupied_slots = sum(1 for slot in upper_slots + lower_slots if slot.occupied)
        utilization_percentage = int((occupied_slots / 16) * 100)

        return NurseryStationData(
            utilization_percentage=utilization_percentage,
            upper_shelf=ShelfData(slots=upper_slots),
            lower_shelf=ShelfData(slots=lower_slots),
            off_shelf_trays=[self._tray_to_public(t, crops) for t in off_shelf_trays],
        )

    # Cultivation Area Operations

    def get_cultivation_area_data(
        self, container_id: str, date: datetime | None = None
    ) -> CultivationAreaData:
        """Get cultivation area layout and panel data."""
        if container_id not in self._panels:
            self._panels[container_id] = {}
            self._crops[container_id] = {}

        # Get all panels for this container
        panels = list(self._panels[container_id].values())
        crops = list(self._crops[container_id].values())

        # Separate on-wall and overflow panels
        on_wall_panels = [p for p in panels if p.is_on_wall]
        overflow_panels = [p for p in panels if not p.is_on_wall]

        # Create walls (4 walls with 22 slots each)
        walls = []
        for wall_num in range(1, 5):
            wall_type = getattr(WallType, f"WALL_{wall_num}")
            wall_slots = []

            for slot_num in range(1, 23):
                panel = next(
                    (
                        p
                        for p in on_wall_panels
                        if p.wall == wall_type and p.slot_number == slot_num
                    ),
                    None,
                )
                slot = SlotData(
                    slot_number=slot_num,
                    occupied=panel is not None,
                    panel=self._panel_to_public(panel, crops) if panel else None,
                )
                wall_slots.append(slot)

            wall = WallData(
                wall_number=wall_num, name=f"Wall {wall_num}", slots=wall_slots
            )
            walls.append(wall)

        # Calculate utilization
        total_slots = 4 * 22  # 4 walls * 22 slots
        occupied_slots = sum(
            1 for wall in walls for slot in wall.slots if slot.occupied
        )
        utilization_percentage = int((occupied_slots / total_slots) * 100)

        return CultivationAreaData(
            utilization_percentage=utilization_percentage,
            walls=walls,
            overflow_panels=[self._panel_to_public(p, crops) for p in overflow_panels],
        )

    # Tray Operations

    def provision_tray(self, container_id: str, tray_data: TrayDataCreate) -> TrayData:
        """Provision a new tray."""
        tray_id = f"TR-{len(self._trays.get(container_id, {})) + 1:02d}-{int(datetime.now().timestamp())}-{container_id[-4:]}"

        location = tray_data.location
        tray = TrayData(
            id=tray_id,
            container_id=container_id,
            utilization_percentage=tray_data.utilization_percentage,
            crop_count=tray_data.crop_count,
            utilization_level=tray_data.utilization_level,
            rfid_tag=tray_data.rfid_tag,
            shelf=ShelfType(location.get("shelf")) if location.get("shelf") else None,
            slot_number=location.get("slot_number"),
            is_on_shelf=location.get("shelf") is not None,
            created=datetime.now(timezone.utc),
        )

        if container_id not in self._trays:
            self._trays[container_id] = {}

        self._trays[container_id][tray_id] = tray
        return tray

    # Panel Operations

    def provision_panel(
        self, container_id: str, panel_data: PanelDataCreate
    ) -> PanelData:
        """Provision a new panel."""
        panel_id = f"PN-{len(self._panels.get(container_id, {})) + 1:02d}-{int(datetime.now().timestamp())}-{container_id[-4:]}"

        location = panel_data.location
        panel = PanelData(
            id=panel_id,
            container_id=container_id,
            utilization_percentage=panel_data.utilization_percentage,
            crop_count=panel_data.crop_count,
            utilization_level=panel_data.utilization_level,
            rfid_tag=panel_data.rfid_tag,
            wall=WallType(location.get("wall")) if location.get("wall") else None,
            slot_number=location.get("slot_number"),
            is_on_wall=location.get("wall") is not None,
            created=datetime.now(timezone.utc),
        )

        if container_id not in self._panels:
            self._panels[container_id] = {}

        self._panels[container_id][panel_id] = panel
        return panel

    # Crop Operations

    def get_crop_history(
        self,
        container_id: str,
        crop_id: str,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> CropHistory:
        """Get crop history for time-lapse view."""
        if crop_id not in self._crop_history:
            return CropHistory(crop_id=crop_id, history=[])

        history = self._crop_history[crop_id]

        # Filter by date range if provided
        if start_date or end_date:
            filtered_history = []
            for event in history:
                event_date = datetime.fromisoformat(event.date)
                if start_date and event_date < start_date:
                    continue
                if end_date and event_date > end_date:
                    continue
                filtered_history.append(event)
            history = filtered_history

        return CropHistory(crop_id=crop_id, history=history)

    # Helper Methods

    def _tray_to_public(
        self, tray: TrayData | None, all_crops: list[CropData]
    ) -> TrayDataPublic | None:
        """Convert TrayData to TrayDataPublic with crops."""
        if not tray:
            return None

        # Get crops for this tray
        tray_crops = [crop for crop in all_crops if crop.tray_id == tray.id]
        crop_publics = [self._crop_to_public(crop) for crop in tray_crops]

        return TrayDataPublic(
            id=tray.id,
            utilization_percentage=tray.utilization_percentage,
            crop_count=tray.crop_count,
            utilization_level=tray.utilization_level,
            rfid_tag=tray.rfid_tag,
            shelf=tray.shelf,
            slot_number=tray.slot_number,
            is_on_shelf=tray.is_on_shelf,
            crops=crop_publics,
        )

    def _panel_to_public(
        self, panel: PanelData | None, all_crops: list[CropData]
    ) -> PanelDataPublic | None:
        """Convert PanelData to PanelDataPublic with channels and crops."""
        if not panel:
            return None

        # Get crops for this panel
        panel_crops = [crop for crop in all_crops if crop.panel_id == panel.id]

        # Group crops by channel
        channels = []
        for channel_num in range(1, 4):  # Assuming 3 channels per panel
            channel_crops = [
                crop for crop in panel_crops if crop.channel == channel_num
            ]
            crop_publics = [self._crop_to_public(crop) for crop in channel_crops]

            channel = PanelChannelData(channel_number=channel_num, crops=crop_publics)
            channels.append(channel)

        return PanelDataPublic(
            id=panel.id,
            utilization_percentage=panel.utilization_percentage,
            crop_count=panel.crop_count,
            utilization_level=panel.utilization_level,
            rfid_tag=panel.rfid_tag,
            wall=panel.wall,
            slot_number=panel.slot_number,
            is_on_wall=panel.is_on_wall,
            channels=channels,
        )

    def _crop_to_public(self, crop: CropData) -> CropDataPublic:
        """Convert CropData to CropDataPublic."""
        return CropDataPublic(
            id=crop.id,
            container_id=crop.container_id,
            tray_id=crop.tray_id,
            panel_id=crop.panel_id,
            seed_type=crop.seed_type,
            age_days=crop.age_days,
            seeded_date=crop.seeded_date,
            planned_transplanting_date=crop.planned_transplanting_date,
            transplanted_date=crop.transplanted_date,
            planned_harvesting_date=crop.planned_harvesting_date,
            overdue_days=crop.overdue_days,
            health_status=crop.health_status,
            size=crop.size,
            row=crop.row,
            column=crop.column,
            channel=crop.channel,
            position=crop.position,
            created=crop.created,
        )
