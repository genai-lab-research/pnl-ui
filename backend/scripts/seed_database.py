#!/usr/bin/env python3
"""
Database seeding script for Container Management System.
This script populates the database with sample data for development and testing.
"""

import asyncio
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add the parent directory to the path to import from app
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.core.db import AsyncSessionLocal
from app.models.seed_type import SeedType
from app.models.container import Container
from app.models.alert import Alert
from app.models.device import Device, DeviceHealthHistory
from app.models.crop import Crop
from app.models.crop_measurement import CropMeasurement
from app.models.crop_history import CropHistory
from app.models.snapshots import CropSnapshot, MetricSnapshot
from app.models.tray import Tray
from app.models.panel import Panel
from app.models.tenant import Tenant
from app.seed_data.seed_types import seed_type_seeds
from app.seed_data.containers import container_seeds, alert_seeds
from app.seed_data.devices import device_seeds, device_health_history_seeds, device_alert_seeds
from app.seed_data.crops import (
    crop_seeds, crop_measurement_seeds, crop_history_seeds, crop_snapshot_seeds
)
from app.seed_data.provisioning import tray_seeds, panel_seeds
from app.seed_data.tenants import tenant_seeds
from app.seed_data.metric_snapshots import metric_snapshot_seeds


async def seed_tenants(session: AsyncSession) -> Dict[int, int]:
    """Seed the tenants table and return mapping of index to ID"""
    print("Seeding tenants...")
    
    # Check if tenants already exist
    result = await session.execute(select(Tenant))
    existing_tenants = result.scalars().all()
    
    if existing_tenants:
        print(f"Found {len(existing_tenants)} existing tenants, skipping...")
        return {i: t.id for i, t in enumerate(existing_tenants)}
    
    id_mapping = {}
    for i, tenant_data in enumerate(tenant_seeds):
        tenant = Tenant(**tenant_data)
        session.add(tenant)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = tenant.id
        print(f"  Created tenant: {tenant.name} (ID: {tenant.id})")
    
    await session.commit()
    print(f"Seeded {len(tenant_seeds)} tenants successfully!")
    return id_mapping


async def seed_seed_types(session: AsyncSession) -> Dict[int, int]:
    """Seed the seed_types table and return mapping of index to ID"""
    print("Seeding seed types...")
    
    # Check if seed types already exist
    result = await session.execute(select(SeedType))
    existing_seed_types = result.scalars().all()
    
    if existing_seed_types:
        print(f"Found {len(existing_seed_types)} existing seed types, skipping...")
        return {i: st.id for i, st in enumerate(existing_seed_types)}
    
    id_mapping = {}
    for i, seed_data in enumerate(seed_type_seeds):
        seed_type = SeedType(**seed_data)
        session.add(seed_type)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = seed_type.id
        print(f"  Created seed type: {seed_type.name} (ID: {seed_type.id})")
    
    await session.commit()
    print(f"Seeded {len(seed_type_seeds)} seed types successfully!")
    return id_mapping


