import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox Component', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('renders checked when checked prop is true', () => {
    render(<Checkbox checked={true} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} disabled />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
