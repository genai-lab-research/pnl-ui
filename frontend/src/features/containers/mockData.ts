// Mock data for containers matching the reference image exactly

import { ContainerStatus, ContainerType, RowData } from '../../shared/types/containers';

// Mock container data matching the reference UI
export const mockContainers = [
  {
    id: '1',
    name: 'virtual-farm-04',
    type: 'VIRTUAL',
    tenant_name: 'tenant-123',
    purpose: 'Development',
    location_city: 'Agriville',
    location_country: 'USA',
    status: 'ACTIVE',
    created_at: '2025-01-30',
    updated_at: '2025-01-30',
    has_alerts: true
  },
  {
    id: '2',
    name: 'virtual-farm-03',
    type: 'VIRTUAL',
    tenant_name: 'tenant-222',
    purpose: 'Research',
    location_city: 'Farmington',
    location_country: 'USA',
    status: 'MAINTENANCE',
    created_at: '2025-01-30',
    updated_at: '2025-01-30',
    has_alerts: true
  },
  {
    id: '3',
    name: 'farm-container-04',
    type: 'PHYSICAL',
    tenant_name: 'tenant-222',
    purpose: 'Research',
    location_city: 'Techville',
    location_country: 'Canada',
    status: 'CREATED',
    created_at: '2025-01-25',
    updated_at: '2025-01-26',
    has_alerts: true
  },
  {
    id: '4',
    name: 'farm-container-07',
    type: 'PHYSICAL',
    tenant_name: 'tenant-123',
    purpose: 'Development',
    location_city: 'Agriville',
    location_country: 'USA',
    status: 'ACTIVE',
    created_at: '2025-01-25',
    updated_at: '2025-01-26',
    has_alerts: true
  },
  {
    id: '5',
    name: 'virtual-farm-02',
    type: 'VIRTUAL',
    tenant_name: 'tenant-123',
    purpose: 'Development',
    location_city: 'Croptown',
    location_country: 'USA',
    status: 'INACTIVE',
    created_at: '2025-01-13',
    updated_at: '2025-01-15',
    has_alerts: true
  },
  {
    id: '6',
    name: 'farm-container-06',
    type: 'PHYSICAL',
    tenant_name: 'tenant-5',
    purpose: 'Research',
    location_city: 'Scienceville',
    location_country: 'Germany',
    status: 'ACTIVE',
    created_at: '2025-01-12',
    updated_at: '2025-01-18',
    has_alerts: true
  }
];

// Formatted data for the data table that matches the TableRow component expectations
export const formattedContainerList: RowData[] = [
  {
    id: '1',
    name: 'virtual-farm-04',
    type: ContainerType.VIRTUAL,
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: ContainerStatus.ACTIVE,
    created: '30/01/2025',
    modified: '30/01/2025',
    alerts: 1
  },
  {
    id: '2',
    name: 'virtual-farm-03',
    type: ContainerType.VIRTUAL,
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Farmington, USA',
    status: ContainerStatus.MAINTENANCE,
    created: '30/01/2025',
    modified: '30/01/2025',
    alerts: 1
  },
  {
    id: '3',
    name: 'farm-container-04',
    type: ContainerType.PHYSICAL,
    tenant: 'tenant-222',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: ContainerStatus.CREATED,
    created: '25/01/2025',
    modified: '26/01/2025',
    alerts: 1
  },
  {
    id: '4',
    name: 'farm-container-07',
    type: ContainerType.PHYSICAL,
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: ContainerStatus.ACTIVE,
    created: '25/01/2025',
    modified: '26/01/2025',
    alerts: 1
  },
  {
    id: '5',
    name: 'virtual-farm-02',
    type: ContainerType.VIRTUAL,
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Croptown, USA',
    status: ContainerStatus.INACTIVE,
    created: '13/01/2025',
    modified: '15/01/2025',
    alerts: 1
  },
  {
    id: '6',
    name: 'farm-container-06',
    type: ContainerType.PHYSICAL,
    tenant: 'tenant-5',
    purpose: 'Research',
    location: 'Scienceville, Germany',
    status: ContainerStatus.ACTIVE,
    created: '12/01/2025',
    modified: '18/01/2025',
    alerts: 1
  }
];

// Mock data structure for the API response
export const mockContainerList = mockContainers;

// Mock metrics data for performance cards
export const mockMetrics = {
  physical: {
    yield_data: [
      { date: 'Mon', value: 25 },
      { date: 'Tue', value: 20 },
      { date: 'Wed', value: 24 },
      { date: 'Thu', value: 18 },
      { date: 'Fri', value: 23 },
      { date: 'Sat', value: 19 },
      { date: 'Sun', value: 22 }
    ],
    space_utilization_data: [
      { date: 'Mon', value: 80 },
      { date: 'Tue', value: 75 },
      { date: 'Wed', value: 83 },
      { date: 'Thu', value: 76 },
      { date: 'Fri', value: 82 },
      { date: 'Sat', value: 70 },
      { date: 'Sun', value: 75 }
    ],
    average_yield: 63,
    total_yield: 81,
    average_space_utilization: 80
  },
  virtual: {
    yield_data: [
      { date: 'Mon', value: 22 },
      { date: 'Tue', value: 19 },
      { date: 'Wed', value: 23 },
      { date: 'Thu', value: 18 },
      { date: 'Fri', value: 21 },
      { date: 'Sat', value: 17 },
      { date: 'Sun', value: 20 }
    ],
    space_utilization_data: [
      { date: 'Mon', value: 65 },
      { date: 'Tue', value: 60 },
      { date: 'Wed', value: 68 },
      { date: 'Thu', value: 62 },
      { date: 'Fri', value: 66 },
      { date: 'Sat', value: 59 },
      { date: 'Sun', value: 64 }
    ],
    average_yield: 63,
    total_yield: 81,
    average_space_utilization: 80
  }
};