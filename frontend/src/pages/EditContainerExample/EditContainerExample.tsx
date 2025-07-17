import React, { useState } from 'react';
import { EditContainerPanel } from '../../features/EditContainerPanel';
import { Container } from '../../shared/types/containers';

/**
 * Example page showing how to integrate EditContainerPanel
 * This demonstrates the typical usage pattern
 */
const EditContainerExample: React.FC = () => {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  // Mock container data for demonstration
  const mockContainer: Container = {
    id: 'container-123',
    name: 'farm-container-04',
    tenant: 'tenant-23',
    type: 'virtual',
    purpose: 'development',
    location: {
      city: 'San Francisco',
      country: 'USA',
      address: 'Farm Facility A'
    },
    status: 'active',
    seed_types: ['1', '2'],
    created: '2024-01-15T10:30:00Z',
    modified: '2024-01-20T14:45:00Z',
    has_alert: false,
    notes: 'Primary production container for Farm A.',
    shadow_service_enabled: true,
    ecosystem_connected: false
  };

  const handleEditContainer = () => {
    setSelectedContainer(mockContainer);
    setEditPanelOpen(true);
  };

  const handleContainerUpdated = (/* updatedContainer: Container */) => {
    setEditPanelOpen(false);
    setSelectedContainer(null);
  };

  const handlePanelClose = () => {
    setEditPanelOpen(false);
    setSelectedContainer(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Container Panel Example</h1>
      <p>This page demonstrates how to use the EditContainerPanel component.</p>

      <div style={{
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>Container: {mockContainer.name}</h3>
        <p>Type: {mockContainer.type}</p>
        <p>Purpose: {mockContainer.purpose}</p>
        <p>Tenant: {mockContainer.tenant}</p>
        <button
          onClick={handleEditContainer}
          style={{
            padding: '8px 16px',
            background: '#656CFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit Container
        </button>
      </div>

      <EditContainerPanel
        open={editPanelOpen}
        container={selectedContainer}
        onClose={handlePanelClose}
        onSuccess={handleContainerUpdated}
      />
    </div>
  );
};

export default EditContainerExample;