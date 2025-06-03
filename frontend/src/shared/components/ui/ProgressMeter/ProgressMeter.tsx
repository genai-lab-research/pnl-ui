import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export interface ProgressMeterProps {
  /** Progress value in percentage (0-100) */
  value: number;
  /** Max width of the progress bar in pixels */
  width?: number;
  /** If true, will disable the entire component with reduced opacity */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

const ProgressContainer = styled(Box)<{ $disabled?: boolean }>(({ $disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  opacity: $disabled ? 0.5 : 1,
}));

const ProgressLabel = styled(Typography)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '28px',
  textTransform: 'uppercase',
  color: '#000000',
}));

const ProgressBarContainer = styled(Box)(() => ({
  position: 'relative',
  height: '12px',
  borderRadius: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const ProgressBarFill = styled(Box)<{ $width: string }>(({ $width }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: $width,
  borderRadius: '10px',
  background: '#30CA45', // The green color from the reference design
  transition: 'width 0.3s ease-in-out',
}));

/**
 * ProgressMeter component displays a percentage value alongside a visual progress bar.
 * 
 * @component
 * @example
 * ```tsx
 * <ProgressMeter value={75} width={200} />
 * ```
 */
export const ProgressMeter: React.FC<ProgressMeterProps> = ({
  value,
  width = 200,
  disabled = false,
  className,
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  // Calculate progress bar fill width
  const fillWidth = `${normalizedValue}%`;

  return (
    <ProgressContainer $disabled={disabled} className={className}>
      <ProgressLabel>{`${normalizedValue}%`}</ProgressLabel>
      <ProgressBarContainer sx={{ width: `${width}px` }}>
        <ProgressBarFill $width={fillWidth} />
      </ProgressBarContainer>
    </ProgressContainer>
  );
};

export default ProgressMeter;