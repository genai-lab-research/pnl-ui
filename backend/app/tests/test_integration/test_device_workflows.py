"""Integration tests for end-to-end device workflows."""

import pytest
from datetime import datetime, timedelta
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.device import Device, DeviceHealthHistory
from app.models.container import Container
from app.models.tenant import Tenant
from app.models.alert import Alert


@pytest.mark.integration
@pytest.mark.database
class TestDeviceWorkflowIntegration:
    """Test complete device workflows from registration to deletion."""

    @pytest.mark.asyncio
    async def test_complete_device_lifecycle(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test complete device lifecycle: register -> configure -> monitor -> delete."""
        # Step 1: Create container for device
        tenant = Tenant(name="Lifecycle Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Lifecycle Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="development"
        )
        async_session.add(container)
        await async_session.commit()
        
        # Step 2: Register new device
        device_data = {
            "container_id": container.id,
            "name": "Lifecycle Device",
            "model": "LifecycleModel",
            "serial_number": "LIFE001",
            "firmware_version": "1.0.0",
            "port": "USB-A"
        }
        
        register_response = await client.post(
            "/api/v1/devices/register",
            json=device_data,
            headers=auth_headers
        )
        
        assert register_response.status_code == 200
        device_info = register_response.json()
        device_id = device_info["id"]
        
        # Verify device was created with correct status
        assert device_info["status"] == "offline"
        assert device_info["name"] == "Lifecycle Device"
        
        # Step 3: Update device status to running
        status_update = {
            "status": "running",
            "reason": "Device startup completed"
        }
        
        status_response = await client.put(
            f"/api/v1/devices/{device_id}/status",
            json=status_update,
            headers=auth_headers
        )
        
        assert status_response.status_code == 200
        status_data = status_response.json()
        assert status_data["success"] is True
        assert status_data["updated_status"] == "running"
        
        # Step 4: Update device information
        device_update = {
            "name": "Updated Lifecycle Device",
            "firmware_version": "2.0.0",
            "port": "USB-C"
        }
        
        update_response = await client.put(
            f"/api/v1/devices/{device_id}",
            json=device_update,
            headers=auth_headers
        )
        
        assert update_response.status_code == 200
        updated_info = update_response.json()
        assert updated_info["name"] == "Updated Lifecycle Device"
        assert updated_info["firmware_version"] == "2.0.0"
        
        # Step 5: Create device alert
        alert_data = {
            "alert_type": "temperature",
            "severity": "medium",
            "description": "Temperature spike detected",
            "related_object": {"temperature": 75.0, "threshold": 70.0}
        }
        
        alert_response = await client.post(
            f"/api/v1/devices/{device_id}/alerts",
            json=alert_data,
            headers=auth_headers
        )
        
        assert alert_response.status_code == 200
        alert_info = alert_response.json()
        alert_id = alert_info["id"]
        
        # Step 6: Acknowledge alert
        ack_data = {
            "acknowledged_by": "test_user",
            "notes": "Temperature within acceptable range"
        }
        
        ack_response = await client.put(
            f"/api/v1/devices/alerts/{alert_id}/acknowledge",
            json=ack_data,
            headers=auth_headers
        )
        
        assert ack_response.status_code == 200
        
        # Step 7: Resolve alert
        resolve_data = {
            "resolved_by": "test_user",
            "resolution_notes": "Cooling system adjusted"
        }
        
        resolve_response = await client.put(
            f"/api/v1/devices/alerts/{alert_id}/resolve",
            json=resolve_data,
            headers=auth_headers
        )
        
        assert resolve_response.status_code == 200
        
        # Step 8: Simulate heartbeat
        heartbeat_response = await client.get(
            f"/api/v1/devices/{device_id}/heartbeat",
            headers=auth_headers
        )
        
        assert heartbeat_response.status_code == 200
        
        # Step 9: Get health history
        health_response = await client.get(
            f"/api/v1/devices/{device_id}/health-history",
            headers=auth_headers
        )
        
        assert health_response.status_code == 200
        health_data = health_response.json()
        assert len(health_data["health_history"]) > 0
        
        # Step 10: Get device details to verify all changes
        details_response = await client.get(
            f"/api/v1/devices/{device_id}",
            headers=auth_headers
        )
        
        assert details_response.status_code == 200
        details = details_response.json()
        assert details["name"] == "Updated Lifecycle Device"
        assert details["firmware_version"] == "2.0.0"
        assert details["status"] == "running"
        
        # Step 11: Delete device (should work since alert is resolved)
        delete_response = await client.delete(
            f"/api/v1/devices/{device_id}",
            headers=auth_headers
        )
        
        assert delete_response.status_code == 200
        delete_data = delete_response.json()
        assert delete_data["success"] is True
        
        # Step 12: Verify device is deleted
        get_response = await client.get(
            f"/api/v1/devices/{device_id}",
            headers=auth_headers
        )
        
        assert get_response.status_code == 404

    @pytest.mark.asyncio
    async def test_device_monitoring_workflow(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test device monitoring workflow with health tracking and alerts."""
        # Setup: Create container and device
        tenant = Tenant(name="Monitoring Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Monitoring Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Monitoring Device",
            model="MonitoringModel",
            serial_number="MON001",
            status="running",
            diagnostics_uptime=48.0
        )
        async_session.add(device)
        await async_session.flush()
        
        # Create health history entries to simulate monitoring
        base_time = datetime.utcnow()
        health_entries = [
            DeviceHealthHistory(
                device_id=device.id,
                timestamp=base_time - timedelta(hours=i),
                status="running" if i < 2 else "issue",
                uptime_hours=48.0 - i,
                error_count=i,
                performance_score=95.0 - i * 10,
                notes=f"Monitoring entry {i}" if i >= 2 else None
            )
            for i in range(5)
        ]
        
        async_session.add_all(health_entries)
        await async_session.commit()
        
        # Step 1: Get container devices overview
        overview_response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert overview_response.status_code == 200
        overview_data = overview_response.json()
        assert overview_data["device_status_overview"]["running"] == 1
        assert len(overview_data["devices"]) == 1
        
        # Step 2: Get device management summary
        summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        assert summary_data["device_count"] == 1
        assert summary_data["online_devices"] == 1
        
        # Step 3: Get device health history
        health_response = await client.get(
            f"/api/v1/devices/{device.id}/health-history",
            headers=auth_headers
        )
        
        assert health_response.status_code == 200
        health_data = health_response.json()
        assert len(health_data["health_history"]) == 5
        assert health_data["summary"]["average_uptime"] > 0
        
        # Step 4: Create multiple alerts for monitoring
        alert_types = [
            {"type": "temperature", "severity": "high", "description": "High temperature"},
            {"type": "performance", "severity": "medium", "description": "Performance degradation"},
            {"type": "connectivity", "severity": "low", "description": "Intermittent connection"}
        ]
        
        alert_ids = []
        for alert_config in alert_types:
            alert_data = {
                "alert_type": alert_config["type"],
                "severity": alert_config["severity"],
                "description": alert_config["description"]
            }
            
            alert_response = await client.post(
                f"/api/v1/devices/{device.id}/alerts",
                json=alert_data,
                headers=auth_headers
            )
            
            assert alert_response.status_code == 200
            alert_ids.append(alert_response.json()["id"])
        
        # Step 5: Get device alerts
        alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        assert alerts_response.status_code == 200
        alerts_data = alerts_response.json()
        assert len(alerts_data["alerts"]) == 3
        assert alerts_data["alert_summary"]["total_alerts"] == 3
        assert alerts_data["alert_summary"]["high"] == 1
        assert alerts_data["alert_summary"]["medium"] == 1
        assert alerts_data["alert_summary"]["low"] == 1
        
        # Step 6: Update device status based on alerts
        status_update = {
            "status": "issue",
            "reason": "Multiple alerts detected"
        }
        
        status_response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=status_update,
            headers=auth_headers
        )
        
        assert status_response.status_code == 200
        
        # Step 7: Acknowledge critical alert
        ack_data = {
            "acknowledged_by": "monitoring_system",
            "notes": "Alert acknowledged by monitoring system"
        }
        
        ack_response = await client.put(
            f"/api/v1/devices/alerts/{alert_ids[0]}/acknowledge",
            json=ack_data,
            headers=auth_headers
        )
        
        assert ack_response.status_code == 200
        
        # Step 8: Restart device to resolve issues
        restart_data = {
            "reason": "Resolving performance issues",
            "scheduled_time": (datetime.utcnow() + timedelta(minutes=1)).isoformat()
        }
        
        restart_response = await client.post(
            f"/api/v1/devices/{device.id}/restart",
            json=restart_data,
            headers=auth_headers
        )
        
        assert restart_response.status_code == 200
        restart_data_response = restart_response.json()
        assert restart_data_response["restart_initiated"] is True
        
        # Step 9: Verify device status after restart
        details_response = await client.get(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert details_response.status_code == 200
        details = details_response.json()
        assert details["status"] == "offline"  # Should be offline after restart
        
        # Step 10: Bring device back online
        recovery_status = {
            "status": "running",
            "reason": "Device restart completed successfully"
        }
        
        recovery_response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=recovery_status,
            headers=auth_headers
        )
        
        assert recovery_response.status_code == 200

    @pytest.mark.asyncio
    async def test_bulk_device_management_workflow(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test bulk device management operations."""
        # Setup: Create container and multiple devices
        tenant = Tenant(name="Bulk Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Bulk Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production"
        )
        async_session.add(container)
        await async_session.flush()
        
        # Create multiple devices
        devices = []
        for i in range(5):
            device = Device(
                container_id=container.id,
                name=f"Bulk Device {i+1}",
                model=f"BulkModel{i+1}",
                serial_number=f"BLK{i+1:03d}",
                status="offline"
            )
            devices.append(device)
        
        async_session.add_all(devices)
        await async_session.commit()
        
        device_ids = [device.id for device in devices]
        
        # Step 1: Get initial container overview
        overview_response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert overview_response.status_code == 200
        overview_data = overview_response.json()
        assert overview_data["device_status_overview"]["offline"] == 5
        assert len(overview_data["devices"]) == 5
        
        # Step 2: Bulk update all devices to running
        bulk_update = {
            "device_ids": device_ids,
            "status": "running",
            "reason": "Bulk startup after maintenance"
        }
        
        bulk_response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=bulk_update,
            headers=auth_headers
        )
        
        assert bulk_response.status_code == 200
        bulk_data = bulk_response.json()
        assert bulk_data["success"] is True
        assert len(bulk_data["updated_devices"]) == 5
        assert len(bulk_data["failed_updates"]) == 0
        
        # Step 3: Verify all devices are now running
        overview_response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert overview_response.status_code == 200
        overview_data = overview_response.json()
        assert overview_data["device_status_overview"]["running"] == 5
        assert overview_data["device_status_overview"]["offline"] == 0
        
        # Step 4: Simulate heartbeats for all devices
        for device_id in device_ids:
            heartbeat_response = await client.get(
                f"/api/v1/devices/{device_id}/heartbeat",
                headers=auth_headers
            )
            assert heartbeat_response.status_code == 200
        
        # Step 5: Create alerts for some devices
        alert_device_ids = device_ids[:3]  # First 3 devices
        
        for i, device_id in enumerate(alert_device_ids):
            alert_data = {
                "alert_type": "maintenance",
                "severity": "medium",
                "description": f"Scheduled maintenance required for device {i+1}"
            }
            
            alert_response = await client.post(
                f"/api/v1/devices/{device_id}/alerts",
                json=alert_data,
                headers=auth_headers
            )
            
            assert alert_response.status_code == 200
        
        # Step 6: Get container alerts summary
        alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        assert alerts_response.status_code == 200
        alerts_data = alerts_response.json()
        assert len(alerts_data["alerts"]) == 3
        assert alerts_data["alert_summary"]["medium"] == 3
        
        # Step 7: Bulk update affected devices to maintenance status
        maintenance_update = {
            "device_ids": alert_device_ids,
            "status": "issue",
            "reason": "Entering maintenance mode"
        }
        
        maintenance_response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=maintenance_update,
            headers=auth_headers
        )
        
        assert maintenance_response.status_code == 200
        
        # Step 8: Get updated management summary
        summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        assert summary_data["device_count"] == 5
        assert summary_data["devices_with_issues"] == 3
        assert summary_data["management_status"] in ["degraded", "critical"]
        
        # Step 9: Bulk update back to running after maintenance
        recovery_update = {
            "device_ids": alert_device_ids,
            "status": "running",
            "reason": "Maintenance completed successfully"
        }
        
        recovery_response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=recovery_update,
            headers=auth_headers
        )
        
        assert recovery_response.status_code == 200
        
        # Step 10: Final verification - all devices should be running
        final_overview = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert final_overview.status_code == 200
        final_data = final_overview.json()
        assert final_data["device_status_overview"]["running"] == 5
        assert final_data["device_status_overview"]["issue"] == 0

    @pytest.mark.asyncio
    async def test_device_failure_recovery_workflow(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test device failure detection and recovery workflow."""
        # Setup: Create container and device
        tenant = Tenant(name="Failure Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Failure Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production"
        )
        async_session.add(container)
        await async_session.flush()
        
        device = Device(
            container_id=container.id,
            name="Failure Device",
            model="FailureModel",
            serial_number="FAIL001",
            status="running",
            diagnostics_uptime=72.0,
            diagnostics_error_count=0
        )
        async_session.add(device)
        await async_session.commit()
        
        # Step 1: Device is initially healthy
        details_response = await client.get(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert details_response.status_code == 200
        initial_details = details_response.json()
        assert initial_details["status"] == "running"
        
        # Step 2: Simulate device failure with critical alert
        failure_alert = {
            "alert_type": "hardware_failure",
            "severity": "critical",
            "description": "Critical hardware failure detected",
            "related_object": {
                "component": "sensor_module",
                "error_code": "HW_FAIL_001",
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        alert_response = await client.post(
            f"/api/v1/devices/{device.id}/alerts",
            json=failure_alert,
            headers=auth_headers
        )
        
        assert alert_response.status_code == 200
        alert_info = alert_response.json()
        critical_alert_id = alert_info["id"]
        
        # Step 3: Update device status to reflect failure
        failure_status = {
            "status": "offline",
            "reason": "Hardware failure - device unresponsive"
        }
        
        status_response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=failure_status,
            headers=auth_headers
        )
        
        assert status_response.status_code == 200
        
        # Step 4: Check container health impact
        summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        assert summary_data["offline_devices"] == 1
        assert summary_data["management_status"] == "critical"
        
        # Step 5: Get critical alerts
        critical_alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts?severity=critical",
            headers=auth_headers
        )
        
        assert critical_alerts_response.status_code == 200
        critical_alerts = critical_alerts_response.json()
        assert len(critical_alerts["alerts"]) == 1
        assert critical_alerts["alert_summary"]["critical"] == 1
        
        # Step 6: Acknowledge critical alert
        ack_data = {
            "acknowledged_by": "maintenance_team",
            "notes": "Hardware replacement initiated"
        }
        
        ack_response = await client.put(
            f"/api/v1/devices/alerts/{critical_alert_id}/acknowledge",
            json=ack_data,
            headers=auth_headers
        )
        
        assert ack_response.status_code == 200
        
        # Step 7: Simulate hardware replacement (update device info)
        replacement_update = {
            "name": "Failure Device (Replaced)",
            "firmware_version": "2.1.0",
            "model": "FailureModel-V2"
        }
        
        update_response = await client.put(
            f"/api/v1/devices/{device.id}",
            json=replacement_update,
            headers=auth_headers
        )
        
        assert update_response.status_code == 200
        
        # Step 8: Bring device back online
        recovery_status = {
            "status": "running",
            "reason": "Hardware replaced, device operational"
        }
        
        recovery_response = await client.put(
            f"/api/v1/devices/{device.id}/status",
            json=recovery_status,
            headers=auth_headers
        )
        
        assert recovery_response.status_code == 200
        
        # Step 9: Resolve the critical alert
        resolve_data = {
            "resolved_by": "maintenance_team",
            "resolution_notes": "Hardware component replaced successfully. Device tested and operational."
        }
        
        resolve_response = await client.put(
            f"/api/v1/devices/alerts/{critical_alert_id}/resolve",
            json=resolve_data,
            headers=auth_headers
        )
        
        assert resolve_response.status_code == 200
        
        # Step 10: Verify recovery is complete
        final_details_response = await client.get(
            f"/api/v1/devices/{device.id}",
            headers=auth_headers
        )
        
        assert final_details_response.status_code == 200
        final_details = final_details_response.json()
        assert final_details["status"] == "running"
        assert final_details["name"] == "Failure Device (Replaced)"
        assert final_details["firmware_version"] == "2.1.0"
        
        # Step 11: Verify container health is restored
        final_summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert final_summary_response.status_code == 200
        final_summary = final_summary_response.json()
        assert final_summary["online_devices"] == 1
        assert final_summary["offline_devices"] == 0
        assert final_summary["management_status"] == "healthy"
        
        # Step 12: Verify alerts are resolved
        final_alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        assert final_alerts_response.status_code == 200
        final_alerts = final_alerts_response.json()
        assert len(final_alerts["alerts"]) == 0  # No active alerts
        assert final_alerts["alert_summary"]["total_alerts"] == 0

    @pytest.mark.asyncio
    async def test_cross_component_integration(
        self,
        client: AsyncClient,
        async_session: AsyncSession,
        auth_headers
    ):
        """Test integration between devices and other system components."""
        # This test demonstrates how device management integrates with
        # containers, alerts, and monitoring systems
        
        # Setup: Create tenant and container
        tenant = Tenant(name="Integration Tenant")
        async_session.add(tenant)
        await async_session.flush()
        
        container = Container(
            name="Integration Container",
            tenant_id=tenant.id,
            type="physical",
            purpose="production"
        )
        async_session.add(container)
        await async_session.commit()
        
        # Step 1: Register multiple devices for the container
        device_configs = [
            {"name": "Temperature Sensor", "model": "TempSens-100", "serial": "TS001"},
            {"name": "Humidity Sensor", "model": "HumSens-200", "serial": "HS001"},
            {"name": "Light Controller", "model": "LightCtrl-300", "serial": "LC001"},
            {"name": "Water Pump", "model": "WaterPump-400", "serial": "WP001"},
        ]
        
        device_ids = []
        for config in device_configs:
            device_data = {
                "container_id": container.id,
                "name": config["name"],
                "model": config["model"],
                "serial_number": config["serial"],
                "firmware_version": "1.0.0"
            }
            
            register_response = await client.post(
                "/api/v1/devices/register",
                json=device_data,
                headers=auth_headers
            )
            
            assert register_response.status_code == 200
            device_ids.append(register_response.json()["id"])
        
        # Step 2: Bring all devices online
        online_update = {
            "device_ids": device_ids,
            "status": "running",
            "reason": "Container startup sequence"
        }
        
        bulk_response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=online_update,
            headers=auth_headers
        )
        
        assert bulk_response.status_code == 200
        
        # Step 3: Get container overview (shows device integration)
        overview_response = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert overview_response.status_code == 200
        overview_data = overview_response.json()
        assert overview_data["device_status_overview"]["running"] == 4
        assert len(overview_data["devices"]) == 4
        
        # Step 4: Create system-wide alert affecting multiple devices
        for i, device_id in enumerate(device_ids[:2]):  # First 2 devices
            alert_data = {
                "alert_type": "environmental",
                "severity": "high",
                "description": f"Environmental conditions outside normal range",
                "related_object": {
                    "environmental_factor": "temperature" if i == 0 else "humidity",
                    "current_value": 85.0 if i == 0 else 95.0,
                    "threshold": 80.0 if i == 0 else 90.0
                }
            }
            
            alert_response = await client.post(
                f"/api/v1/devices/{device_id}/alerts",
                json=alert_data,
                headers=auth_headers
            )
            
            assert alert_response.status_code == 200
        
        # Step 5: Check system-wide impact
        alerts_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/alerts",
            headers=auth_headers
        )
        
        assert alerts_response.status_code == 200
        alerts_data = alerts_response.json()
        assert len(alerts_data["alerts"]) == 2
        assert alerts_data["alert_summary"]["high"] == 2
        
        # Step 6: Get management summary showing system health
        summary_response = await client.get(
            f"/api/v1/containers/{container.id}/devices/summary",
            headers=auth_headers
        )
        
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        assert summary_data["device_count"] == 4
        assert summary_data["online_devices"] == 4
        assert summary_data["management_status"] in ["degraded", "critical"]
        
        # Step 7: Coordinated response - adjust affected devices
        affected_devices = device_ids[:2]
        adjustment_update = {
            "device_ids": affected_devices,
            "status": "idle",
            "reason": "Environmental adjustment in progress"
        }
        
        adjustment_response = await client.put(
            "/api/v1/devices/bulk-status-update",
            json=adjustment_update,
            headers=auth_headers
        )
        
        assert adjustment_response.status_code == 200
        
        # Step 8: Verify coordinated system response
        final_overview = await client.get(
            f"/api/v1/containers/{container.id}/devices",
            headers=auth_headers
        )
        
        assert final_overview.status_code == 200
        final_data = final_overview.json()
        assert final_data["device_status_overview"]["running"] == 2
        assert final_data["device_status_overview"]["idle"] == 2
        
        # This demonstrates how device management integrates with:
        # - Container management (devices belong to containers)
        # - Alert management (devices generate and manage alerts)
        # - Monitoring systems (health tracking and status management)
        # - Bulk operations (coordinated device management)