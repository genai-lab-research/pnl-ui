"""Seed data for Device model using Faker"""
from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
from faker import Faker
import random

fake = Faker()

# Device types and their characteristics
DEVICE_TYPES = [
    {
        "name_template": "Temperature Sensor",
        "models": ["TempSense Pro 3000", "ClimateMax T-Series", "Precision Temp v2", "ThermalGuard 500"],
        "prefix": "TS",
        "ports": ["USB-A", "USB-B", "Serial-1", "Ethernet"],
        "firmware_range": ["v1.5.0", "v2.1.4", "v2.3.1", "v3.0.2"],
        "settings": {
            "sampling_rate": [15, 30, 60],
            "alert_threshold_high": [28.0, 30.0, 32.0],
            "alert_threshold_low": [15.0, 18.0, 20.0],
            "calibration_mode": ["auto", "manual"]
        }
    },
    {
        "name_template": "Humidity Sensor",
        "models": ["HumidityMax 2500", "AirSense Pro", "MoistureTracker v3", "HygroControl 400"],
        "prefix": "HS",
        "ports": ["USB-B", "USB-C", "Serial-2", "Wireless"],
        "firmware_range": ["v1.8.2", "v2.0.1", "v2.2.3", "v2.4.0"],
        "settings": {
            "sampling_rate": [30, 60, 120],
            "alert_threshold_high": [80.0, 85.0, 90.0],
            "alert_threshold_low": [40.0, 45.0, 50.0],
            "calibration_interval": [24, 48, 72]
        }
    },
    {
        "name_template": "CO2 Sensor",
        "models": ["CarbonWatch Pro", "AtmosGuard 1000", "CO2Master Elite", "AirQuality Sensor v4"],
        "prefix": "CS",
        "ports": ["Serial-1", "Serial-2", "Ethernet", "USB-A"],
        "firmware_range": ["v1.2.1", "v1.6.3", "v2.0.0", "v2.1.5"],
        "settings": {
            "sampling_rate": [60, 120, 300],
            "alert_threshold_high": [1000, 1200, 1500],
            "alert_threshold_low": [300, 350, 400],
            "auto_calibration": [True, False]
        }
    },
    {
        "name_template": "pH Sensor",
        "models": ["pHMaster 3000", "AcidityPro v2", "HydroBalance Elite", "ChemSense 500"],
        "prefix": "PS",
        "ports": ["Analog-1", "Analog-2", "USB-C", "Serial-3"],
        "firmware_range": ["v1.4.2", "v1.7.1", "v2.0.2", "v2.2.0"],
        "settings": {
            "sampling_rate": [300, 600, 900],
            "alert_threshold_high": [7.5, 8.0, 8.5],
            "alert_threshold_low": [5.5, 6.0, 6.5],
            "buffer_calibration": ["weekly", "biweekly", "monthly"]
        }
    },
    {
        "name_template": "Water Pump",
        "models": ["FlowMax 2000", "HydroPump Pro", "AquaStream Elite", "PumpMaster v3"],
        "prefix": "WP",
        "ports": ["PWM-1", "PWM-2", "Relay-1", "Relay-2"],
        "firmware_range": ["v1.1.0", "v1.3.2", "v1.5.1", "v2.0.0"],
        "settings": {
            "flow_rate": [2.5, 3.0, 3.5, 4.0],
            "schedule_interval": [300, 600, 900, 1200],
            "pressure_threshold": [15, 20, 25],
            "auto_prime": [True, False]
        }
    },
    {
        "name_template": "LED Light Array",
        "models": ["GrowLight Pro 600W", "SpectrumMax Elite", "PhotonBlast v4", "PlantIlluminator 800W"],
        "prefix": "LED",
        "ports": ["PWM-3", "PWM-4", "DMX-1", "Ethernet"],
        "firmware_range": ["v2.0.1", "v2.3.0", "v2.5.2", "v3.0.0"],
        "settings": {
            "intensity": [60, 75, 85, 100],
            "spectrum_mode": ["veg", "flower", "full", "custom"],
            "schedule_hours": [12, 14, 16, 18],
            "dimming_enabled": [True, False]
        }
    },
    {
        "name_template": "Air Circulation Fan",
        "models": ["AirFlow 500", "VentilationPro v2", "CircuMax Elite", "BreezeMaster 300"],
        "prefix": "FAN",
        "ports": ["PWM-5", "PWM-6", "Relay-3", "Relay-4"],
        "firmware_range": ["v1.0.5", "v1.2.1", "v1.4.3", "v1.6.0"],
        "settings": {
            "speed_percentage": [40, 60, 80, 100],
            "oscillation_enabled": [True, False],
            "timer_mode": ["continuous", "interval", "schedule"],
            "noise_reduction": [True, False]
        }
    }
]

