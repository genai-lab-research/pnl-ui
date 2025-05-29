import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test('renders correctly with default props', () => {
    render(
      <Pagination
        page={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if the pagination text is displayed correctly
    expect(screen.getByText('Showing page 1 of 10')).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    // Previous button should be disabled on first page
    expect(screen.getByText('Previous').closest('button')).toBeDisabled();
    
    // Next button should be enabled
    expect(screen.getByText('Next').closest('button')).not.toBeDisabled();
  });

  test('disables next button on last page', () => {
    render(
      <Pagination
        page={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if the pagination text is displayed correctly
    expect(screen.getByText('Showing page 10 of 10')).toBeInTheDocument();
    
    // Previous button should be enabled on last page
    expect(screen.getByText('Previous').closest('button')).not.toBeDisabled();
    
    // Next button should be disabled on last page
    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  test('enables both buttons on middle pages', () => {
    render(
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if the pagination text is displayed correctly
    expect(screen.getByText('Showing page 5 of 10')).toBeInTheDocument();
    
    // Both buttons should be enabled on middle pages
    expect(screen.getByText('Previous').closest('button')).not.toBeDisabled();
    expect(screen.getByText('Next').closest('button')).not.toBeDisabled();
  });

  test('calls onPageChange with correct page when clicking next', () => {
    render(
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Click next button
    fireEvent.click(screen.getByText('Next'));
    
    // Should call onPageChange with page + 1
    expect(mockOnPageChange).toHaveBeenCalledWith(6);
  });

  test('calls onPageChange with correct page when clicking previous', () => {
    render(
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Click previous button
    fireEvent.click(screen.getByText('Previous'));
    
    // Should call onPageChange with page - 1
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test('renders with custom showing text', () => {
    render(
      <Pagination
        page={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        showingText="Page"
      />
    );

    // Check if the pagination text is displayed correctly with custom text
    expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
  });
});