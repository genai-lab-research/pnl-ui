"""Tests for Alert model with simplified container structure."""

import pytest
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.alert import Alert
from app.models.container import Container
from app.models.tenant import Tenant


@pytest.mark.models
@pytest.mark.database
class TestAlertModel:
    """Test Alert model functionality."""

    @pytest.mark.asyncio
    async def test_alert_creation(self, async_session: AsyncSession):
        """Test creating an alert with all fields."""
        # Create tenant
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container with simplified structure
        container = Container(
            name="Test Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development",
            location={
                "city": "San Francisco",
                "country": "USA",
                "address": "123 Test St"
            },
            notes="Test container",
            status="active",
            shadow_service_enabled=True,
            robotics_simulation_enabled=False,
            ecosystem_connected=False,
            ecosystem_settings={}
        )
        
        async_session.add(container)
        await async_session.flush()
        
        # Create alert
        alert = Alert(
            container_id=container.id,
            description="Test alert",
            severity="high",
            active=True,
            related_object={"sensor_id": "temp_001", "threshold": 25.0}
        )
        
        async_session.add(alert)
        await async_session.commit()
        
        # Verify alert creation
        assert alert.id is not None
        assert alert.container_id == container.id
        assert alert.description == "Test alert"
        assert alert.severity == "high"
        assert alert.active is True
        assert alert.related_object["sensor_id"] == "temp_001"
        assert alert.related_object["threshold"] == 25.0
        assert isinstance(alert.created_at, datetime)
        assert isinstance(alert.updated_at, datetime)

    @pytest.mark.asyncio
    async def test_alert_minimal_creation(self, async_session: AsyncSession):
        """Test creating an alert with only required fields."""
        # Create tenant
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Minimal Test Container",
            tenant_id=tenant.id,
            type="virtual",
            purpose="research",
            status="created",
            shadow_service_enabled=False,
            robotics_simulation_enabled=False,
            ecosystem_connected=False,
            ecosystem_settings={}
        )
        
        async_session.add(container)
        await async_session.flush()
        
        # Create minimal alert
        alert = Alert(
            container_id=container.id,
            description="Minimal alert",
            severity="low"
        )
        
        async_session.add(alert)
        await async_session.commit()
        
        # Verify defaults
        assert alert.id is not None
        assert alert.container_id == container.id
        assert alert.description == "Minimal alert"
        assert alert.severity == "low"
        assert alert.active is True  # Should default to True
        assert alert.related_object is None

    @pytest.mark.asyncio
    async def test_alert_container_relationship(self, async_session: AsyncSession):
        """Test alert relationship with container."""
        # Create tenant
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Relationship Test Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production",
            status="active",
            shadow_service_enabled=True,
            robotics_simulation_enabled=True,
            ecosystem_connected=True,
            ecosystem_settings={"monitoring": True}
        )
        
        async_session.add(container)
        await async_session.flush()
        
        # Create alert
        alert = Alert(
            container_id=container.id,
            description="Relationship test alert",
            severity="medium",
            active=True
        )
        
        async_session.add(alert)
        await async_session.commit()
        
        # Test relationship loading
        alert_with_container = await async_session.get(
            Alert, alert.id, options=[selectinload(Alert.container)]
        )
        
        assert alert_with_container.container is not None
        assert alert_with_container.container.name == "Relationship Test Container"
        assert alert_with_container.container.id == container.id

    @pytest.mark.asyncio
    async def test_multiple_alerts_per_container(self, async_session: AsyncSession):
        """Test multiple alerts for the same container."""
        # Create tenant
        tenant = Tenant(name="Test Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        # Create container
        container = Container(
            name="Multi Alert Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development",
            status="maintenance",
            shadow_service_enabled=False,
            robotics_simulation_enabled=False,
            ecosystem_connected=False,
            ecosystem_settings={}
        )
        
        async_session.add(container)
        await async_session.flush()
        
        # Create multiple alerts
        alerts = [
            Alert(
                container_id=container.id,
                description=f"Alert {i}",
                severity=["low", "medium", "high"][i % 3],
                active=i % 2 == 0
            )
            for i in range(3)
        ]
        
        async_session.add_all(alerts)
        await async_session.commit()
        
        # Query alerts for container
        result = await async_session.execute(
            select(Alert).where(Alert.container_id == container.id)
        )
        container_alerts = result.scalars().all()
        
        assert len(container_alerts) == 3
        assert all(alert.container_id == container.id for alert in container_alerts)
        
        # Check severities
        severities = [alert.severity for alert in container_alerts]
        assert "low" in severities
        assert "medium" in severities  
        assert "high" in severities