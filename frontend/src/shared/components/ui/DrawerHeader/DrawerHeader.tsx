import React from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface DrawerHeaderProps {
  /**
   * The title to display in the drawer header
   */
  title: string;
  
  /**
   * Optional callback function when the close button is clicked
   */
  onClose?: () => void;
  
  /**
   * Optional additional class name
   */
  className?: string;
}

const StyledDrawerHeader = styled(Box)(() => ({
  fontFamily: 'Roboto, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0',
  marginBottom: 16
}));

const StyledTitle = styled(Typography)(() => ({
  fontFamily: 'Roboto, sans-serif',
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: '36px',
  letterSpacing: '-0.75px',
  color: '#000000',
}));

const StyledDivider = styled(Box)(() => ({
  width: '100%',
  height: '1px',
  backgroundColor: '#E0E0E0',
  marginTop: 16
}));

/**
 * DrawerHeader component for displaying a header in drawer components
 * with a title and close button.
 * 
 * @component
 * @example
 * ```tsx
 * <DrawerHeader
 *   title="Create New Container"
 *   onClose={() => setOpen(false)}
 * />
 * ```
 */
export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  title,
  onClose,
  className,
}) => {
  return (
    <Box className={className}>
      <StyledDrawerHeader>
        <StyledTitle variant="h2">{title}</StyledTitle>
        <IconButton 
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{
            padding: 0,
            color: '#323232',
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDrawerHeader>
      <StyledDivider />
    </Box>
  );
};

export default DrawerHeader;