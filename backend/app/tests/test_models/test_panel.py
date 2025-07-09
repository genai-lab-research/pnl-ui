"""Tests for Panel model and PanelSnapshot model."""

import pytest
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.panel import Panel
from app.models.snapshots import PanelSnapshot
from app.models.container import Container
from app.models.tenant import Tenant


@pytest.mark.models
@pytest.mark.database
class TestPanelModel:
    """Test Panel model functionality for cultivation area."""

    @pytest.mark.asyncio
    async def test_panel_creation_with_all_fields(self, async_session: AsyncSession):
        """Test creating a panel with all fields."""
        # Create tenant and container first
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="cultivation"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create panel with all fields
        panel = Panel(
            container_id=container.id,
            rfid_tag="PANEL001",
            location={"wall": "wall_1", "slot_number": 1},
            utilization_pct=75.5,
            provisioned_at=datetime.now(timezone.utc),
            status="active",
            capacity=15,
            panel_type="cultivation"
        )
        
        async_session.add(panel)
        await async_session.commit()
        
        # Verify panel was created
        assert panel.id is not None
        assert panel.container_id == container.id
        assert panel.rfid_tag == "PANEL001"
        assert panel.location["wall"] == "wall_1"
        assert panel.location["slot_number"] == 1
        assert panel.utilization_pct == 75.5
        assert panel.status == "active"
        assert panel.capacity == 15
        assert panel.panel_type == "cultivation"

    @pytest.mark.asyncio
    async def test_panel_creation_minimal_fields(self, async_session: AsyncSession):
        """Test creating a panel with only required fields."""
        # Create tenant and container first
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create panel with minimal fields
        panel = Panel(container_id=container.id)
        
        async_session.add(panel)
        await async_session.commit()
        
        # Verify panel was created with nullable fields as None
        assert panel.id is not None
        assert panel.container_id == container.id
        assert panel.rfid_tag is None
        assert panel.location is None
        assert panel.utilization_pct is None
        assert panel.status is None
        assert panel.capacity is None
        assert panel.panel_type is None

    @pytest.mark.asyncio
    async def test_panel_container_relationship(self, async_session: AsyncSession):
        """Test panel-container relationship."""
        # Create tenant and container
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create multiple panels
        panel1 = Panel(
            container_id=container.id,
            rfid_tag="PANEL001",
            location={"wall": "wall_1", "slot_number": 1}
        )
        panel2 = Panel(
            container_id=container.id,
            rfid_tag="PANEL002",
            location={"wall": "wall_1", "slot_number": 2}
        )
        
        async_session.add_all([panel1, panel2])
        await async_session.commit()
        
        # Test relationship from panel to container
        result = await async_session.execute(
            select(Panel).where(Panel.id == panel1.id).options(selectinload(Panel.container))
        )
        panel_with_container = result.scalar_one()
        
        assert panel_with_container.container is not None
        assert panel_with_container.container.id == container.id
        assert panel_with_container.container.name == "Cultivation Container"
        
        # Test relationship from container to panels
        result = await async_session.execute(
            select(Container).where(Container.id == container.id).options(selectinload(Container.panels))
        )
        container_with_panels = result.scalar_one()
        
        assert len(container_with_panels.panels) == 2
        panel_rfids = [p.rfid_tag for p in container_with_panels.panels]
        assert "PANEL001" in panel_rfids
        assert "PANEL002" in panel_rfids

    @pytest.mark.asyncio
    async def test_panel_rfid_uniqueness(self, async_session: AsyncSession):
        """Test RFID tag uniqueness constraint."""
        # Create tenant and container
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create first panel with RFID
        panel1 = Panel(
            container_id=container.id,
            rfid_tag="UNIQUE_RFID"
        )
        async_session.add(panel1)
        await async_session.commit()
        
        # Try to create second panel with same RFID
        panel2 = Panel(
            container_id=container.id,
            rfid_tag="UNIQUE_RFID"
        )
        async_session.add(panel2)
        
        # Should raise integrity error
        with pytest.raises(Exception):  # IntegrityError or similar
            await async_session.commit()

    @pytest.mark.asyncio
    async def test_panel_location_json_field(self, async_session: AsyncSession):
        """Test JSON location field handling."""
        # Create tenant and container
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Test various location formats
        panel1 = Panel(
            container_id=container.id,
            rfid_tag="PANEL001",
            location={"wall": "wall_1", "slot_number": 15}
        )
        
        panel2 = Panel(
            container_id=container.id,
            rfid_tag="PANEL002",
            location={"wall": "wall_3", "slot_number": 8, "notes": "near window"}
        )
        
        panel3 = Panel(
            container_id=container.id,
            rfid_tag="PANEL003",
            location=None  # Off-wall panel
        )
        
        async_session.add_all([panel1, panel2, panel3])
        await async_session.commit()
        
        # Verify JSON data is preserved
        result = await async_session.execute(select(Panel).where(Panel.rfid_tag == "PANEL001"))
        retrieved_panel1 = result.scalar_one()
        assert retrieved_panel1.location["wall"] == "wall_1"
        assert retrieved_panel1.location["slot_number"] == 15
        
        result = await async_session.execute(select(Panel).where(Panel.rfid_tag == "PANEL002"))
        retrieved_panel2 = result.scalar_one()
        assert retrieved_panel2.location["notes"] == "near window"
        
        result = await async_session.execute(select(Panel).where(Panel.rfid_tag == "PANEL003"))
        retrieved_panel3 = result.scalar_one()
        assert retrieved_panel3.location is None


