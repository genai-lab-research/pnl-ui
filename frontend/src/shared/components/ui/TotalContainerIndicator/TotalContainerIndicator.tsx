import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TotalContainerIndicatorProps {
  /**
   * The total count value to display
   * @default 1
   */
  value?: number | string;

  /**
   * Class name to apply to the component
   */
  className?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[200]}`, // E4E4E7 from Figma
  borderRadius: '4px',
  width: '100%',
  height: '110px',
  display: 'flex',
  flexDirection: 'column',
  
  // Responsive adjustments
  [theme.breakpoints.down('lg')]: {
    height: '100px',
  },
  [theme.breakpoints.down('md')]: {
    height: '90px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '80px',
  }
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2), // Match padding from Figma
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  
  // Responsive padding adjustments
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  }
}));

const LabelContainer = styled(Box)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.grey[600], // 71717A from Figma
  marginBottom: theme.spacing(1),
  
  // Keep the label readable on small devices
  [theme.breakpoints.down('sm')]: {
    fontSize: '13px',
    lineHeight: '18px',
    marginBottom: theme.spacing(0.5),
  }
}));

const ValueContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  overflow: 'hidden', // Prevent overflow for very large numbers
  
  // Adjust padding for smaller screens
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(0.5),
  }
}));

const ValueText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700, // Bold as seen in Figma
  fontSize: '23.625px', // Exact size from Figma
  lineHeight: '32px', // Line height from Figma
  letterSpacing: 0,
  color: '#0F1729', // Exact color from Figma
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis', // Add ellipsis for very large numbers
  maxWidth: '100%', // Ensure text doesn't overflow container
  
  // Responsive font size adjustments
  [theme.breakpoints.down('md')]: {
    fontSize: '22px',
    lineHeight: '30px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    lineHeight: '28px',
  }
}));

/**
 * TotalContainerIndicator component
 * 
 * Displays the total number of containers in a card format with a label.
 * This component is fully responsive and adapts to different screen sizes
 * while maintaining a visually appealing appearance.
 * 
 * @component
 * @example
 * ```tsx
 * <TotalContainerIndicator value={1} />
 * <TotalContainerIndicator value={42} />
 * ```
 * 
 * ## Responsive Behavior
 * - Desktop (≥1200px): Full size with 23.625px value font size
 * - Large tablets (900px-1199px): Slightly reduced height with 22px value font size
 * - Small tablets (600px-899px): Further height reduction with smaller spacing
 * - Mobile (<600px): Compact presentation optimized for small screens
 * 
 * The component maintains its clean, readable appearance across all device sizes
 * while preserving the visual hierarchy between label and value.
 */
export const TotalContainerIndicator: React.FC<TotalContainerIndicatorProps> = ({
  value = 1,
  className,
}) => {
  return (
    <StyledCard className={className}>
      <StyledCardContent>
        <LabelContainer>
          Total Containers
        </LabelContainer>
        <ValueContainer>
          <ValueText variant="h4" component="div">
            {value}
          </ValueText>
        </ValueContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TotalContainerIndicator;