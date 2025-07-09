import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaginationBlock } from './PaginationBlock';

describe('PaginationBlock', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders correctly with provided props', () => {
    render(
      <PaginationBlock
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getAllByText('Showing page 2 of 5')).toHaveLength(2);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <PaginationBlock
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('button');
    expect(previousButton).toBeDisabled();

    fireEvent.click(previousButton!);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('disables next button on last page', () => {
    render(
      <PaginationBlock
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton!);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('calls onPageChange when clicking previous button', () => {
    render(
      <PaginationBlock
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('button');
    fireEvent.click(previousButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking next button', () => {
    render(
      <PaginationBlock
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('button');
    fireEvent.click(nextButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});