def generate_devices(container_count: int = 12) -> List[Dict[str, Any]]:
    """Generate device data using Faker"""
    devices = []
    device_counter = 1
    
    for container_id in range(1, container_count + 1):
        # Each container gets 3-7 devices
        num_devices = random.randint(3, 7)
        
        # Ensure each container has at least one temp, humidity, and one other sensor
        required_devices = ["Temperature Sensor", "Humidity Sensor"]
        optional_devices = [dt["name_template"] for dt in DEVICE_TYPES if dt["name_template"] not in required_devices]
        
        selected_device_types = required_devices + random.sample(optional_devices, num_devices - 2)
        
        for i, device_type_name in enumerate(selected_device_types):
            device_type = next(dt for dt in DEVICE_TYPES if dt["name_template"] == device_type_name)
            
            device = {
                "container_id": container_id,
                "name": f"{device_type_name} {fake.random_element(['Alpha', 'Beta', 'Gamma'])}-{device_type['prefix']}{i+1:02d}",
                "model": fake.random_element(device_type["models"]),
                "serial_number": f"{device_type['prefix']}-{container_id:02d}-{device_counter:03d}",
                "firmware_version": fake.random_element(device_type["firmware_range"]),
                "port": fake.random_element(device_type["ports"]),
                "status": fake.random_element(elements=["running", "running", "running", "maintenance", "error"]),
                "last_active_at": fake.date_time_between(start_date="-1d", end_date="now", tzinfo=timezone.utc),
                
                # Configuration settings specific to device type
                "configuration_settings": {
                    key: fake.random_element(values) if isinstance(values, list) else values
                    for key, values in device_type["settings"].items()
                },
                
                # Standard configuration parameters
                "configuration_parameters": {
                    "accuracy": fake.pyfloat(min_value=0.1, max_value=2.0, right_digits=2),
                    "resolution": fake.pyfloat(min_value=0.01, max_value=0.5, right_digits=3),
                    "operating_range": [fake.random_int(-10, 0), fake.random_int(50, 100)]
                },
                
                # Diagnostics
                "diagnostics_uptime": fake.pyfloat(min_value=0.5, max_value=1000.0, right_digits=1),
                "diagnostics_error_count": fake.random_int(0, 5),
                "diagnostics_last_error": fake.sentence(nb_words=6) if fake.boolean(chance_of_getting_true=20) else None,
                "diagnostics_performance_metrics": {
                    "response_time_ms": fake.random_int(10, 200),
                    "accuracy_score": fake.pyfloat(min_value=95.0, max_value=100.0, right_digits=1),
                    "reliability_score": fake.pyfloat(min_value=90.0, max_value=100.0, right_digits=1)
                },
                
                # Connectivity
                "connectivity_connection_type": fake.random_element(["ethernet", "wifi", "zigbee", "modbus"]),
                "connectivity_signal_strength": fake.random_int(60, 100) if fake.boolean(chance_of_getting_true=70) else None,
                "connectivity_last_heartbeat": fake.date_time_between(start_date="-1h", end_date="now", tzinfo=timezone.utc)
            }
            
            devices.append(device)
            device_counter += 1
    
    return devices

def generate_device_health_history(device_count: int) -> List[Dict[str, Any]]:
    """Generate device health history data"""
    health_records = []
    
    # Generate 1-5 health records per device
    for device_id in range(1, device_count + 1):
        num_records = random.randint(1, 5)
        
        for _ in range(num_records):
            record = {
                "device_id": device_id,
                "timestamp": fake.date_time_between(start_date="-30d", end_date="now", tzinfo=timezone.utc),
                "status": fake.random_element(["healthy", "healthy", "healthy", "warning", "degraded"]),
                "uptime_hours": fake.pyfloat(min_value=1.0, max_value=720.0, right_digits=1),
                "error_count": fake.random_int(0, 10),
                "performance_score": fake.pyfloat(min_value=70.0, max_value=100.0, right_digits=1),
                "notes": fake.sentence(nb_words=8) if fake.boolean(chance_of_getting_true=30) else None
            }
            
            health_records.append(record)
    
    return health_records

def generate_device_alerts(device_count: int) -> List[Dict[str, Any]]:
    """Generate device-specific alerts"""
    device_alerts = []
    
    # Generate alerts for about 30% of devices
    devices_with_alerts = random.sample(range(1, device_count + 1), int(device_count * 0.3))
    
    alert_templates = {
        "critical": [
            "Device communication lost",
            "Sensor reading outside safe operating range",
            "Hardware failure detected",
            "Critical system error"
        ],
        "high": [
            "Sensor accuracy degraded",
            "High error rate detected",
            "Abnormal power consumption",
            "Firmware update required"
        ],
        "medium": [
            "Scheduled maintenance due",
            "Minor calibration drift detected",
            "Performance below optimal",
            "Network connectivity intermittent"
        ],
        "low": [
            "Routine diagnostic complete",
            "Software update available",
            "Optimal performance maintained",
            "Preventive maintenance recommended"
        ]
    }
    
    for device_id in devices_with_alerts:
        # Each device gets 1-2 alerts
        num_alerts = random.randint(1, 2)
        
        for _ in range(num_alerts):
            severity = fake.random_element(["critical", "high", "medium", "low"])
            description = fake.random_element(alert_templates[severity])
            
            alert = {
                "container_id": ((device_id - 1) // 5) + 1,  # Rough mapping to container
                "device_id": device_id,
                "description": f"Device #{device_id}: {description}",
                "severity": severity,
                "active": fake.boolean(chance_of_getting_true=70),
                "related_object": {
                    "device_id": device_id,
                    "error_code": f"ERR_{fake.random_int(100, 999)}",
                    "component": fake.random_element(["sensor", "controller", "power_supply", "communication_module"])
                }
            }
            
            device_alerts.append(alert)
    
    return device_alerts

# Calculate estimated device count (4-6 devices per container)
estimated_device_count = 500 * 5  # 500 containers * 5 average devices

# Generate the actual seed data - for 500 containers
device_seeds = generate_devices(500)
device_health_history_seeds = generate_device_health_history(len(device_seeds))
device_alert_seeds = generate_device_alerts(len(device_seeds))