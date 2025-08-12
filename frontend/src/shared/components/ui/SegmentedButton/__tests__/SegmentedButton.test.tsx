import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SegmentedButton } from '../SegmentedButton';

describe('SegmentedButton', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all options correctly', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
        label="Test Label"
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when option is clicked', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Option 2'));
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('applies active class to selected option', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option2"
        onChange={mockOnChange}
      />
    );

    const activeButton = screen.getByText('Option 2');
    expect(activeButton).toHaveClass('active');
  });

  it('applies inactive class to non-selected options', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option2"
        onChange={mockOnChange}
      />
    );

    const inactiveButton = screen.getByText('Option 1');
    expect(inactiveButton).toHaveClass('inactive');
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <SegmentedButton
        options={mockOptions}
        value="option1"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    mockOptions.forEach(option => {
      const button = screen.getByText(option.label);
      expect(button).toBeDisabled();
    });
  });

  it('disables individual options when option.disabled is true', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' }
    ];

    render(
      <SegmentedButton
        options={optionsWithDisabled}
        value="option1"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Option 2')).toBeDisabled();
    expect(screen.getByText('Option 1')).not.toBeDisabled();
    expect(screen.getByText('Option 3')).not.toBeDisabled();
  });
});