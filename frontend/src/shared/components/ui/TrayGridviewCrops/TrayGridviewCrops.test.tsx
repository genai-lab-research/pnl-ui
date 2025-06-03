import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { TrayGridviewCrops } from './TrayGridviewCrops';

describe('TrayGridviewCrops', () => {
  test('renders with default props', () => {
    render(<TrayGridviewCrops value={75} />);
    
    // Check if percentage is displayed
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('renders with title and information', () => {
    render(
      <TrayGridviewCrops 
        title="SLOT 1" 
        value={75}
        gridSizeText="10x20 Grid"
        itemCount={170}
        itemLabel="crops"
      />
    );
    
    // Check if title and information are displayed
    expect(screen.getByText('SLOT 1')).toBeInTheDocument();
    expect(screen.getByText('10x20 Grid')).toBeInTheDocument();
    expect(screen.getByText('170 crops')).toBeInTheDocument();
  });

  test('normalizes values outside 0-100 range', () => {
    // Test with value > 100
    const { rerender } = render(<TrayGridviewCrops value={120} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Test with value < 0
    rerender(<TrayGridviewCrops value={-20} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('applies disabled state', () => {
    const { container } = render(<TrayGridviewCrops value={75} disabled />);
    
    // Check if the container has reduced opacity
    const containerElement = container.firstChild as HTMLElement;
    expect(containerElement).toHaveStyle('opacity: 0.5');
  });

  test('has proper accessibility attributes', () => {
    render(<TrayGridviewCrops value={75} title="SLOT 1" />);
    
    expect(screen.getByLabelText('75% complete')).toBeInTheDocument();
    expect(screen.getByLabelText('Grid visualization of 75% complete')).toBeInTheDocument();
  });
});