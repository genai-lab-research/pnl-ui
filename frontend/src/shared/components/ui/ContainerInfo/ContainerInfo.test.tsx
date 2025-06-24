import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ContainerInfo from './ContainerInfo';
import '@testing-library/jest-dom';

describe('ContainerInfo', () => {
  const defaultProps = {
    name: 'farm-container-04',
    type: 'Physical',
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Lviv',
    status: 'Active',
    created: '30/01/2025, 09:30',
    lastModified: '30/01/2025, 11:14',
    creator: 'Mia Adams',
    seedTypes: 'Someroots, sunflower, Someroots, Someroots',
    notes: 'Primary production container for Farm A.',
  };

  test('renders container information correctly', () => {
    render(<ContainerInfo {...defaultProps} />);
    
    // Check section titles
    expect(screen.getByText('Container Information')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    
    // Check labels
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Tenant')).toBeInTheDocument();
    expect(screen.getByText('Purpose')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText('Seed Type:')).toBeInTheDocument();
    
    // Check values
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.type)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.tenant)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.purpose)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.location)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.status)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.created)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.lastModified)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.creator)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.seedTypes)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.notes)).toBeInTheDocument();
  });
});