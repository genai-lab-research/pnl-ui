import { render, screen, fireEvent } from '@testing-library/react';
import TabGroup from './TabGroup';

const mockOptions = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' },
];

describe('TabGroup', () => {
  it('renders all tabs correctly', () => {
    const handleChange = jest.fn();
    render(
      <TabGroup 
        options={mockOptions} 
        value="week" 
        onChange={handleChange} 
      />
    );

    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Quarter')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('highlights selected tab', () => {
    const handleChange = jest.fn();
    render(
      <TabGroup 
        options={mockOptions} 
        value="week" 
        onChange={handleChange} 
      />
    );

    const weekTab = screen.getByText('Week').closest('button');
    expect(weekTab).toHaveAttribute('aria-selected', 'true');

    const monthTab = screen.getByText('Month').closest('button');
    expect(monthTab).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when a tab is clicked', () => {
    const handleChange = jest.fn();
    render(
      <TabGroup 
        options={mockOptions} 
        value="week" 
        onChange={handleChange} 
      />
    );

    fireEvent.click(screen.getByText('Month'));
    expect(handleChange).toHaveBeenCalledWith('month');
  });
});
