import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { TimelapsSelector } from './TimelapsSelector';

describe('TimelapsSelector', () => {
  test('renders 7 day buttons', () => {
    render(<TimelapsSelector />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  test('highlights the current day', () => {
    // Set current day to Wednesday (index 2)
    render(<TimelapsSelector currentDay={2} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Check aria-pressed attribute for all buttons
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[2]).toHaveAttribute('aria-pressed', 'true'); // Wednesday should be highlighted
    expect(buttons[3]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[4]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[5]).toHaveAttribute('aria-pressed', 'false');
    expect(buttons[6]).toHaveAttribute('aria-pressed', 'false');
  });

  test('calls onDaySelect when a day is clicked', () => {
    const handleDaySelect = vi.fn();
    render(<TimelapsSelector onDaySelect={handleDaySelect} />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[3]); // Click on Thursday (index 3)
    
    expect(handleDaySelect).toHaveBeenCalledWith(3);
  });

  test('does not call onDaySelect when disabled', () => {
    const handleDaySelect = vi.fn();
    render(<TimelapsSelector onDaySelect={handleDaySelect} disabled />);
    
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); // Click on Monday
    
    expect(handleDaySelect).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(<TimelapsSelector className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  test('has correct ARIA attributes', () => {
    render(<TimelapsSelector />);
    
    // Check group role
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Day selector');
    
    // Check each button has a label
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-label', 'Mon');
    expect(buttons[1]).toHaveAttribute('aria-label', 'Tue');
    expect(buttons[2]).toHaveAttribute('aria-label', 'Wed');
    // etc.
  });
});