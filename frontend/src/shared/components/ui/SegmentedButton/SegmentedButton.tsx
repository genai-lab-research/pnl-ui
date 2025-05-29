import React from 'react';
import { 
  ToggleButtonGroup, 
  ToggleButton, 
  styled 
} from '@mui/material';

export type SegmentValue = string;

export interface SegmentOption {
  value: SegmentValue;
  label: string;
}

export interface SegmentedButtonProps {
  /**
   * The currently selected value within the group
   */
  value: SegmentValue;
  
  /**
   * The available options to display as segments
   */
  options: SegmentOption[];
  
  /**
   * Callback fired when the value changes
   */
  onChange: (value: SegmentValue) => void;
  
  /**
   * Additional class name for styling
   */
  className?: string;
  
  /**
   * If true, the component is disabled
   */
  disabled?: boolean;
  
  /**
   * The size of the segmented button
   */
  size?: 'small' | 'medium' | 'large';
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  borderRadius: '4px',
  backgroundColor: 'transparent',
  '& .MuiToggleButtonGroup-grouped': {
    border: '1px solid rgba(76, 78, 100, 0.5)',
    borderRadius: 0,
    '&:first-of-type': {
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
    '&:last-of-type': {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  }
}));

const StyledToggleButton = styled(ToggleButton)(() => ({
  textTransform: 'none',
  fontFamily: 'Roboto, sans-serif',
  width: '150px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  letterSpacing: '0.1px',
  height: '30px',
  padding: '10px 12px',
  color: 'rgba(76, 78, 100, 0.87)',
  '&.Mui-selected': {
    backgroundColor: 'rgba(43, 51, 65, 1)',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(43, 51, 65, 0.9)',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

/**
 * SegmentedButton component for toggling between different options in a grouped button layout.
 * This component is designed for selecting between mutually exclusive options in a compact space.
 * 
 * @example
 * ```tsx
 * const [viewMode, setViewMode] = useState('physical');
 * 
 * <SegmentedButton
 *   value={viewMode}
 *   options={[
 *     { value: 'physical', label: 'Physical' },
 *     { value: 'virtual', label: 'Virtual' }
 *   ]}
 *   onChange={(value) => setViewMode(value)}
 * />
 * ```
 */
export const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  value,
  options,
  onChange,
  className,
  disabled = false,
  size = 'medium',
}) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    // Prevent deselection
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="segmented button"
      className={className}
      disabled={disabled}
      size={size}
    >
      {options.map((option) => (
        <StyledToggleButton 
          key={option.value} 
          value={option.value}
          aria-label={option.label}
        >
          {option.label}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
};

export default SegmentedButton;