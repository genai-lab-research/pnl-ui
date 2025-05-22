from typing import Any, Optional, Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.database.database import get_db
from app.models.enums import MetricTimeRange, ContainerType

# Mock data to simulate DB responses
from app.schemas.metrics import MetricResponse

router = APIRouter()


@router.get("/")
def get_performance_overview(
    *,
    db: Session = Depends(get_db),
    time_range: MetricTimeRange = MetricTimeRange.WEEK
) -> Any:
    """
    Get performance overview data for both physical and virtual containers.
    This endpoint aggregates metrics data across all containers by type.
    
    - **time_range**: Optional time range (WEEK, MONTH, QUARTER, YEAR)
    """
    # For demo purposes, return hardcoded data matching the reference UI
    # In a real implementation, you'd query the database and aggregate data
    
    # Weekly data - for week time range
    weekly_data = generate_weekly_data()
    
    # Initialize with weekly data as default
    data = weekly_data
    
    # Depending on the time range, adjust the data
    if time_range == MetricTimeRange.MONTH:
        data = generate_monthly_data()
    elif time_range == MetricTimeRange.QUARTER:
        data = generate_quarterly_data()
    elif time_range == MetricTimeRange.YEAR:
        data = generate_yearly_data()
    
    return data


def generate_weekly_data():
    """Generate weekly performance data with daily points"""
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Generate yield data for physical containers (slightly higher than virtual)
    physical_yield_data = [random.randint(18, 28) for _ in range(7)]
    physical_yield_avg = round(sum(physical_yield_data) / len(physical_yield_data), 1)
    physical_yield_total = sum(physical_yield_data)
    
    # Generate space utilization data for physical containers (higher than virtual)
    physical_utilization_data = [random.randint(68, 85) for _ in range(7)]
    physical_utilization_avg = round(sum(physical_utilization_data) / len(physical_utilization_data), 1)
    
    # Generate yield data for virtual containers (slightly lower than physical)
    virtual_yield_data = [random.randint(15, 24) for _ in range(7)]
    virtual_yield_avg = round(sum(virtual_yield_data) / len(virtual_yield_data), 1)
    virtual_yield_total = sum(virtual_yield_data)
    
    # Generate space utilization data for virtual containers (lower than physical)
    virtual_utilization_data = [random.randint(55, 70) for _ in range(7)]
    virtual_utilization_avg = round(sum(virtual_utilization_data) / len(virtual_utilization_data), 1)
    
    return {
        "physical": {
            "count": 4,
            "yield": {
                "labels": days,
                "data": physical_yield_data,
                "avgYield": physical_yield_avg,
                "totalYield": physical_yield_total
            },
            "spaceUtilization": {
                "labels": days,
                "data": physical_utilization_data,
                "avgUtilization": physical_utilization_avg
            }
        },
        "virtual": {
            "count": 5,
            "yield": {
                "labels": days,
                "data": virtual_yield_data,
                "avgYield": virtual_yield_avg,
                "totalYield": virtual_yield_total
            },
            "spaceUtilization": {
                "labels": days,
                "data": virtual_utilization_data,
                "avgUtilization": virtual_utilization_avg
            }
        }
    }


def generate_monthly_data():
    """Generate monthly performance data with daily points for 30 days"""
    # Generate day labels for a month (1-30)
    day_labels = [f"Day {i+1}" for i in range(30)]
    
    # Generate yield data for physical containers (slightly higher than virtual)
    physical_yield_data = [random.randint(18, 28) for _ in range(30)]
    physical_yield_avg = round(sum(physical_yield_data) / len(physical_yield_data), 1)
    physical_yield_total = sum(physical_yield_data)
    
    # Generate space utilization data for physical containers (higher than virtual)
    physical_utilization_data = [random.randint(68, 85) for _ in range(30)]
    physical_utilization_avg = round(sum(physical_utilization_data) / len(physical_utilization_data), 1)
    
    # Generate yield data for virtual containers (slightly lower than physical)
    virtual_yield_data = [random.randint(15, 24) for _ in range(30)]
    virtual_yield_avg = round(sum(virtual_yield_data) / len(virtual_yield_data), 1)
    virtual_yield_total = sum(virtual_yield_data)
    
    # Generate space utilization data for virtual containers (lower than physical)
    virtual_utilization_data = [random.randint(55, 70) for _ in range(30)]
    virtual_utilization_avg = round(sum(virtual_utilization_data) / len(virtual_utilization_data), 1)
    
    return {
        "physical": {
            "count": 4,
            "yield": {
                "labels": day_labels,
                "data": physical_yield_data,
                "avgYield": physical_yield_avg,
                "totalYield": physical_yield_total
            },
            "spaceUtilization": {
                "labels": day_labels,
                "data": physical_utilization_data,
                "avgUtilization": physical_utilization_avg
            }
        },
        "virtual": {
            "count": 5,
            "yield": {
                "labels": day_labels,
                "data": virtual_yield_data,
                "avgYield": virtual_yield_avg,
                "totalYield": virtual_yield_total
            },
            "spaceUtilization": {
                "labels": day_labels,
                "data": virtual_utilization_data,
                "avgUtilization": virtual_utilization_avg
            }
        }
    }


