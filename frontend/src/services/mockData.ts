import { 
  ContainerDetail, 
  ContainerCropsList, 
  ContainerActivityList 
} from '../shared/types/containers';
import { ContainerMetrics } from '../shared/types/metrics';

// Mock data for the container details page
export const mockContainerDetail: ContainerDetail = {
  id: "container-04",
  name: "farm-container-04",
  type: "PHYSICAL",
  tenant: "tenant-123",
  purpose: "Development",
  location: {
    city: "Lviv",
    country: "Ukraine",
    address: "123 Innovation Park"
  },
  status: "ACTIVE",
  created: "2025-01-30T09:30:00Z",
  modified: "2025-01-30T11:14:00Z",
  creator: "Mia Adams",
  seed_types: ["Someroots", "sunflower", "Someroots", "Someroots"],
  notes: "Primary production container for Farm A.",
  shadow_service_enabled: false,
  ecosystem_connected: true,
  system_integrations: {
    fa_integration: {
      name: "Alpha",
      enabled: true
    },
    aws_environment: {
      name: "Dev",
      enabled: true
    },
    mbai_environment: {
      name: "Disabled",
      enabled: false
    }
  }
};

export const mockContainerMetrics: ContainerMetrics = {
  temperature: {
    current: 20,
    unit: "°C",
    target: 21
  },
  humidity: {
    current: 65,
    unit: "%",
    target: 68
  },
  co2: {
    current: 860,
    unit: "ppm",
    target: 800
  },
  yield: {
    current: 51,
    unit: "KG",
    trend: 1.5
  },
  nursery_utilization: {
    current: 75,
    unit: "%",
    trend: 5
  },
  cultivation_utilization: {
    current: 90,
    unit: "%",
    trend: 15
  }
};

export const mockContainerCrops: ContainerCropsList = {
  total: 4,
  results: [
    {
      id: "crop-001",
      seed_type: "Salanova Cousteau",
      cultivation_area: 40,
      nursery_table: 30,
      last_sd: "2025-01-30",
      last_td: "2025-01-30",
      last_hd: null,
      avg_age: 26,
      overdue: 2
    },
    {
      id: "crop-002",
      seed_type: "Kiribati",
      cultivation_area: 50,
      nursery_table: 20,
      last_sd: "2025-01-30",
      last_td: "2025-01-30",
      last_hd: null,
      avg_age: 30,
      overdue: 0
    },
    {
      id: "crop-003",
      seed_type: "Rex Butterhead",
      cultivation_area: 65,
      nursery_table: 10,
      last_sd: "2025-01-10",
      last_td: "2025-01-20",
      last_hd: "2025-01-01",
      avg_age: 22,
      overdue: 0
    },
    {
      id: "crop-004",
      seed_type: "Lollo Rossa",
      cultivation_area: 35,
      nursery_table: 25,
      last_sd: "2025-01-15",
      last_td: "2025-01-20",
      last_hd: "2025-01-02",
      avg_age: 18,
      overdue: 1
    }
  ]
};

export const mockContainerActivities: ContainerActivityList = {
  activities: [
    {
      id: "activity-001",
      type: "SEEDED",
      timestamp: "2025-04-13T12:30:00Z",
      description: "Seeded Salanova Cousteau in Nursery",
      user: {
        name: "Emily Chen",
        role: "Operator"
      },
      details: {
        seed_type: "Salanova Cousteau",
        location: "Nursery"
      }
    },
    {
      id: "activity-002",
      type: "SYNCED",
      timestamp: "2025-04-13T09:45:00Z",
      description: "Data synced",
      user: {
        name: "System",
        role: "Automated"
      },
      details: {}
    },
    {
      id: "activity-003",
      type: "ENVIRONMENT_CHANGED",
      timestamp: "2025-04-10T10:00:00Z",
      description: "Environment mode switched to Auto",
      user: {
        name: "Marius Johnson",
        role: "Administrator"
      },
      details: {
        previous_mode: "Manual",
        new_mode: "Auto"
      }
    },
    {
      id: "activity-004",
      type: "CREATED",
      timestamp: "2025-04-10T09:00:00Z",
      description: "Container created",
      user: {
        name: "System",
        role: "Automated"
      },
      details: {}
    },
    {
      id: "activity-005",
      type: "MAINTENANCE",
      timestamp: "2025-04-09T10:00:00Z",
      description: "Container maintenance performed",
      user: {
        name: "Maintenance Team",
        role: "Technical"
      },
      details: {
        maintenance_type: "Scheduled",
        notes: "Regular system check"
      }
    }
  ]
};