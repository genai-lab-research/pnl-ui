import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import { TimelineComponent } from './TimelineComponent';

// Create a theme for testing
const theme = createTheme();

// Helper function to render with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('TimelineComponent', () => {
  test('renders with default props', () => {
    renderWithTheme(<TimelineComponent />);
    
    // Check that the timeline intervals are rendered
    const intervalGroup = screen.getByRole('group', { name: /timeline intervals/i });
    expect(intervalGroup).toBeInTheDocument();
    
    // Check that labels are rendered (looking for text content that may be split by <br>)
    expect(screen.getByText((content, element) => {
      return content === '01' && element?.tagName.toLowerCase() !== 'br';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return content === 'Apr' && element?.tagName.toLowerCase() !== 'br';
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return content === '15' && element?.tagName.toLowerCase() !== 'br';
    })).toBeInTheDocument();
  });

  test('renders with custom interval count', () => {
    renderWithTheme(<TimelineComponent intervalCount={5} />);
    
    // Check that 5 intervals are rendered
    const intervals = screen.getAllByRole('button');
    expect(intervals).toHaveLength(5);
  });

  test('renders with custom labels', () => {
    renderWithTheme(
      <TimelineComponent 
        labels={{ 
          start: 'Start', 
          end: 'End' 
        }} 
      />
    );
    
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  test('calls onIntervalClick when an interval is clicked', () => {
    const handleIntervalClick = vi.fn();
    
    renderWithTheme(
      <TimelineComponent 
        intervalCount={3}
        onIntervalClick={handleIntervalClick}
      />
    );
    
    // Click the second interval
    const intervals = screen.getAllByRole('button');
    fireEvent.click(intervals[1]);
    
    expect(handleIntervalClick).toHaveBeenCalledWith(1);
  });

  test('does not call onIntervalClick when disabled', () => {
    const handleIntervalClick = vi.fn();
    
    renderWithTheme(
      <TimelineComponent 
        intervalCount={3}
        onIntervalClick={handleIntervalClick}
        disabled
      />
    );
    
    // Click the second interval
    const intervals = screen.getAllByRole('button');
    fireEvent.click(intervals[1]);
    
    expect(handleIntervalClick).not.toHaveBeenCalled();
  });

  test('highlights the selected interval', () => {
    renderWithTheme(
      <TimelineComponent 
        intervalCount={3}
        selectedInterval={1}
      />
    );
    
    const intervals = screen.getAllByRole('button');
    
    // Check that the second interval has aria-selected="true"
    expect(intervals[1]).toHaveAttribute('aria-selected', 'true');
    
    // First and third intervals should not be selected
    expect(intervals[0]).toHaveAttribute('aria-selected', 'false');
    expect(intervals[2]).toHaveAttribute('aria-selected', 'false');
  });
});