def generate_quarterly_data():
    """Generate quarterly performance data with weekly points for 13 weeks"""
    # Generate week labels for a quarter (13 weeks)
    week_labels = [f"Week {i+1}" for i in range(13)]
    
    # Generate yield data with an increasing trend for physical containers
    physical_yield_data = []
    for i in range(13):
        # Gradually increase the yield over the quarter with some variation
        base = 20 + (i * 0.8)  # Base yield increases each week
        physical_yield_data.append(random.randint(int(base - 3), int(base + 3)))
    
    physical_yield_avg = round(sum(physical_yield_data) / len(physical_yield_data), 1)
    physical_yield_total = sum(physical_yield_data)
    
    # Generate space utilization data for physical containers (higher than virtual)
    physical_utilization_data = []
    for i in range(13):
        # Gradually increase utilization over the quarter with some variation
        base = 70 + (i * 0.4)  # Base utilization increases each week
        physical_utilization_data.append(random.randint(int(base - 5), int(base + 5)))
        
    physical_utilization_avg = round(sum(physical_utilization_data) / len(physical_utilization_data), 1)
    
    # Generate yield data for virtual containers (slightly lower than physical)
    virtual_yield_data = []
    for i in range(13):
        # Similar pattern to physical but slightly lower
        base = 17 + (i * 0.7)
        virtual_yield_data.append(random.randint(int(base - 3), int(base + 3)))
        
    virtual_yield_avg = round(sum(virtual_yield_data) / len(virtual_yield_data), 1)
    virtual_yield_total = sum(virtual_yield_data)
    
    # Generate space utilization data for virtual containers
    virtual_utilization_data = []
    for i in range(13):
        base = 60 + (i * 0.4)
        virtual_utilization_data.append(random.randint(int(base - 5), int(base + 5)))
        
    virtual_utilization_avg = round(sum(virtual_utilization_data) / len(virtual_utilization_data), 1)
    
    return {
        "physical": {
            "count": 4,
            "yield": {
                "labels": week_labels,
                "data": physical_yield_data,
                "avgYield": physical_yield_avg,
                "totalYield": physical_yield_total
            },
            "spaceUtilization": {
                "labels": week_labels,
                "data": physical_utilization_data,
                "avgUtilization": physical_utilization_avg
            }
        },
        "virtual": {
            "count": 5,
            "yield": {
                "labels": week_labels,
                "data": virtual_yield_data,
                "avgYield": virtual_yield_avg,
                "totalYield": virtual_yield_total
            },
            "spaceUtilization": {
                "labels": week_labels,
                "data": virtual_utilization_data,
                "avgUtilization": virtual_utilization_avg
            }
        }
    }


def generate_yearly_data():
    """Generate yearly performance data with monthly points for 12 months"""
    # Month labels for a year
    month_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # Generate yield data with seasonal patterns for physical containers
    physical_yield_data = []
    for i in range(12):
        # Create seasonal pattern: higher in summer months (May-Aug), lower in winter
        if 4 <= i <= 7:  # May-Aug (0-indexed)
            base = 25  # Higher base yield in summer
        elif i <= 1 or i >= 10:  # Dec-Feb (winter)
            base = 18  # Lower yield in winter
        else:
            base = 22  # Medium yield in spring/fall
            
        physical_yield_data.append(random.randint(int(base - 3), int(base + 3)))
        
    physical_yield_avg = round(sum(physical_yield_data) / len(physical_yield_data), 1)
    physical_yield_total = sum(physical_yield_data)
    
    # Generate space utilization data with seasonal patterns for physical containers
    physical_utilization_data = []
    for i in range(12):
        # Higher utilization in winter months when indoor growing is more important
        if i <= 1 or i >= 10:  # Dec-Feb (winter)
            base = 85  # Higher utilization in winter
        elif 4 <= i <= 7:  # May-Aug (summer)
            base = 75  # Lower utilization in summer
        else:
            base = 80  # Medium utilization in spring/fall
            
        physical_utilization_data.append(random.randint(int(base - 5), int(base + 5)))
        
    physical_utilization_avg = round(sum(physical_utilization_data) / len(physical_utilization_data), 1)
    
    # Generate yield data for virtual containers (similar pattern but lower values)
    virtual_yield_data = []
    for i in range(12):
        # Similar seasonal pattern to physical but slightly lower values
        if 4 <= i <= 7:  # May-Aug (summer)
            base = 22
        elif i <= 1 or i >= 10:  # Dec-Feb (winter)
            base = 16
        else:
            base = 19
            
        virtual_yield_data.append(random.randint(int(base - 2), int(base + 2)))
        
    virtual_yield_avg = round(sum(virtual_yield_data) / len(virtual_yield_data), 1)
    virtual_yield_total = sum(virtual_yield_data)
    
    # Generate space utilization data for virtual containers
    virtual_utilization_data = []
    for i in range(12):
        # Similar seasonal pattern to physical but lower values
        if i <= 1 or i >= 10:  # Dec-Feb (winter)
            base = 70
        elif 4 <= i <= 7:  # May-Aug (summer)
            base = 60
        else:
            base = 65
            
        virtual_utilization_data.append(random.randint(int(base - 4), int(base + 4)))
        
    virtual_utilization_avg = round(sum(virtual_utilization_data) / len(virtual_utilization_data), 1)
    
    return {
        "physical": {
            "count": 4,
            "yield": {
                "labels": month_labels,
                "data": physical_yield_data,
                "avgYield": physical_yield_avg,
                "totalYield": physical_yield_total
            },
            "spaceUtilization": {
                "labels": month_labels,
                "data": physical_utilization_data,
                "avgUtilization": physical_utilization_avg
            }
        },
        "virtual": {
            "count": 5,
            "yield": {
                "labels": month_labels,
                "data": virtual_yield_data,
                "avgYield": virtual_yield_avg,
                "totalYield": virtual_yield_total
            },
            "spaceUtilization": {
                "labels": month_labels,
                "data": virtual_utilization_data,
                "avgUtilization": virtual_utilization_avg
            }
        }
    }