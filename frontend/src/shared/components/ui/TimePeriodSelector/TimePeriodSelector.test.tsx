import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../test/utils';
import { TimePeriodSelector, TimePeriod } from './TimePeriodSelector';

describe('TimePeriodSelector', () => {
  const user = userEvent.setup();
  const mockOnChange = vi.fn();

  const defaultProps = {
    value: 'week' as TimePeriod,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default options', () => {
      render(<TimePeriodSelector {...defaultProps} />);

      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Quarter')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render with custom options', () => {
      const customOptions = [
        { label: 'Daily', value: 'day' as TimePeriod },
        { label: 'Weekly', value: 'week' as TimePeriod },
      ];

      render(<TimePeriodSelector {...defaultProps} options={customOptions} />);

      expect(screen.getByText('Daily')).toBeInTheDocument();
      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.queryByText('Month')).not.toBeInTheDocument();
    });

    it('should highlight the selected option', () => {
      render(<TimePeriodSelector {...defaultProps} value="month" />);

      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveAttribute('aria-selected', 'true');

      const weekButton = screen.getByText('Week');
      expect(weekButton).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Interaction', () => {
    it('should call onChange when option is clicked', async () => {
      render(<TimePeriodSelector {...defaultProps} />);

      const monthButton = screen.getByText('Month');
      await user.click(monthButton);

      expect(mockOnChange).toHaveBeenCalledWith('month');
    });

    it('should handle keyboard navigation', async () => {
      render(<TimePeriodSelector {...defaultProps} />);

      const weekButton = screen.getByText('Week');
      weekButton.focus();

      fireEvent.keyDown(weekButton, { key: 'Tab' });

      const monthButton = screen.getByText('Month');
      expect(monthButton).toHaveFocus();
    });

    it('should handle Enter key activation', async () => {
      render(<TimePeriodSelector {...defaultProps} />);

      const monthButton = screen.getByText('Month');
      monthButton.focus();

      fireEvent.keyDown(monthButton, { key: 'Enter' });

      expect(mockOnChange).toHaveBeenCalledWith('month');
    });

    it('should handle Space key activation', async () => {
      render(<TimePeriodSelector {...defaultProps} />);

      const quarterButton = screen.getByText('Quarter');
      quarterButton.focus();

      fireEvent.keyDown(quarterButton, { key: ' ' });

      expect(mockOnChange).toHaveBeenCalledWith('quarter');
    });
  });

  describe('Disabled State', () => {
    it('should disable all options when disabled prop is true', () => {
      render(<TimePeriodSelector {...defaultProps} disabled />);

      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('tabindex', '-1');
      });
    });

    it('should not call onChange when disabled option is clicked', async () => {
      const options = [
        { label: 'Week', value: 'week' as TimePeriod },
        { label: 'Month', value: 'month' as TimePeriod, disabled: true },
      ];

      render(<TimePeriodSelector {...defaultProps} options={options} />);

      const monthButton = screen.getByText('Month');
      await user.click(monthButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when component is disabled', async () => {
      render(<TimePeriodSelector {...defaultProps} disabled />);

      const weekButton = screen.getByText('Week');
      await user.click(weekButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TimePeriodSelector {...defaultProps} />);

      const container = screen.getByRole('tablist');
      expect(container).toHaveAttribute('aria-orientation', 'horizontal');

      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-selected');
        expect(button).toHaveAttribute('tabindex');
      });
    });

    it('should support custom className', () => {
      const { container } = render(
        <TimePeriodSelector {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<TimePeriodSelector {...defaultProps} />);

      const buttons = screen.getAllByRole('tab');
      // Should still render all buttons on mobile
      expect(buttons).toHaveLength(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<TimePeriodSelector {...defaultProps} options={[]} />);

      const container = screen.getByRole('tablist');
      expect(container.children).toHaveLength(0);
    });

    it('should handle single option', () => {
      const singleOption = [{ label: 'Week', value: 'week' as TimePeriod }];

      render(<TimePeriodSelector {...defaultProps} options={singleOption} />);

      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(1);
    });

    it('should handle value not in options', () => {
      render(<TimePeriodSelector {...defaultProps} value={'invalid' as TimePeriod} />);

      // Should render without crashing
      expect(screen.getByText('Week')).toBeInTheDocument();
      
      // No option should be selected
      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-selected', 'false');
      });
    });
  });
});