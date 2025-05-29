import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface NextButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If `true`, the button will display without the forward arrow icon.
   * @default false
   */
  hideIcon?: boolean;
  
  /**
   * Variant of the button.
   * @default 'outlined'
   */
  variant?: 'outlined' | 'contained' | 'text';
  
  /**
   * Color variant of the button.
   * @default 'secondary'
   */
  color?: 'primary' | 'secondary';
}

const StyledNextButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'hideIcon' && prop !== 'buttonColor',
})<{ hideIcon?: boolean; buttonColor?: 'primary' | 'secondary' }>(({ theme, hideIcon }) => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: '#6C778D', // Color from the provided image
  border: '1px solid rgba(109, 120, 141, 0.5)', // Border with opacity from the provided image
  borderRadius: '4px',
  boxShadow: 'none',
  // Display properties for alignment
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: hideIcon ? '0' : '8px',
  '& .MuiButton-endIcon': {
    marginLeft: hideIcon ? '0' : '8px',
    display: 'flex',
    alignItems: 'center',
  },
  '& svg': {
    fontSize: '20px',
  },
  '&:hover': {
    backgroundColor: 'rgba(108, 119, 141, 0.04)',
    border: '1px solid #6C778D',
    boxShadow: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: 'rgba(108, 119, 141, 0.08)',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    opacity: 0.26,
    backgroundColor: 'transparent',
    color: '#6C778D',
    border: '1px solid rgba(108, 119, 141, 0.12)',
  },
  // Responsive styles based on breakpoints
  [theme.breakpoints.down('sm')]: {
    width: '100%', // Full width on small screens
    padding: '10px 16px', // Slightly more padding for better touch targets
    fontSize: '14px',
  },
  // Size constraints for better UI
  minHeight: '40px', // Ensure consistent height
  minWidth: '80px', // Minimum width for better proportions
}));

/**
 * Next Button component used for navigation to the next screen/step.
 * Based on Material UI Button with customized styling.
 * 
 * @component
 * @example
 * ```tsx
 * <NextButton>Next</NextButton>
 * <NextButton disabled>Next</NextButton>
 * <NextButton onClick={handleNext}>Next</NextButton>
 * <NextButton hideIcon>Continue</NextButton>
 * <NextButton color="primary" variant="contained">Next</NextButton>
 * ```
 */
export const NextButton: React.FC<NextButtonProps> = ({
  disabled = false,
  fullWidth = false,
  hideIcon = false,
  variant = 'outlined',
  color = 'secondary',
  children = 'Next',
  ...props
}) => {
  return (
    <StyledNextButton
      variant={variant}
      disableElevation
      disabled={disabled}
      fullWidth={fullWidth}
      hideIcon={hideIcon}
      buttonColor={color}
      endIcon={!hideIcon ? <ArrowForwardIcon /> : null}
      {...props}
    >
      {children}
    </StyledNextButton>
  );
};

export default NextButton;