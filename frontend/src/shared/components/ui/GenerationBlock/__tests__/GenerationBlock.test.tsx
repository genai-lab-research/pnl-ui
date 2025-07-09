import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerationBlock } from '../GenerationBlock';

describe('GenerationBlock', () => {
  it('renders with default props', () => {
    render(<GenerationBlock />);
    
    // Check that key elements are rendered
    expect(screen.getByText('SLOT 4')).toBeInTheDocument();
    expect(screen.getByText('TR-15199256')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('10x20 Grid')).toBeInTheDocument();
    expect(screen.getByText('170 crops')).toBeInTheDocument();
  });
  
  it('renders with custom props', () => {
    const customProps = {
      slotNumber: 7,
      trayId: 'TR-9876543',
      progressPercentage: 50,
      gridRows: 15,
      gridColumns: 8,
      totalCrops: 90,
    };
    
    render(<GenerationBlock {...customProps} />);
    
    // Check that custom values are rendered
    expect(screen.getByText('SLOT 7')).toBeInTheDocument();
    expect(screen.getByText('TR-9876543')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('8x15 Grid')).toBeInTheDocument();
    expect(screen.getByText('90 crops')).toBeInTheDocument();
  });
});