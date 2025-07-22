import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SegmentedButton from './SegmentedButton';

describe('SegmentedButton', () => {
  const options = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' },
  ];
  
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all options', () => {
    render(
      <SegmentedButton 
        options={options} 
        value="physical" 
        onChange={mockOnChange} 
      />
    );

    expect(screen.getByText('Physical')).toBeInTheDocument();
    expect(screen.getByText('Virtual')).toBeInTheDocument();
  });

  it('highlights the active option', () => {
    render(
      <SegmentedButton 
        options={options} 
        value="physical" 
        onChange={mockOnChange} 
      />
    );

    const physicalOption = screen.getByText('Physical');
    const virtualOption = screen.getByText('Virtual');

    expect(physicalOption).toHaveAttribute('aria-pressed', 'true');
    expect(virtualOption).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when an option is clicked', () => {
    render(
      <SegmentedButton 
        options={options} 
        value="physical" 
        onChange={mockOnChange} 
      />
    );

    const virtualOption = screen.getByText('Virtual');
    fireEvent.click(virtualOption);

    expect(mockOnChange).toHaveBeenCalledWith('virtual');
  });
});