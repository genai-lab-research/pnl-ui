import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VerticalFarmingTabGroup from './VerticalFarmingTabGroup';

describe('VerticalFarmingTabGroup', () => {
  const options = [
    { value: 'nursery', label: 'Nursery Station' },
    { value: 'cultivation', label: 'Cultivation Area' }
  ];

  it('renders all tab options', () => {
    render(
      <VerticalFarmingTabGroup
        options={options}
        value="nursery"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Nursery Station')).toBeInTheDocument();
    expect(screen.getByText('Cultivation Area')).toBeInTheDocument();
  });

  it('applies active styling to selected tab', () => {
    const { rerender } = render(
      <VerticalFarmingTabGroup
        options={options}
        value="nursery"
        onChange={() => {}}
      />
    );

    const nurseryTab = screen.getByRole('tab', { selected: true });
    expect(nurseryTab).toHaveTextContent('Nursery Station');

    rerender(
      <VerticalFarmingTabGroup
        options={options}
        value="cultivation"
        onChange={() => {}}
      />
    );

    const cultivationTab = screen.getByRole('tab', { selected: true });
    expect(cultivationTab).toHaveTextContent('Cultivation Area');
  });

  it('calls onChange when a tab is clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <VerticalFarmingTabGroup
        options={options}
        value="nursery"
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('Cultivation Area'));
    expect(handleChange).toHaveBeenCalledWith('cultivation');
  });
});
