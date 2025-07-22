// React is used implicitly by JSX
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Paginator } from './Paginator';

describe('Paginator', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test('renders correctly with provided props', () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={2}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Showing page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('previous button is disabled on first page', () => {
    render(
      <Paginator
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('button');
    expect(previousButton).toHaveAttribute('disabled');

    fireEvent.click(previousButton!);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test('next button is disabled on last page', () => {
    render(
      <Paginator
        currentPage={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toHaveAttribute('disabled');

    fireEvent.click(nextButton!);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test('clicks on next button call onPageChange with correct page number', () => {
    render(
      <Paginator
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('button');
    fireEvent.click(nextButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('clicks on previous button call onPageChange with correct page number', () => {
    render(
      <Paginator
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('button');
    fireEvent.click(previousButton!);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });
});