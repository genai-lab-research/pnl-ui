import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface PreviousButtonProps extends Omit<MuiButtonProps, 'color' | 'variant'> {
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will display without the back arrow icon.
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

const StyledPreviousButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'hideIcon' && prop !== 'buttonColor',
})<{ hideIcon?: boolean; buttonColor?: 'primary' | 'secondary' }>(({ theme, hideIcon, buttonColor }) => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0.4px',
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: buttonColor === 'primary' ? theme.palette.primary.main : '#4C4E64',
  border: `1px solid ${buttonColor === 'primary' ? theme.palette.primary.main : '#4C4E64'}`,
  borderRadius: '4px',
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: hideIcon ? '0' : '8px',
  '& .MuiButton-startIcon': {
    marginRight: hideIcon ? '0' : '8px',
  },
  '& svg': {
    fontSize: '20px',
  },
  '&:hover': {
    backgroundColor: buttonColor === 'primary' 
      ? theme.palette.primary.main + '0A' // 4% opacity
      : 'rgba(76, 78, 100, 0.04)',
    border: `1px solid ${buttonColor === 'primary' ? theme.palette.primary.main : '#4C4E64'}`,
    boxShadow: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: buttonColor === 'primary'
      ? theme.palette.primary.main + '14' // 8% opacity
      : 'rgba(76, 78, 100, 0.08)',
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    opacity: 0.26,
    backgroundColor: 'transparent',
    color: '#4C4E64',
    border: '1px solid rgba(76, 78, 100, 0.12)',
  },
  '@media (max-width: 600px)': {
    width: '100%',
  },
}));

/**
 * Previous Button component used for navigation to the previous screen/step.
 * Based on Material UI Button with customized styling.
 * 
 * @component
 * @example
 * ```tsx
 * <PreviousButton>Previous</PreviousButton>
 * <PreviousButton disabled>Previous</PreviousButton>
 * <PreviousButton onClick={handlePrevious}>Previous</PreviousButton>
 * <PreviousButton hideIcon>Back</PreviousButton>
 * <PreviousButton color="primary" variant="contained">Previous</PreviousButton>
 * ```
 */
export const PreviousButton: React.FC<PreviousButtonProps> = ({
  disabled = false,
  fullWidth = false,
  hideIcon = false,
  variant = 'outlined',
  color = 'secondary',
  children = 'Previous',
  ...props
}) => {
  return (
    <StyledPreviousButton
      variant={variant}
      disableElevation
      disabled={disabled}
      fullWidth={fullWidth}
      hideIcon={hideIcon}
      buttonColor={color}
      startIcon={!hideIcon ? <ArrowBackIcon /> : null}
      {...props}
    >
      {children}
    </StyledPreviousButton>
  );
};

export default PreviousButton;