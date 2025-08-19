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
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="farm-container-04"
        type="Physical"
        tenant="tenant-123"
        purpose="Development"
        location="Lviv"
        status="Active"
        created="30/01/2025, 09:30"
        lastModified="30/01/2025, 11:14"
        creator="Mia Adams"
        seedTypes={["Someroots", "sunflower", "Someroots", "Someroots"]}
        notes="Primary production container for Farm A."
      />
    </div>
  );
};

// Example 2: Virtual container with different status
export const ContainerInfoPanelVirtual: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="virtual-container-01"
        type="Virtual"
        tenant="tenant-456"
        purpose="Testing"
        location="Remote"
        status="Inactive"
        created="28/01/2025, 14:22"
        lastModified="30/01/2025, 08:15"
        creator="John Smith"
        seedTypes={["Lettuce", "Basil", "Spinach"]}
        notes="Test environment for new farming protocols and seed optimization."
      />
    </div>
  );
};

// Example 3: Container with maintenance status
export const ContainerInfoPanelMaintenance: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="farm-container-12"
        type="Physical"
        tenant="tenant-789"
        purpose="Production"
        location="Amsterdam"
        status="Maintenance"
        created="25/01/2025, 11:00"
        lastModified="31/01/2025, 16:45"
        creator="Sarah Johnson"
        seedTypes={["Tomato", "Pepper", "Cucumber"]}
        notes="Scheduled maintenance for sensor calibration and system updates."
      />
    </div>
  );
};

// Example 4: Container with error status
export const ContainerInfoPanelError: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="farm-container-07"
        type="Physical"
        tenant="tenant-321"
        purpose="Production"
        location="Berlin"
        status="Error"
        created="20/01/2025, 09:15"
        lastModified="31/01/2025, 12:30"
        creator="Mike Davis"
        seedTypes={["Kale", "Arugula"]}
        notes="System error detected in irrigation system. Requires immediate attention."
      />
    </div>
  );
};

// Example 5: Minimal container without seeds and notes
export const ContainerInfoPanelMinimal: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="container-minimal"
        type="Virtual"
        tenant="tenant-999"
        purpose="Development"
        location="Cloud"
        status="Active"
        created="01/02/2025, 10:00"
        lastModified="01/02/2025, 10:00"
        creator="Auto System"
      />
    </div>
  );
};

// Example 6: Loading state
export const ContainerInfoPanelLoading: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name=""
        type="Physical"
        tenant=""
        purpose=""
        location=""
        status="Active"
        created=""
        lastModified=""
        creator=""
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
        name=""
        type="Physical"
        tenant=""
        purpose=""
        location=""
        status="Active"
        created=""
        lastModified=""
        creator=""
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

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <ContainerInfoPanel
        name="farm-container-04"
        type="Physical"
        tenant="tenant-123"
        purpose="Development"
        location="Lviv"
        status="Active"
        created="30/01/2025, 09:30"
        lastModified="30/01/2025, 11:14"
        creator="Mia Adams"
        seedTypes={["Someroots", "sunflower", "Someroots", "Someroots"]}
        notes="Primary production container for Farm A."
        onClick={handleContainerClick}
      />
    </div>
  );
};

// Example 9: Multiple panels in a grid
export const ContainerInfoPanelGrid: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
      gap: '20px' 
    }}>
      <ContainerInfoPanel
        name="farm-container-01"
        type="Physical"
        tenant="tenant-123"
        purpose="Production"
        location="Amsterdam"
        status="Active"
        created="25/01/2025, 09:00"
        lastModified="31/01/2025, 14:30"
        creator="Alice Cooper"
        seedTypes={["Lettuce", "Spinach"]}
        notes="Main production container for European operations."
      />
      
      <ContainerInfoPanel
        name="virtual-container-02"
        type="Virtual"
        tenant="tenant-456"
        purpose="Testing"
        location="Cloud-EU"
        status="Inactive"
        created="28/01/2025, 12:00"
        lastModified="30/01/2025, 18:45"
        creator="Bob Smith"
        seedTypes={["Basil", "Mint", "Parsley"]}
      />
      
      <ContainerInfoPanel
        name="farm-container-05"
        type="Physical"
        tenant="tenant-789"
        purpose="Research"
        location="Berlin"
        status="Maintenance"
        created="20/01/2025, 08:30"
        lastModified="31/01/2025, 11:15"
        creator="Carol Johnson"
        seedTypes={["Experimental-A", "Experimental-B"]}
        notes="Research container for new seed varieties and growing techniques."
      />
    </div>
  );
};