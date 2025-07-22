import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerticalTabNav from './VerticalTabNav';

const mockOptions = [
  { value: 'overview', label: 'Overview' },
  { value: 'environment', label: 'Environment & Recipes' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'devices', label: 'Devices' },
];

describe('VerticalTabNav', () => {
  it('renders all tabs', () => {
    const mockOnChange = jest.fn();
    render(
      <VerticalTabNav
        options={mockOptions}
        value="inventory"
        onChange={mockOnChange}
      />
    );

    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('highlights the selected tab', () => {
    const mockOnChange = jest.fn();
    render(
      <VerticalTabNav
        options={mockOptions}
        value="inventory"
        onChange={mockOnChange}
      />
    );

    const selectedTab = screen.getByText('Inventory');
    expect(selectedTab.closest('button')).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onChange when a tab is clicked', () => {
    const mockOnChange = jest.fn();
    render(
      <VerticalTabNav
        options={mockOptions}
        value="inventory"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Devices'));
    expect(mockOnChange).toHaveBeenCalledWith('devices');
  });
});
