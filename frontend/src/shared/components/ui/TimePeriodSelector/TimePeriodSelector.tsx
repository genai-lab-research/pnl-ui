import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface TimePeriodOption {
  /** Label shown on the tab */
  label: string;
  /** Value for the tab */
  value: TimePeriod;
  /** If true, tab will be disabled */
  disabled?: boolean;
}

export interface TimePeriodSelectorProps {
  /** The currently selected time period value */
  value: TimePeriod;
  /** Callback fired when the value changes */
  onChange: (value: TimePeriod) => void;
  /** Custom className for styling */
  className?: string;
  /** If true, will disable the entire component */
  disabled?: boolean;
  /** Optional override of the tabs */
  options?: TimePeriodOption[];
}

interface TabProps {
  selected?: boolean;
  disabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const TabsContainer = styled(Box)(() => ({
  display: 'flex',
  width: 'fit-content',
  borderRadius: '4px',
  overflow: 'hidden',
}));

const Tab = styled('button')<TabProps>(({ selected, disabled, isFirst, isLast }) => ({
  flex: 1,
  padding: '8px 16px',
  border: selected ? '1px solid #3545EE' : '1px solid transparent',
  outline: 'none',
  cursor: 'pointer',
  background: 'transparent',
  color: selected ? '#3545EE' : '#49454F',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
  position: 'relative',
  transition: 'all 0.2s ease',
  borderRadius: '4px',
  
  // Disabled state
  ...(disabled && {
    color: '#BDBDBD',
    cursor: 'default',
    opacity: 0.7,
  }),
  
  // Hover state (only apply when not disabled)
  ...(!disabled && {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  }),
  
  // Active state (when pressed)
  ...(!disabled && {
    '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  }),

  // Focus state for accessibility
  '&:focus-visible': {
    outline: '2px solid #3545EE',
    outlineOffset: '-2px',
  },

  // Media query for mobile
  '@media (max-width: 600px)': {
    padding: '8px 12px',
  },
}));

/**
 * TimePeriodSelector component displays a series of tab options for selecting time periods.
 * This component follows Material Design specifications and adapts to different screen sizes.
 * 
 * @component
 * @example
 * ```tsx
 * const [period, setPeriod] = React.useState<TimePeriod>('week');
 * 
 * const handleChange = (value: TimePeriod) => {
 *   setPeriod(value);
 * };
 * 
 * return (
 *   <TimePeriodSelector 
 *     value={period}
 *     onChange={handleChange}
 *   />
 * );
 * ```
 */
export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  value,
  onChange,
  className,
  disabled = false,
  options = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
    { label: 'Year', value: 'year' },
  ],
}) => {
  const handleClick = (option: TimePeriodOption) => {
    if (!disabled && !option.disabled) {
      onChange(option.value);
    }
  };

  return (
    <TabsContainer className={className} role="tablist" aria-orientation="horizontal">
      {options.map((option, index) => (
        <Tab
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          aria-disabled={disabled || option.disabled}
          selected={value === option.value}
          disabled={disabled || option.disabled}
          onClick={() => handleClick(option)}
          isFirst={index === 0}
          isLast={index === options.length - 1}
          tabIndex={disabled || option.disabled ? -1 : 0}
        >
          {option.label}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default TimePeriodSelector;