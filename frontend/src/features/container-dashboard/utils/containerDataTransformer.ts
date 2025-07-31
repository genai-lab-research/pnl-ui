import { ContainerDomainModel } from '../models';
import { TableRow, StatusVariant } from '../../../shared/components/ui/VerticalFarmingTable/types';

/**
 * Maps ContainerDomainModel status to VerticalFarmingTable StatusVariant
 */
const mapStatusToVariant = (status: ContainerDomainModel['status']): StatusVariant => {
  switch (status) {
    case 'active':
      return 'Connected';
    case 'inactive':
      return 'Inactive';
    case 'maintenance':
      return 'Maintenance';
    case 'created':
      return 'Created';
    default:
      return 'Created';
  }
};

/**
 * Maps ContainerDomainModel type to TableRow type
 */
const mapTypeToTableRowType = (type: ContainerDomainModel['type']): TableRow['type'] => {
  switch (type) {
    case 'physical':
      return 'container';
    case 'virtual':
      return 'virtual';
    default:
      return 'container';
  }
};

/**
 * Maps ContainerDomainModel purpose to TableRow purpose
 */
const mapPurposeToTableRowPurpose = (purpose: ContainerDomainModel['purpose']): TableRow['purpose'] => {
  switch (purpose) {
    case 'development':
      return 'Development';
    case 'research':
      return 'Research';
    case 'production':
      // Map production to Research since TableRow only supports Development/Research
      return 'Research';
    default:
      return 'Development';
  }
};

/**
 * Formats a Date object to a string in DD/MM/YYYY format
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Transforms a ContainerDomainModel to a TableRow for the VerticalFarmingTable
 */
export const transformContainerToTableRow = (container: ContainerDomainModel): TableRow => {
  return {
    id: container.id.toString(),
    type: mapTypeToTableRowType(container.type),
    name: container.name,
    tenant: `tenant-${container.tenantId}`,
    purpose: mapPurposeToTableRowPurpose(container.purpose),
    location: container.getLocationDisplay(),
    status: mapStatusToVariant(container.status),
    created: formatDate(container.createdAt),
    modified: formatDate(container.updatedAt),
    hasAlert: container.hasActiveAlerts(),
  };
};

/**
 * Transforms an array of ContainerDomainModel to TableRow array
 */
export const transformContainersToTableRows = (containers: ContainerDomainModel[]): TableRow[] => {
  return containers.map(transformContainerToTableRow);
};