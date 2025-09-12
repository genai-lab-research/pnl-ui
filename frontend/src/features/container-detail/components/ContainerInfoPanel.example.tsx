import React from 'react';
import { ContainerInfoPanel } from './ContainerInfoPanel';

/**
 * Example usage of the ContainerInfoPanel component
 * 
 * This example demonstrates various states and configurations
 * of the ContainerInfoPanel component, matching the original
 * Figma design (2615:207789).
 */

// Example 1: Default state with full information
export const ContainerInfoPanelDefault: React.FC = () => {
  const containerInfo = [
    { label: 'Name', value: 'farm-container-04' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-123' },
    { label: 'Purpose', value: 'Development' },
    { label: 'Location', value: 'Lviv' },
    { label: 'Status', value: 'Active' },
    { label: 'Created', value: '30/01/2025, 09:30' },
    { label: 'Last Modified', value: '30/01/2025, 11:14' },
    { label: 'Creator', value: 'Mia Adams' },
    { label: 'Seed Types', value: 'Someroots, sunflower, Someroots, Someroots' },
    { label: 'Notes', value: 'Primary production container for Farm A.' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel containerInfo={containerInfo} />
    </div>
  );
};

// Example 2: Virtual container with different status
export const ContainerInfoPanelVirtual: React.FC = () => {
  const containerInfo = [
    { label: 'Name', value: 'virtual-container-01' },
    { label: 'Type', value: 'Virtual' },
    { label: 'Tenant', value: 'tenant-456' },
    { label: 'Purpose', value: 'Testing' },
    { label: 'Location', value: 'Remote' },
    { label: 'Status', value: 'Inactive' },
    { label: 'Created', value: '28/01/2025, 14:22' },
    { label: 'Last Modified', value: '30/01/2025, 08:15' },
    { label: 'Creator', value: 'John Smith' },
    { label: 'Seed Types', value: 'Lettuce, Basil, Spinach' },
    { label: 'Notes', value: 'Test environment for new farming protocols and seed optimization.' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel containerInfo={containerInfo} />
    </div>
  );
};

// Example 3: Container with maintenance status
export const ContainerInfoPanelMaintenance: React.FC = () => {
  const containerInfo = [
    { label: 'Name', value: 'farm-container-12' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-789' },
    { label: 'Purpose', value: 'Production' },
    { label: 'Location', value: 'Amsterdam' },
    { label: 'Status', value: 'Maintenance' },
    { label: 'Created', value: '25/01/2025, 11:00' },
    { label: 'Last Modified', value: '31/01/2025, 16:45' },
    { label: 'Creator', value: 'Sarah Johnson' },
    { label: 'Seed Types', value: 'Tomato, Pepper, Cucumber' },
    { label: 'Notes', value: 'Scheduled maintenance for sensor calibration and system updates.' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel containerInfo={containerInfo} />
    </div>
  );
};

// Example 4: Container with error status
export const ContainerInfoPanelError: React.FC = () => {
  const containerInfo = [
    { label: 'Name', value: 'farm-container-07' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-321' },
    { label: 'Purpose', value: 'Production' },
    { label: 'Location', value: 'Berlin' },
    { label: 'Status', value: 'Error' },
    { label: 'Created', value: '20/01/2025, 09:15' },
    { label: 'Last Modified', value: '31/01/2025, 12:30' },
    { label: 'Creator', value: 'Mike Davis' },
    { label: 'Seed Types', value: 'Kale, Arugula' },
    { label: 'Notes', value: 'System error detected in irrigation system. Requires immediate attention.' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel containerInfo={containerInfo} />
    </div>
  );
};

// Example 5: Minimal container without seeds and notes
export const ContainerInfoPanelMinimal: React.FC = () => {
  const containerInfo = [
    { label: 'Name', value: 'container-minimal' },
    { label: 'Type', value: 'Virtual' },
    { label: 'Tenant', value: 'tenant-999' },
    { label: 'Purpose', value: 'Development' },
    { label: 'Location', value: 'Cloud' },
    { label: 'Status', value: 'Active' },
    { label: 'Created', value: '01/02/2025, 10:00' },
    { label: 'Last Modified', value: '01/02/2025, 10:00' },
    { label: 'Creator', value: 'Auto System' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel containerInfo={containerInfo} />
    </div>
  );
};

// Example 6: Loading state
export const ContainerInfoPanelLoading: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        containerInfo={[]}
        loading={true}
      />
    </div>
  );
};

// Example 7: Error state
export const ContainerInfoPanelErrorState: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        containerInfo={[]}
        error="Failed to load container information. Please try again."
      />
    </div>
  );
};

// Example 8: Interactive container with click handler
export const ContainerInfoPanelInteractive: React.FC = () => {
  const handleContainerClick = () => {
    alert('Container info panel clicked!');
  };

  const containerInfo = [
    { label: 'Name', value: 'farm-container-04' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-123' },
    { label: 'Purpose', value: 'Development' },
    { label: 'Location', value: 'Lviv' },
    { label: 'Status', value: 'Active' },
    { label: 'Created', value: '30/01/2025, 09:30' },
    { label: 'Last Modified', value: '30/01/2025, 11:14' },
    { label: 'Creator', value: 'Mia Adams' },
    { label: 'Seed Types', value: 'Someroots, sunflower, Someroots, Someroots' },
    { label: 'Notes', value: 'Primary production container for Farm A.' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        containerInfo={containerInfo}
        onClick={handleContainerClick}
      />
    </div>
  );
};

// Example 9: Multiple panels in a grid
export const ContainerInfoPanelGrid: React.FC = () => {
  const containerInfo1 = [
    { label: 'Name', value: 'farm-container-01' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-123' },
    { label: 'Purpose', value: 'Production' },
    { label: 'Location', value: 'Amsterdam' },
    { label: 'Status', value: 'Active' },
    { label: 'Created', value: '25/01/2025, 09:00' },
    { label: 'Last Modified', value: '31/01/2025, 14:30' },
    { label: 'Creator', value: 'Alice Cooper' },
    { label: 'Seed Types', value: 'Lettuce, Spinach' },
    { label: 'Notes', value: 'Main production container for European operations.' },
  ];

  const containerInfo2 = [
    { label: 'Name', value: 'virtual-container-02' },
    { label: 'Type', value: 'Virtual' },
    { label: 'Tenant', value: 'tenant-456' },
    { label: 'Purpose', value: 'Testing' },
    { label: 'Location', value: 'Cloud-EU' },
    { label: 'Status', value: 'Inactive' },
    { label: 'Created', value: '28/01/2025, 12:00' },
    { label: 'Last Modified', value: '30/01/2025, 18:45' },
    { label: 'Creator', value: 'Bob Smith' },
    { label: 'Seed Types', value: 'Basil, Mint, Parsley' },
  ];

  const containerInfo3 = [
    { label: 'Name', value: 'farm-container-05' },
    { label: 'Type', value: 'Physical' },
    { label: 'Tenant', value: 'tenant-789' },
    { label: 'Purpose', value: 'Research' },
    { label: 'Location', value: 'Berlin' },
    { label: 'Status', value: 'Maintenance' },
    { label: 'Created', value: '20/01/2025, 08:30' },
    { label: 'Last Modified', value: '31/01/2025, 11:15' },
    { label: 'Creator', value: 'Carol Johnson' },
    { label: 'Seed Types', value: 'Experimental-A, Experimental-B' },
    { label: 'Notes', value: 'Research container for new seed varieties and growing techniques.' },
  ];

  return (
    <div style={{ 
      padding: '20px', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
      gap: '20px' 
    }}>
      <ContainerInfoPanel containerInfo={containerInfo1} />
      <ContainerInfoPanel containerInfo={containerInfo2} />
      <ContainerInfoPanel containerInfo={containerInfo3} />
    </div>
  );
};