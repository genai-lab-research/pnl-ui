import React from 'react';
import { Box, BoxProps, styled } from '@mui/material';
import Button from '../Button/Button';

export interface FooterContainerProps extends Omit<BoxProps, 'children'> {
  /**
   * Primary action button label. If not provided, the primary button will not be shown.
   */
  primaryActionLabel?: string;
  
  /**
   * Secondary action button label (usually "Close" or "Cancel").
   * If not provided, the secondary button will not be shown.
   */
  secondaryActionLabel?: string;
  
  /**
   * Handler for the primary action button.
   */
  onPrimaryAction?: () => void;
  
  /**
   * Handler for the secondary action button.
   */
  onSecondaryAction?: () => void;
  
  /**
   * If true, the primary action button will be disabled.
   * @default false
   */
  primaryActionDisabled?: boolean;
  
  /**
   * If true, the secondary action button will be disabled.
   * @default false
   */
  secondaryActionDisabled?: boolean;
  
  /**
   * Additional content to display in the footer container.
   */
  children?: React.ReactNode;
}

const StyledFooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.2), 0px 0px 8px 4px rgba(0, 0, 0, 0.1)',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  gap: '16px',
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  flex: 1,
});

/**
 * A container component for page footer actions, typically used for form or dialog actions.
 * 
 * @component
 * @example
 * ```tsx
 * <FooterContainer
 *   primaryActionLabel="Provision & Print ID"
 *   secondaryActionLabel="Close"
 *   onPrimaryAction={() => console.log('Provision action')}
 *   onSecondaryAction={() => console.log('Close action')}
 * />
 * ```
 */
export const FooterContainer: React.FC<FooterContainerProps> = ({
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionDisabled = false,
  secondaryActionDisabled = false,
  children,
  ...props
}) => {
  return (
    <StyledFooterContainer {...props}>
      {children && <Box flex={1}>{children}</Box>}
      
      <ButtonContainer>
        {secondaryActionLabel && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={onSecondaryAction}
            disabled={secondaryActionDisabled}
          >
            {secondaryActionLabel}
          </Button>
        )}
        
        {primaryActionLabel && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onPrimaryAction}
            disabled={primaryActionDisabled}
            sx={{
              backgroundColor: '#3545EE',
              '&:hover': {
                backgroundColor: '#2B39C7',
              },
            }}
          >
            {primaryActionLabel}
          </Button>
        )}
      </ButtonContainer>
    </StyledFooterContainer>
  );
};

export default FooterContainer;