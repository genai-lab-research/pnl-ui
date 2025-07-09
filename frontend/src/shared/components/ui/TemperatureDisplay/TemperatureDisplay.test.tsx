import React from 'react';
import { render, screen } from '@testing-library/react';
import TemperatureDisplay from './TemperatureDisplay';

describe('TemperatureDisplay', () => {
  const defaultProps = {
    currentTemperature: 20,
    targetTemperature: 21,
  };

  it('renders the component correctly', () => {
    render(<TemperatureDisplay {...defaultProps} />);
    
    expect(screen.getByText('Air Temperature')).toBeInTheDocument();
    expect(screen.getByText('20°C / 21°C')).toBeInTheDocument();
  });

  it('displays the correct temperature values', () => {
    render(<TemperatureDisplay currentTemperature={18} targetTemperature={22} />);
    
    expect(screen.getByText('18°C / 22°C')).toBeInTheDocument();
  });

  it('uses custom temperature unit when provided', () => {
    render(<TemperatureDisplay {...defaultProps} unit="°F" />);
    
    expect(screen.getByText('20°F / 21°F')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    const { container } = render(<TemperatureDisplay {...defaultProps} className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });
});