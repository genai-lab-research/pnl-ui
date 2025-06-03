import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddTraySlot } from './AddTraySlot';

describe('AddTraySlot', () => {
  it('renders correctly with slot number', () => {
    render(<AddTraySlot slotNumber={4} />);
    
    expect(screen.getByText('SLOT 4')).toBeInTheDocument();
    expect(screen.getByText('Add Tray')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<AddTraySlot slotNumber={4} onClick={handleClick} />);
    
    const container = screen.getByText('Add Tray').closest('div');
    if (container) {
      fireEvent.click(container);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<AddTraySlot slotNumber={4} onClick={handleClick} disabled />);
    
    const container = screen.getByText('Add Tray').closest('div');
    if (container) {
      fireEvent.click(container);
      expect(handleClick).not.toHaveBeenCalled();
    }
  });

  it('renders different slot numbers', () => {
    const { rerender } = render(<AddTraySlot slotNumber={1} />);
    expect(screen.getByText('SLOT 1')).toBeInTheDocument();
    
    rerender(<AddTraySlot slotNumber={8} />);
    expect(screen.getByText('SLOT 8')).toBeInTheDocument();
  });
});