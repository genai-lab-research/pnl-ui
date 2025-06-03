import React from 'react';
import { Paper, Typography, useTheme } from '@mui/material';

export interface TrayValueProps {
  /**
   * The numerical value to display
   */
  value: number | string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional background color override
   */
  backgroundColor?: string;
  /**
   * Optional text color override
   */
  textColor?: string;
  /**
   * Optional width of the component
   */
  width?: number | string;
  /**
   * Optional height of the component
   */
  height?: number | string;
}

/**
 * TrayValue component displays a small numerical value in a compact pill-shaped container.
 * 
 * The component is designed to show small numerical values with precise styling,
 * maintaining the exact appearance from the design. It features a subtle shadow
 * and border to give it depth while keeping a minimal footprint.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <TrayValue value={0.0004} />
 * 
 * // With custom colors
 * <TrayValue 
 *   value={0.0004} 
 *   backgroundColor="#f0f0f0" 
 *   textColor="#333333" 
 * />
 * 
 * // With custom sizing
 * <TrayValue value={0.0004} width={50} height={20} />
 * ```
 */
export const TrayValue: React.FC<TrayValueProps> = ({
  value,
  className,
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  width = 'auto',
  height = 20,
}) => {
  // Using theme for consistency with Material UI
  const muiTheme = useTheme();
  
  return (
    <Paper
      sx={{
        width,
        height: typeof height === 'number' ? `${height}px` : height,
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 6px',
        borderRadius: '4px',
        border: `1px solid #CCCCCC`,
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
      className={className}
      elevation={0}
    >
      <Typography 
        component="span"
        sx={{
          fontFamily: muiTheme.typography.fontFamily,
          fontSize: '8px',
          fontWeight: 500,
          lineHeight: '14px',
          color: textColor,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
};

export default TrayValue;