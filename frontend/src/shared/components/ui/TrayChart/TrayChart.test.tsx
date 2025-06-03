import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrayChart } from './TrayChart';

// Mock Chart.js to avoid canvas-related issues in tests
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mocked-chart" />,
}));

describe('TrayChart Component', () => {
  const mockData = [
    [0, 0],
    [50, 40],
    [100, 80],
    [150, 120],
    [200, 160],
    [250, 220],
    [270, 270],
  ];

  test('renders with default props', () => {
    render(
      <TrayChart 
        title="Light" 
        data={mockData} 
      />
    );
    
    // Check that the title is rendered
    expect(screen.getByText('Light')).toBeInTheDocument();
    
    // Check that the subtitle is rendered with default value
    expect(screen.getByText('h, accum')).toBeInTheDocument();
    
    // Check that the start value is rendered
    expect(screen.getByText('0.0')).toBeInTheDocument();
    
    // Check that the end value is rendered (last data point y value)
    expect(screen.getByText('270')).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(
      <TrayChart 
        title="Temperature" 
        subtitle="°C, daily" 
        data={mockData}
        width="200px"
        height={50} 
      />
    );
    
    // Check that the custom title is rendered
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    
    // Check that the custom subtitle is rendered
    expect(screen.getByText('°C, daily')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    render(
      <TrayChart 
        title="Empty Chart" 
        data={[]} 
      />
    );
    
    // Should still render the title
    expect(screen.getByText('Empty Chart')).toBeInTheDocument();
    
    // Should render default values for empty data
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});