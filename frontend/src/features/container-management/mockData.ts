import {
  ContainerPurpose,
  ContainerStatus,
  ContainerSummary,
  ContainerType,
} from '../../services/containerService';
import {
  RowData,
  ContainerPurpose as UIContainerPurpose,
  ContainerStatus as UIContainerStatus,
  ContainerType as UIContainerType,
} from '../../shared/types/containers';

// Mock data for chart display in the performance cards
export const mockChartData = {
  physical: {
    count: 12,
    averageYield: 24.5,
    totalYield: 294,
    averageUtilization: 78,
    yield: [
      { day: 'Mon', value: 25 },
      { day: 'Tue', value: 26 },
      { day: 'Wed', value: 28 },
      { day: 'Thu', value: 22 },
      { day: 'Fri', value: 24 },
      { day: 'Sat', value: 21 },
      { day: 'Sun', value: 23 },
    ],
    utilization: [
      { day: 'Mon', value: 80 },
      { day: 'Tue', value: 82 },
      { day: 'Wed', value: 85 },
      { day: 'Thu', value: 75 },
      { day: 'Fri', value: 78 },
      { day: 'Sat', value: 70 },
      { day: 'Sun', value: 76 },
    ],
  },
  virtual: {
    count: 8,
    averageYield: 22.1,
    totalYield: 176.8,
    averageUtilization: 65,
    yield: [
      { day: 'Mon', value: 22 },
      { day: 'Tue', value: 20 },
      { day: 'Wed', value: 24 },
      { day: 'Thu', value: 21 },
      { day: 'Fri', value: 23 },
      { day: 'Sat', value: 22 },
      { day: 'Sun', value: 23 },
    ],
    utilization: [
      { day: 'Mon', value: 65 },
      { day: 'Tue', value: 60 },
      { day: 'Wed', value: 68 },
      { day: 'Thu', value: 64 },
      { day: 'Fri', value: 67 },
      { day: 'Sat', value: 65 },
      { day: 'Sun', value: 66 },
    ],
  },
};

// Mock data for container list that matches the ContainerSummary type
export const mockContainerList: ContainerSummary[] = [
  {
    id: '1',
    type: 'VIRTUAL',
    name: 'virtual-farm-04',
    tenant_name: 'tenant-123',
    purpose: 'Development' as ContainerPurpose,
    location_city: 'Agriville',
    location_country: 'USA',
    status: 'ACTIVE' as ContainerStatus,
    created_at: '2025-01-30',
    updated_at: '2025-01-30',
    has_alerts: true,
  },
  {
    id: '2',
    type: 'VIRTUAL',
    name: 'virtual-farm-03',
    tenant_name: 'tenant-222',
    purpose: 'Research' as ContainerPurpose,
    location_city: 'Farmington',
    location_country: 'USA',
    status: 'MAINTENANCE' as ContainerStatus,
    created_at: '2025-01-30',
    updated_at: '2025-01-30',
    has_alerts: true,
  },
  {
    id: '3',
    type: 'PHYSICAL',
    name: 'farm-container-04',
    tenant_name: 'tenant-222',
    purpose: 'Research' as ContainerPurpose,
    location_city: 'Techville',
    location_country: 'Canada',
    status: 'CREATED' as ContainerStatus,
    created_at: '2025-01-25',
    updated_at: '2025-01-26',
    has_alerts: true,
  },
  {
    id: '4',
    type: 'PHYSICAL',
    name: 'farm-container-07',
    tenant_name: 'tenant-123',
    purpose: 'Development' as ContainerPurpose,
    location_city: 'Agriville',
    location_country: 'USA',
    status: 'ACTIVE' as ContainerStatus,
    created_at: '2025-01-25',
    updated_at: '2025-01-26',
    has_alerts: true,
  },
  {
    id: '5',
    type: 'VIRTUAL',
    name: 'virtual-farm-02',
    tenant_name: 'tenant-123',
    purpose: 'Development' as ContainerPurpose,
    location_city: 'Croptown',
    location_country: 'USA',
    status: 'INACTIVE' as ContainerStatus,
    created_at: '2025-01-13',
    updated_at: '2025-01-15',
    has_alerts: true,
  },
  {
    id: '6',
    type: 'PHYSICAL',
    name: 'farm-container-06',
    tenant_name: 'tenant-5',
    purpose: 'Research' as ContainerPurpose,
    location_city: 'Scienceville',
    location_country: 'Germany',
    status: 'ACTIVE' as ContainerStatus,
    created_at: '2025-01-12',
    updated_at: '2025-01-18',
    has_alerts: true,
  },
];

// Additional mock data for the data table display
export const formattedContainerList: RowData[] = mockContainerList.map((container) => ({
  id: container.id,
  type: container.type as any, // Cast as any first to avoid type errors
  name: container.name,
  tenant: container.tenant_name,
  purpose: container.purpose as unknown as UIContainerPurpose,
  location:
    container.location_city && container.location_country
      ? `${container.location_city}, ${container.location_country}`
      : 'N/A',
  status:
    container.status === 'ACTIVE'
      ? UIContainerStatus.ACTIVE
      : container.status === 'MAINTENANCE'
      ? UIContainerStatus.MAINTENANCE
      : container.status === 'INACTIVE'
      ? UIContainerStatus.INACTIVE
      : UIContainerStatus.CREATED,
  created: new Date(container.created_at).toLocaleDateString(),
  modified: new Date(container.updated_at).toLocaleDateString(),
  alerts: container.has_alerts ? 1 : 0,
}));
