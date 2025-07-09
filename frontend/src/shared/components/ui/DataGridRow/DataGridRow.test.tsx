import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataGridRow from './DataGridRow';

describe('DataGridRow', () => {
  const mockProps = {
    cropName: 'Rex Butterhead',
    generation: 65,
    cycles: 10,
    seedingDate: '2025-01-10',
    harvestDate: '2025-01-20',
    inspectionDate: '2025-01-01',
    beds: 22,
    status: {
      type: 'active' as const,
      count: 0
    }
  };

  it('renders all the data correctly', () => {
    render(<DataGridRow {...mockProps} />);
    
    expect(screen.getByText('Rex Butterhead')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2025-01-10')).toBeInTheDocument();
    expect(screen.getByText('2025-01-20')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});