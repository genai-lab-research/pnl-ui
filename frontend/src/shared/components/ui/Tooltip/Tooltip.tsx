import React from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /**
   * The content to display in the tooltip.
   */
  title: React.ReactNode;
  
  /**
   * The element that triggers the tooltip.
   */
  children: React.ReactElement;
  
  /**
   * The placement of the tooltip.
   * @default 'bottom'
   */
  placement?: TooltipPlacement;
  
  /**
   * If `true`, the tooltip includes an arrow.
   * @default true
   */
  arrow?: boolean;
  
  /**
   * If `true`, the tooltip is shown.
   */
  open?: boolean;
  
  /**
   * Callback fired when the tooltip requests to be open/closed.
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * The number of milliseconds to wait before showing the tooltip.
   * @default 200
   */
  enterDelay?: number;
  
  /**
   * The number of milliseconds to wait before hiding the tooltip.
   * @default 200
   */
  leaveDelay?: number;
  
  /**
   * If `true`, the tooltip will not close when the user hovers over the tooltip.
   * @default false
   */
  disableInteractive?: boolean;
  
  /**
   * Additional class name for the tooltip.
   */
  className?: string;
}

// Custom styled tooltip that matches the design (dark background with white text)
const StyledTooltip = styled(({ className, ...props }: MuiTooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: 'rgba(38, 39, 50, 0.9)', // Dark background from the design (#262732 with 0.9 opacity)
    color: '#FFFFFF',
    padding: theme.spacing(0.75, 1),
    fontSize: 11, // Match the Figma design
    lineHeight: '16px',
    fontWeight: 400,
    fontFamily: 'Roboto, sans-serif', // Match the Figma design
    borderRadius: 4,
    maxWidth: 300, // Prevent tooltips from becoming too wide
    wordBreak: 'break-word', // Ensure text wraps properly
    
    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 0.75),
      fontSize: 10,
    },
  },
  [`& .MuiTooltip-arrow`]: {
    color: 'rgba(38, 39, 50, 0.9)', // Match tooltip background color
    '&::before': {
      backgroundColor: 'rgba(38, 39, 50, 0.9)', // Match tooltip background color
    },
  },
}));

/**
 * Tooltip component displays informative text when users hover over, focus on, or tap an element.
 * 
 * @example
 * ```jsx
 * <Tooltip title="2 days">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'bottom', // Match the design which shows a "down" direction
  arrow = true, // Default to showing the arrow as in the design
  open,
  onOpenChange,
  enterDelay = 200,
  leaveDelay = 200,
  disableInteractive = false,
  className,
}) => {
  // Handler for open/close events if controlled mode is used
  const handleTooltipVisibility = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <StyledTooltip
      title={title}
      arrow={arrow}
      placement={placement}
      open={open}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      disableInteractive={disableInteractive}
      className={className}
      onOpen={() => handleTooltipVisibility(true)}
      onClose={() => handleTooltipVisibility(false)}
    >
      {children}
    </StyledTooltip>
  );
};

export default Tooltip;