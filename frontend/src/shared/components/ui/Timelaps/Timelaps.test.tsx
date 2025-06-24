import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timelaps } from './Timelaps';

describe('Timelaps Component', () => {
  const mockCells = Array(62).fill(null).map((_, index) => ({
    isActive: index === 30,
    isFuture: index > 30
  }));

  it('renders the component with all cells', () => {
    render(
      <Timelaps
        cells={mockCells}
        startDate="05 Apr"
        endDate="06 Jun"
      />
    );
    
    // Check if date labels are rendered
    expect(screen.getByText('05 Apr')).toBeInTheDocument();
    expect(screen.getByText('06 Jun')).toBeInTheDocument();
    
    // We should have 62 timeline cells
    const cells = document.querySelectorAll('div[class^="TimelineCell"]');
    expect(cells.length).toBe(62);
  });

  it('displays tooltip when currentDayIndex is provided', () => {
    render(
      <Timelaps
        cells={mockCells}
        startDate="05 Apr"
        endDate="06 Jun"
        currentDayIndex={30}
      />
    );
    
    // Check if tooltip is rendered
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('does not display tooltip when currentDayIndex is not provided', () => {
    render(
      <Timelaps
        cells={mockCells}
        startDate="05 Apr"
        endDate="06 Jun"
      />
    );
    
    // Check that tooltip is not rendered
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
  });
});