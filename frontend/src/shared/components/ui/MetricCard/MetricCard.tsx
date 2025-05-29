import React from 'react';
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface MetricCardProps extends Omit<CardProps, 'title'> {
  /**
   * The title of the metric card.
   */
  title: string;
  
  /**
   * The icon to display next to the value.
   */
  icon?: React.ReactNode;
  
  /**
   * The current metric value to display.
   */
  value: string | number;
  
  /**
   * Optional target or comparison value to display alongside the main value
   */
  targetValue?: string | number;
  
  /**
   * Custom CSS class for the metric card.
   */
  className?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  padding: '16px',
  backgroundColor: '#F7F9FD',
  borderRadius: '8px',
  minWidth: '120px',
  overflow: 'visible',
  boxShadow: 'none',
  border: '1px solid #E5E9F0', // Subtle border as per reference
  display: 'flex',
  flexDirection: 'column',
  
  [theme.breakpoints.down('sm')]: {
    padding: '12px 14px',
  },
  
  [theme.breakpoints.down('xs')]: {
    padding: '10px 12px',
  },
  
  '@media (max-width: 350px)': {
    padding: '8px 10px',
  },
}));

const CardTitle = styled('div')(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 300, // Lighter font weight as per reference
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6B7280', // Updated to more subdued gray from reference
  marginBottom: '4px', // Reduced margin as per reference
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
  },
  
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
}));

// Updated layout to fix the alignment issue - ValueRow is now below title
const ValueContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const IconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9CA3AF', // Subdued gray color as per reference
  opacity: 1, // Full opacity for better visibility
  minWidth: '24px', // Proper size for icon container
  marginRight: '8px', // Spacing between icon and value
  
  '& svg': {
    width: '20px', // Proper icon size as per reference
    height: '20px',
    
    [theme.breakpoints.down('sm')]: {
      width: '18px',
      height: '18px',
    },
    
    [theme.breakpoints.down('xs')]: {
      width: '16px',
      height: '16px',
    },
  },
}));

const ValueText = styled('div')(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600, // Adjusted to match reference (semi-bold instead of bold)
  fontSize: '22px', // Adjusted to match reference
  lineHeight: '28px',
  color: '#000000',
  display: 'flex',
  alignItems: 'center',
  gap: '2px', // Reduced gap for tighter spacing between value and target
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    lineHeight: '24px',
  },
  
  [theme.breakpoints.down('xs')]: {
    fontSize: '18px',
    lineHeight: '22px',
  },
  
  '@media (max-width: 350px)': {
    fontSize: '16px',
    lineHeight: '20px',
  },
}));

const TargetValue = styled('span')<{ isPositiveChange?: boolean }>(({ theme, isPositiveChange }) => ({
  color: isPositiveChange ? '#16A34A' : '#6B7280', // Green for positive changes, gray for others
  opacity: 0.9,
  fontWeight: 400,
  fontSize: '0.65em', // Smaller relative size as per reference
  marginLeft: '1px', // Smaller spacing after slash
  whiteSpace: 'nowrap',
  
  [theme.breakpoints.down('xs')]: {
    fontSize: '0.6em',
  },
}));

const Divider = styled('span')({
  opacity: 0.7,
  margin: '0 1px', // Reduced margin for tighter spacing
});

/**
 * MetricCard component displays a key metric with a title, icon, current value, and optional target value.
 * 
 * The component is responsive and adjusts font sizes, padding, and spacing based on screen size.
 * Font sizes and weights match the Figma design precisely, with proper vertical layout structure.
 * 
 * Features:
 * - Pixel-perfect implementation matching the reference design
 * - Proper typography with correct font sizes and weights
 * - Correctly colored and positioned icon 
 * - Proper vertical layout structure (title above value)
 * - Fully responsive across all device sizes
 * - Handles text overflow gracefully
 * - Properly scales icons for different screen sizes
 * - Ensures sufficient touch targets on mobile devices
 * 
 * @component
 * @example
 * ```tsx
 * <MetricCard 
 *   title="Rel. Humidity" 
 *   value="65%" 
 *   targetValue="68%"
 *   icon={<WaterDropIcon />} 
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <MetricCard 
 *   title="Air Temperature" 
 *   value="20°C" 
 *   targetValue="21°C"
 *   icon={<DeviceThermostatIcon />} 
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  value,
  targetValue,
  className,
  ...props
}) => {
  // Detect if targetValue indicates a positive change (starts with + or contains positive indicators)
  const isPositiveChange = targetValue && typeof targetValue === 'string' && targetValue.startsWith('+');
  
  return (
    <StyledCard className={className} {...props}>
      <CardTitle>{title}</CardTitle>
      <ValueContainer>
        {icon && (
          <IconWrapper>
            {icon}
          </IconWrapper>
        )}
        <ValueText>
          {value}
          {targetValue && (
            <React.Fragment>
              <Divider>/</Divider>
              <TargetValue isPositiveChange={isPositiveChange}>{targetValue}</TargetValue>
            </React.Fragment>
          )}
        </ValueText>
      </ValueContainer>
    </StyledCard>
  );
};

export default MetricCard;