@pytest.mark.models
@pytest.mark.database
class TestPanelSnapshotModel:
    """Test PanelSnapshot model functionality for time-lapse tracking."""

    @pytest.mark.asyncio
    async def test_panel_snapshot_creation(self, async_session: AsyncSession):
        """Test creating a panel snapshot."""
        # Create tenant, container, and panel
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        panel = Panel(
            container_id=container.id,
            rfid_tag="PANEL001",
            location={"wall": "wall_1", "slot_number": 1}
        )
        async_session.add(panel)
        await async_session.flush()
        
        # Create panel snapshot
        snapshot = PanelSnapshot(
            timestamp=datetime.now(timezone.utc),
            container_id=container.id,
            panel_id=panel.id,
            rfid_tag="PANEL001",
            location={"wall": "wall_1", "slot_number": 1},
            crop_count=12,
            utilization_percentage=80.0,
            status="active"
        )
        
        async_session.add(snapshot)
        await async_session.commit()
        
        # Verify snapshot was created
        assert snapshot.id is not None
        assert snapshot.container_id == container.id
        assert snapshot.panel_id == panel.id
        assert snapshot.rfid_tag == "PANEL001"
        assert snapshot.crop_count == 12
        assert snapshot.utilization_percentage == 80.0
        assert snapshot.status == "active"

    @pytest.mark.asyncio
    async def test_panel_snapshot_relationships(self, async_session: AsyncSession):
        """Test panel snapshot relationships with panel and container."""
        # Create tenant, container, and panel
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        panel = Panel(
            container_id=container.id,
            rfid_tag="PANEL001"
        )
        async_session.add(panel)
        await async_session.flush()
        
        # Create multiple snapshots for the panel
        snapshot1 = PanelSnapshot(
            timestamp=datetime(2024, 1, 1, tzinfo=timezone.utc),
            container_id=container.id,
            panel_id=panel.id,
            rfid_tag="PANEL001",
            crop_count=5,
            utilization_percentage=33.3
        )
        
        snapshot2 = PanelSnapshot(
            timestamp=datetime(2024, 1, 2, tzinfo=timezone.utc),
            container_id=container.id,
            panel_id=panel.id,
            rfid_tag="PANEL001",
            crop_count=10,
            utilization_percentage=66.7
        )
        
        async_session.add_all([snapshot1, snapshot2])
        await async_session.commit()
        
        # Test relationship from snapshot to panel
        result = await async_session.execute(
            select(PanelSnapshot).where(PanelSnapshot.id == snapshot1.id).options(selectinload(PanelSnapshot.panel))
        )
        snapshot_with_panel = result.scalar_one()
        
        assert snapshot_with_panel.panel is not None
        assert snapshot_with_panel.panel.id == panel.id
        assert snapshot_with_panel.panel.rfid_tag == "PANEL001"
        
        # Test relationship from panel to snapshots
        result = await async_session.execute(
            select(Panel).where(Panel.id == panel.id).options(selectinload(Panel.panel_snapshots))
        )
        panel_with_snapshots = result.scalar_one()
        
        assert len(panel_with_snapshots.panel_snapshots) == 2
        crop_counts = [s.crop_count for s in panel_with_snapshots.panel_snapshots]
        assert 5 in crop_counts
        assert 10 in crop_counts

    @pytest.mark.asyncio
    async def test_panel_snapshot_time_series(self, async_session: AsyncSession):
        """Test panel snapshot ordering for time-lapse functionality."""
        # Create tenant, container, and panel
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Cultivation Container",
            tenant_id=tenant.id,
            type="physical"
        )
        async_session.add(container)
        await async_session.flush()
        
        panel = Panel(
            container_id=container.id,
            rfid_tag="PANEL001"
        )
        async_session.add(panel)
        await async_session.flush()
        
        # Create snapshots in non-chronological order
        snapshots = [
            PanelSnapshot(
                timestamp=datetime(2024, 1, 3, tzinfo=timezone.utc),
                container_id=container.id,
                panel_id=panel.id,
                crop_count=15,
                utilization_percentage=100.0
            ),
            PanelSnapshot(
                timestamp=datetime(2024, 1, 1, tzinfo=timezone.utc),
                container_id=container.id,
                panel_id=panel.id,
                crop_count=5,
                utilization_percentage=33.3
            ),
            PanelSnapshot(
                timestamp=datetime(2024, 1, 2, tzinfo=timezone.utc),
                container_id=container.id,
                panel_id=panel.id,
                crop_count=10,
                utilization_percentage=66.7
            )
        ]
        
        async_session.add_all(snapshots)
        await async_session.commit()
        
        # Query snapshots ordered by timestamp
        result = await async_session.execute(
            select(PanelSnapshot)
            .where(PanelSnapshot.panel_id == panel.id)
            .order_by(PanelSnapshot.timestamp)
        )
        ordered_snapshots = result.scalars().all()
        
        # Verify chronological order
        assert len(ordered_snapshots) == 3
        assert ordered_snapshots[0].crop_count == 5
        assert ordered_snapshots[1].crop_count == 10
        assert ordered_snapshots[2].crop_count == 15
        
        # Verify utilization progression
        utilizations = [s.utilization_percentage for s in ordered_snapshots]
        assert utilizations == [33.3, 66.7, 100.0]