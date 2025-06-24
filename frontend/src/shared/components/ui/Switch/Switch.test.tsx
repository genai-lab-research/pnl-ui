import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders correctly', () => {
    render(<Switch />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders in checked state when checked prop is true', () => {
    render(<Switch checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders in unchecked state when checked prop is false', () => {
    render(<Switch checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange handler when clicked', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} disabled={true} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});