async def seed_containers(session: AsyncSession, seed_type_id_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed the containers and related tables"""
    print("Seeding containers...")
    
    # Check if containers already exist
    result = await session.execute(select(Container))
    existing_containers = result.scalars().all()
    
    if existing_containers:
        print(f"Found {len(existing_containers)} existing containers, skipping...")
        return {i: c.id for i, c in enumerate(existing_containers)}
    
    container_id_mapping = {}
    
    for i, container_data in enumerate(container_seeds):
        # Create container with flattened data
        container_data_copy = container_data.copy()
        
        # Flatten settings into main container data
        if "settings" in container_data_copy:
            settings = container_data_copy.pop("settings")
            for key, value in settings.items():
                container_data_copy[key] = value
        
        # Remove nested objects that are not direct container fields
        container_data_copy.pop("environment", None)
        container_data_copy.pop("inventory", None) 
        container_data_copy.pop("metrics", None)
        seed_type_indices = container_data_copy.pop("seed_type_ids", [])
        
        container = Container(**container_data_copy)
        session.add(container)
        await session.flush()  # Flush to get the ID
        
        # Add seed type relationships using direct SQL
        for seed_type_index in seed_type_indices:
            # Convert from 1-based to 0-based index
            seed_type_index = seed_type_index - 1
            if seed_type_index in seed_type_id_mapping:
                seed_type_id = seed_type_id_mapping[seed_type_index]
                # Insert directly into the association table
                await session.execute(
                    text("INSERT INTO container_seed_types (container_id, seed_type_id) VALUES (:container_id, :seed_type_id)"),
                    {"container_id": container.id, "seed_type_id": seed_type_id}
                )
        
        container_id_mapping[i] = container.id
        
        # Progress indicator for large datasets
        if i % 100 == 0 or i == len(container_seeds) - 1:
            print(f"  Created container: {container.name} (ID: {container.id}) - Progress: {i+1}/{len(container_seeds)}")
    
    # Final flush for any remaining containers
    await session.flush()
    await session.commit()
    print(f"Seeded {len(container_seeds)} containers successfully!")
    return container_id_mapping


async def seed_alerts(session: AsyncSession, container_id_mapping: Dict[int, int]):
    """Seed the alerts table"""
    print("Seeding alerts...")
    
    # Check if alerts already exist
    result = await session.execute(select(Alert))
    existing_alerts = result.scalars().all()
    
    if existing_alerts:
        print(f"Found {len(existing_alerts)} existing alerts, skipping...")
        return
    
    for alert_data in alert_seeds:
        # Map container_id from 1-based to actual container ID
        container_index = alert_data["container_id"] - 1
        if container_index in container_id_mapping:
            alert_data_copy = alert_data.copy()
            alert_data_copy["container_id"] = container_id_mapping[container_index]
            
            alert = Alert(**alert_data_copy)
            session.add(alert)
            print(f"  Created alert for container {container_id_mapping[container_index]}: {alert.description}")
    
    await session.commit()
    print(f"Seeded {len(alert_seeds)} alerts successfully!")


async def seed_crop_measurements(session: AsyncSession) -> Dict[int, int]:
    """Seed crop measurements and return mapping of index to ID"""
    print("Seeding crop measurements...")
    
    # Check if crop measurements already exist
    result = await session.execute(select(CropMeasurement))
    existing_measurements = result.scalars().all()
    
    if existing_measurements:
        print(f"Found {len(existing_measurements)} existing crop measurements, skipping...")
        return {i: cm.id for i, cm in enumerate(existing_measurements)}
    
    id_mapping = {}
    for i, measurement_data in enumerate(crop_measurement_seeds):
        measurement = CropMeasurement(**measurement_data)
        session.add(measurement)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = measurement.id
        print(f"  Created crop measurement {i+1} (ID: {measurement.id})")
    
    await session.commit()
    print(f"Seeded {len(crop_measurement_seeds)} crop measurements successfully!")
    return id_mapping


async def seed_crops(session: AsyncSession, seed_type_id_mapping: Dict[int, int], measurement_id_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed crops and return mapping of index to ID"""
    print("Seeding crops...")
    
    # Check if crops already exist
    result = await session.execute(select(Crop))
    existing_crops = result.scalars().all()
    
    if existing_crops:
        print(f"Found {len(existing_crops)} existing crops, skipping...")
        return {i: crop.id for i, crop in enumerate(existing_crops)}
    
    id_mapping = {}
    for i, crop_data in enumerate(crop_seeds):
        crop_data_copy = crop_data.copy()
        
        # Map seed_type_id
        seed_type_index = crop_data_copy.get("seed_type_id", 1) - 1
        if seed_type_index in seed_type_id_mapping:
            crop_data_copy["seed_type_id"] = seed_type_id_mapping[seed_type_index]
        
        # Map measurements_id (randomly assign)
        if measurement_id_mapping:
            measurement_index = i % len(measurement_id_mapping)
            crop_data_copy["measurements_id"] = measurement_id_mapping[measurement_index]
        
        crop = Crop(**crop_data_copy)
        session.add(crop)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = crop.id
        print(f"  Created crop {i+1} (ID: {crop.id})")
    
    await session.commit()
    print(f"Seeded {len(crop_seeds)} crops successfully!")
    return id_mapping


async def seed_crop_history(session: AsyncSession, crop_id_mapping: Dict[int, int]):
    """Seed crop history entries"""
    print("Seeding crop history...")
    
    # Check if crop history already exists
    result = await session.execute(select(CropHistory))
    existing_history = result.scalars().all()
    
    if existing_history:
        print(f"Found {len(existing_history)} existing crop history entries, skipping...")
        return
    
    for history_data in crop_history_seeds:
        history_data_copy = history_data.copy()
        
        # Ensure crop_id exists in our mapping
        crop_index = history_data_copy["crop_id"] - 1
        if crop_index in crop_id_mapping:
            history_data_copy["crop_id"] = crop_id_mapping[crop_index]
            
            history = CropHistory(**history_data_copy)
            session.add(history)
    
    await session.commit()
    print(f"Seeded {len(crop_history_seeds)} crop history entries successfully!")


async def seed_crop_snapshots(session: AsyncSession, crop_id_mapping: Dict[int, int], measurement_id_mapping: Dict[int, int]):
    """Seed crop snapshots for timelapse functionality"""
    print("Seeding crop snapshots...")
    
    # Check if crop snapshots already exist
    result = await session.execute(select(CropSnapshot))
    existing_snapshots = result.scalars().all()
    
    if existing_snapshots:
        print(f"Found {len(existing_snapshots)} existing crop snapshots, skipping...")
        return
    
    for snapshot_data in crop_snapshot_seeds:
        snapshot_data_copy = snapshot_data.copy()
        
        # Map crop_id
        crop_index = snapshot_data_copy["crop_id"] - 1
        if crop_index in crop_id_mapping:
            snapshot_data_copy["crop_id"] = crop_id_mapping[crop_index]
            
            # Map measurements_id
            measurement_index = snapshot_data_copy.get("measurements_id", 1) - 1
            if measurement_index in measurement_id_mapping:
                snapshot_data_copy["measurements_id"] = measurement_id_mapping[measurement_index]
            
            snapshot = CropSnapshot(**snapshot_data_copy)
            session.add(snapshot)
    
    await session.commit()
    print(f"Seeded {len(crop_snapshot_seeds)} crop snapshots successfully!")


async def seed_trays(session: AsyncSession, container_id_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed trays and return mapping of index to ID"""
    print("Seeding trays...")
    
    # Check if trays already exist
    result = await session.execute(select(Tray))
    existing_trays = result.scalars().all()
    
    if existing_trays:
        print(f"Found {len(existing_trays)} existing trays, skipping...")
        return {i: tray.id for i, tray in enumerate(existing_trays)}
    
    id_mapping = {}
    for i, tray_data in enumerate(tray_seeds):
        tray_data_copy = tray_data.copy()
        
        # Map container_id
        container_index = tray_data_copy.get("container_id", 1) - 1
        if container_index in container_id_mapping:
            tray_data_copy["container_id"] = container_id_mapping[container_index]
        
        tray = Tray(**tray_data_copy)
        session.add(tray)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = tray.id
        print(f"  Created tray {i+1} (ID: {tray.id})")
    
    await session.commit()
    print(f"Seeded {len(tray_seeds)} trays successfully!")
    return id_mapping


async def seed_panels(session: AsyncSession, container_id_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed panels and return mapping of index to ID"""
    print("Seeding panels...")
    
    # Check if panels already exist
    result = await session.execute(select(Panel))
    existing_panels = result.scalars().all()
    
    if existing_panels:
        print(f"Found {len(existing_panels)} existing panels, skipping...")
        return {i: panel.id for i, panel in enumerate(existing_panels)}
    
    id_mapping = {}
    for i, panel_data in enumerate(panel_seeds):
        panel_data_copy = panel_data.copy()
        
        # Map container_id
        container_index = panel_data_copy.get("container_id", 1) - 1
        if container_index in container_id_mapping:
            panel_data_copy["container_id"] = container_id_mapping[container_index]
        
        panel = Panel(**panel_data_copy)
        session.add(panel)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = panel.id
        print(f"  Created panel {i+1} (ID: {panel.id})")
    
    await session.commit()
    print(f"Seeded {len(panel_seeds)} panels successfully!")
    return id_mapping


async def seed_devices(session: AsyncSession, container_id_mapping: Dict[int, int]) -> Dict[int, int]:
    """Seed devices and return mapping of index to ID"""
    print("Seeding devices...")
    
    # Check if devices already exist
    result = await session.execute(select(Device))
    existing_devices = result.scalars().all()
    
    if existing_devices:
        print(f"Found {len(existing_devices)} existing devices, skipping...")
        return {i: device.id for i, device in enumerate(existing_devices)}
    
    id_mapping = {}
    for i, device_data in enumerate(device_seeds):
        device_data_copy = device_data.copy()
        
        # Map container_id
        container_index = device_data_copy.get("container_id", 1) - 1
        if container_index in container_id_mapping:
            device_data_copy["container_id"] = container_id_mapping[container_index]
        
        device = Device(**device_data_copy)
        session.add(device)
        await session.flush()  # Flush to get the ID
        id_mapping[i] = device.id
        print(f"  Created device {i+1}: {device.name} (ID: {device.id})")
    
    await session.commit()
    print(f"Seeded {len(device_seeds)} devices successfully!")
    return id_mapping


async def seed_device_health_history(session: AsyncSession, device_id_mapping: Dict[int, int]):
    """Seed device health history"""
    print("Seeding device health history...")
    
    # Check if device health history already exists
    result = await session.execute(select(DeviceHealthHistory))
    existing_history = result.scalars().all()
    
    if existing_history:
        print(f"Found {len(existing_history)} existing device health records, skipping...")
        return
    
    for history_data in device_health_history_seeds:
        history_data_copy = history_data.copy()
        
        # Map device_id
        device_index = history_data_copy.get("device_id", 1) - 1
        if device_index in device_id_mapping:
            history_data_copy["device_id"] = device_id_mapping[device_index]
            
            history = DeviceHealthHistory(**history_data_copy)
            session.add(history)
    
    await session.commit()
    print(f"Seeded {len(device_health_history_seeds)} device health history records successfully!")


async def seed_device_alerts(session: AsyncSession, container_id_mapping: Dict[int, int], device_id_mapping: Dict[int, int]):
    """Seed device-specific alerts"""
    print("Seeding device alerts...")
    
    for alert_data in device_alert_seeds:
        alert_data_copy = alert_data.copy()
        
        # Map container_id
        container_index = alert_data_copy.get("container_id", 1) - 1
        if container_index in container_id_mapping:
            alert_data_copy["container_id"] = container_id_mapping[container_index]
        
        # Map device_id if present and store in related_object
        if "device_id" in alert_data_copy:
            device_index = alert_data_copy.get("device_id", 1) - 1
            if device_index in device_id_mapping:
                if "related_object" not in alert_data_copy:
                    alert_data_copy["related_object"] = {}
                alert_data_copy["related_object"]["device_id"] = device_id_mapping[device_index]
            alert_data_copy.pop("device_id")  # Remove since Alert model doesn't have this field
        
        # Remove other fields not in Alert model - only keep valid fields
        valid_fields = {"container_id", "description", "severity", "active", "related_object"}
        alert_data_copy = {k: v for k, v in alert_data_copy.items() if k in valid_fields}
        
        alert = Alert(**alert_data_copy)
        session.add(alert)
        print(f"  Created device alert: {alert.description}")
    
    await session.commit()
    print(f"Seeded {len(device_alert_seeds)} device alerts successfully!")


async def seed_metric_snapshots(session: AsyncSession, container_id_mapping: Dict[int, int]):
    """Seed metric snapshots for container metrics over time"""
    print("Seeding metric snapshots...")
    
    # Check if metric snapshots already exist
    result = await session.execute(select(MetricSnapshot))
    existing_snapshots = result.scalars().all()
    
    if existing_snapshots:
        print(f"Found {len(existing_snapshots)} existing metric snapshots, skipping...")
        return
    
    for snapshot_data in metric_snapshot_seeds:
        snapshot_data_copy = snapshot_data.copy()
        
        # Map container_id from 1-based to actual container ID
        container_index = snapshot_data_copy["container_id"] - 1
        if container_index in container_id_mapping:
            snapshot_data_copy["container_id"] = container_id_mapping[container_index]
            
            snapshot = MetricSnapshot(**snapshot_data_copy)
            session.add(snapshot)
    
    await session.commit()
    print(f"Seeded {len(metric_snapshot_seeds)} metric snapshots successfully!")


async def seed_database():
    """Main function to seed the entire database"""
    print("Starting database seeding process...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Seed in dependency order
            tenant_id_mapping = await seed_tenants(session)
            seed_type_id_mapping = await seed_seed_types(session)
            container_id_mapping = await seed_containers(session, seed_type_id_mapping)
            await seed_alerts(session, container_id_mapping)
            
            # Seed device data
            device_id_mapping = await seed_devices(session, container_id_mapping)
            await seed_device_health_history(session, device_id_mapping)
            await seed_device_alerts(session, container_id_mapping, device_id_mapping)
            
            # Seed provisioning data
            tray_id_mapping = await seed_trays(session, container_id_mapping)
            panel_id_mapping = await seed_panels(session, container_id_mapping)
            
            # Seed crop-related data
            measurement_id_mapping = await seed_crop_measurements(session)
            crop_id_mapping = await seed_crops(session, seed_type_id_mapping, measurement_id_mapping)
            await seed_crop_history(session, crop_id_mapping)
            await seed_crop_snapshots(session, crop_id_mapping, measurement_id_mapping)
            
            # Seed metric snapshots
            await seed_metric_snapshots(session, container_id_mapping)
            
            print("\n✅ Database seeding completed successfully!")
            print(f"🎉 SEEDING COMPLETE! 🎉")
            print(f"📊 Total seeded: {len(seed_type_id_mapping)} seed types, {len(container_id_mapping)} containers, {len(crop_id_mapping)} crops")
            print(f"🔧 Devices: {len(device_id_mapping)} devices, {len(device_health_history_seeds)} health records, {len(device_alert_seeds)} device alerts")
            print(f"📦 Provisioning: {len(tray_id_mapping)} trays, {len(panel_id_mapping)} panels")
            print(f"🌱 Crop data: {len(crop_measurement_seeds)} measurements, {len(crop_history_seeds)} history entries, {len(crop_snapshot_seeds)} snapshots")
            print(f"📈 Metric snapshots: {len(metric_snapshot_seeds)} time-series data points")
            print(f"🚨 Alerts: {len(alert_seeds)} container alerts generated")
            
        except Exception as e:
            print(f"\n❌ Error during database seeding: {e}")
            await session.rollback()
            raise


async def clear_database():
    """Clear all data from the database"""
    print("Clearing database...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Delete in reverse dependency order
            await session.execute(text("DELETE FROM crop_snapshots"))
            await session.execute(text("DELETE FROM crop_history"))
            await session.execute(text("DELETE FROM crops"))
            await session.execute(text("DELETE FROM crop_measurements"))
            await session.execute(text("DELETE FROM metric_snapshots"))
            await session.execute(text("DELETE FROM device_health_history"))
            await session.execute(text("DELETE FROM alerts"))
            await session.execute(text("DELETE FROM devices"))
            await session.execute(text("DELETE FROM trays"))
            await session.execute(text("DELETE FROM panels"))
            await session.execute(text("DELETE FROM container_seed_types"))
            await session.execute(text("DELETE FROM containers"))
            await session.execute(text("DELETE FROM tenants"))
            await session.execute(text("DELETE FROM seed_types"))
            
            await session.commit()
            print("✅ Database cleared successfully!")
            
        except Exception as e:
            print(f"❌ Error during database clearing: {e}")
            await session.rollback()
            raise


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database seeding script")
    parser.add_argument("--clear", action="store_true", help="Clear the database before seeding")
    parser.add_argument("--clear-only", action="store_true", help="Only clear the database")
    
    args = parser.parse_args()
    
    async def main():
        if args.clear or args.clear_only:
            await clear_database()
        
        if not args.clear_only:
            await seed_database()
    
    asyncio.run(main())