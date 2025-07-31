"""Performance tests for device operations."""

import pytest
import time
from datetime import datetime
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.device import Device
from app.models.container import Container
from app.models.tenant import Tenant


@pytest.mark.performance
@pytest.mark.database
class TestDevicePerformance:
    """Test device operation performance."""

    @pytest.mark.asyncio
    async def test_bulk_device_registration_performance(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test performance of bulk device registration."""
        # Setup: Create container
        tenant = Tenant(name="Performance Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Performance Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="performance"
        )
        async_session.add(container)
        await async_session.commit()
        
        # Test: Register multiple devices and measure time
        device_count = 50
        start_time = time.time()
        
        for i in range(device_count):
            device_data = {
                "container_id": container.id,
                "name": f"Performance Device {i+1}",
                "model": f"PerfModel{i+1}",
                "serial_number": f"PERF{i+1:04d}",
                "firmware_version": "1.0.0"
            }
            
            response = await client.post(
                "/api/v1/devices/register",
                json=device_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
        
        end_time = time.time()
        registration_time = end_time - start_time
        
        # Performance assertion: Should complete within reasonable time
        # Expecting less than 1 second per device on average
        assert registration_time < device_count * 1.0
        
        # Log performance metrics
        avg_time_per_device = registration_time / device_count
        print(f"\nBulk Registration Performance:")
        print(f"  Total devices: {device_count}")
        print(f"  Total time: {registration_time:.2f} seconds")
        print(f"  Average time per device: {avg_time_per_device:.3f} seconds")
        print(f"  Devices per second: {device_count / registration_time:.2f}")

    @pytest.mark.asyncio
    async def test_bulk_status_update_performance(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test performance of bulk status updates."""
        # Setup: Create container and devices
        tenant = Tenant(name="Bulk Performance Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Bulk Performance Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="performance"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices directly in database for speed
        device_count = 100
        devices = []
        for i in range(device_count):
            device = Device(
                container_id=container.id,
                name=f"Bulk Device {i+1}",
                model=f"BulkModel{i+1}",
                serial_number=f"BULK{i+1:04d}",
                status="offline"
            )
            devices.append(device)
        
        async_session.add_all(devices)
        await async_session.commit()
        
        device_ids = [device.id for device in devices]
        
        # Test: Bulk update and measure time
        start_time = time.time()
        
        bulk_data = {
            "device_ids": device_ids,
            "status": "running",
            "reason": "Performance test bulk startup"
        }
        
        response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=bulk_data,
            headers=auth_headers
        )
        
        end_time = time.time()
        update_time = end_time - start_time
        
        assert response.status_code == 200
        bulk_response = response.json()
        assert bulk_response["success"] is True
        assert len(bulk_response["updated_devices"]) == device_count
        
        # Performance assertion: Should complete within reasonable time
        # Expecting bulk operation to be much faster than individual updates
        assert update_time < 5.0  # Should complete in under 5 seconds
        
        # Log performance metrics
        print(f"\nBulk Status Update Performance:")
        print(f"  Total devices: {device_count}")
        print(f"  Total time: {update_time:.2f} seconds")
        print(f"  Devices per second: {device_count / update_time:.2f}")

    @pytest.mark.asyncio
    async def test_device_query_performance(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test performance of device queries."""
        # Setup: Create container with many devices
        tenant = Tenant(name="Query Performance Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Query Performance Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="performance"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create devices with various statuses
        device_count = 200
        devices = []
        statuses = ["running", "idle", "issue", "offline"]
        
        for i in range(device_count):
            device = Device(
                container_id=container.id,
                name=f"Query Device {i+1}",
                model=f"QueryModel{i+1}",
                serial_number=f"QUERY{i+1:04d}",
                status=statuses[i % len(statuses)],
                diagnostics_uptime=float(24 - (i % 24)),
                diagnostics_error_count=i % 5
            )
            devices.append(device)
        
        async_session.add_all(devices)
        await async_session.commit()
        
        # Test: Query container devices and measure time
        start_time = time.time()
        
        response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        end_time = time.time()
        query_time = end_time - start_time
        
        assert response.status_code == 200
        container_data = response.json()
        assert len(container_data["devices"]) == device_count
        
        # Performance assertion: Query should complete quickly
        assert query_time < 2.0  # Should complete in under 2 seconds
        
        # Test management summary query
        start_time = time.time()
        
        summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        end_time = time.time()
        summary_time = end_time - start_time
        
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        assert summary_data["device_count"] == device_count
        
        # Performance assertion: Summary should be even faster
        assert summary_time < 1.0  # Should complete in under 1 second
        
        # Log performance metrics
        print(f"\nDevice Query Performance:")
        print(f"  Total devices: {device_count}")
        print(f"  Container devices query: {query_time:.3f} seconds")
        print(f"  Management summary query: {summary_time:.3f} seconds")

    @pytest.mark.asyncio
    async def test_device_alert_performance(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test performance of device alert operations."""
        # Setup: Create container and device
        tenant = Tenant(name="Alert Performance Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Alert Performance Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="performance"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Alert Performance Device",
            model="AlertPerfModel",
            serial_number="ALERTPERF001",
            status="running"
        )
        async_session.add(device)
        await async_session.commit()
        
        # Test: Create multiple alerts and measure time
        alert_count = 50
        start_time = time.time()
        
        for i in range(alert_count):
            alert_data = {
                "alert_type": "performance",
                "severity": "medium",
                "description": f"Performance alert {i+1}",
                "related_object": {"metric": "cpu", "value": 85.0 + i}
            }
            
            response = await client.post(
                f"/api/v1/devices/{device.id}/alerts",
                json=alert_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
        
        end_time = time.time()
        creation_time = end_time - start_time
        
        # Test: Query alerts and measure time
        start_time = time.time()
        
        alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        end_time = time.time()
        query_time = end_time - start_time
        
        assert alerts_response.status_code == 200
        alerts_data = alerts_response.json()
        assert len(alerts_data["alerts"]) == alert_count
        
        # Performance assertions
        assert creation_time < alert_count * 0.5  # Less than 0.5s per alert
        assert query_time < 1.0  # Query should be fast
        
        # Log performance metrics
        print(f"\nDevice Alert Performance:")
        print(f"  Total alerts created: {alert_count}")
        print(f"  Creation time: {creation_time:.2f} seconds")
        print(f"  Average time per alert: {creation_time / alert_count:.3f} seconds")
        print(f"  Alert query time: {query_time:.3f} seconds")

    @pytest.mark.asyncio
    async def test_device_health_history_performance(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test performance of device health history operations."""
        # Setup: Create container and device with health history
        tenant = Tenant(name="Health Performance Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Health Performance Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="performance"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Health Performance Device",
            model="HealthPerfModel",
            serial_number="HEALTHPERF001",
            status="running"
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries directly for performance
        from app.models.device import DeviceHealthHistory
        from datetime import timedelta
        
        history_count = 1000
        base_time = datetime.utcnow()
        
        health_entries = []
        for i in range(history_count):
            entry = DeviceHealthHistory(
                device_id=device.id,
                timestamp=base_time - timedelta(hours=i),
                status="running" if i % 10 != 0 else "issue",
                uptime_hours=24.0 - (i % 24),
                error_count=i % 5,
                performance_score=95.0 - (i % 20),
                notes=f"History entry {i}" if i % 10 == 0 else None
            )
            health_entries.append(entry)
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        # Test: Query health history and measure time
        start_time = time.time()
        
        health_response = await client.get(
            f"/api/v1/devices/{device.id}/health-history?limit=100",
            headers=auth_headers
        )
        
        end_time = time.time()
        query_time = end_time - start_time
        
        assert health_response.status_code == 200
        health_data = health_response.json()
        assert len(health_data["health_history"]) == 100
        assert health_data["summary"]["average_uptime"] > 0
        
        # Performance assertion: Should handle large datasets efficiently
        assert query_time < 2.0  # Should complete in under 2 seconds
        
        # Log performance metrics
        print(f"\nDevice Health History Performance:")
        print(f"  Total history entries: {history_count}")
        print(f"  Query time (limit 100): {query_time:.3f} seconds")
        print(f"  Entries processed per second: {100 / query_time:.2f}")