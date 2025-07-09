import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders with default placeholder', () => {
    render(<TextInput />);
    expect(screen.getByPlaceholderText('Notes (optional)')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<TextInput placeholder="Custom placeholder" />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<TextInput value="" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Notes (optional)');
    fireEvent.change(input, { target: { value: 'New value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<TextInput disabled />);
    expect(screen.getByPlaceholderText('Notes (optional)')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<TextInput className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TextInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
