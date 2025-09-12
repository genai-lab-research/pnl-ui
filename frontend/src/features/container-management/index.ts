// Main feature exports
export * from './types';
export * from './services';
export * from './hooks';
export * from './viewmodels';

// Feature metadata
export const CONTAINER_MANAGEMENT_FEATURE = {
  name: 'ContainerManagement',
  displayName: 'Container Management Dashboard',
  description: 'Centralized dashboard for monitoring and managing Physical and Virtual Containers in vertical farming operations',
  version: '1.0.0'
} as const;