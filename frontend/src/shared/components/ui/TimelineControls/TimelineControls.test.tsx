import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineControls } from './TimelineControls';
import { vi } from 'vitest';

describe('TimelineControls Component', () => {
  test('renders all control buttons', () => {
    render(<TimelineControls />);
    
    expect(screen.getByLabelText('previous')).toBeInTheDocument();
    expect(screen.getByLabelText('play')).toBeInTheDocument();
    expect(screen.getByLabelText('repeat')).toBeInTheDocument();
    expect(screen.getByLabelText('next')).toBeInTheDocument();
  });

  test('changes icon based on playState', () => {
    const { rerender } = render(<TimelineControls playState="paused" />);
    expect(screen.getByLabelText('play')).toBeInTheDocument();
    
    rerender(<TimelineControls playState="playing" />);
    expect(screen.getByLabelText('pause')).toBeInTheDocument();
  });

  test('calls callbacks when buttons are clicked', () => {
    const onPreviousClick = vi.fn();
    const onPlayPauseClick = vi.fn();
    const onRepeatClick = vi.fn();
    const onNextClick = vi.fn();
    
    render(
      <TimelineControls
        onPreviousClick={onPreviousClick}
        onPlayPauseClick={onPlayPauseClick}
        onRepeatClick={onRepeatClick}
        onNextClick={onNextClick}
      />
    );
    
    fireEvent.click(screen.getByLabelText('previous'));
    expect(onPreviousClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByLabelText('play'));
    expect(onPlayPauseClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByLabelText('repeat'));
    expect(onRepeatClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByLabelText('next'));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  test('disables all buttons when disabled prop is true', () => {
    render(<TimelineControls disabled />);
    
    expect(screen.getByLabelText('previous')).toBeDisabled();
    expect(screen.getByLabelText('play')).toBeDisabled();
    expect(screen.getByLabelText('repeat')).toBeDisabled();
    expect(screen.getByLabelText('next')).toBeDisabled();
  });

  test('applies custom className', () => {
    render(<TimelineControls className="custom-class" />);
    
    expect(screen.getByRole('group')).toHaveClass('custom-class');
  });
});