import React from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

export interface ResponsiveContainerProps extends BoxProps {
  /**
   * The maximum width of the container at different breakpoints.
   * If not provided, defaults to Material UI's container widths.
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  
  /**
   * Whether to apply padding to the container.
   * @default true
   */
  disablePadding?: boolean;
  
  /**
   * The content to be wrapped by the container.
   */
  children: React.ReactNode;
}

const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disablePadding' && prop !== 'maxWidth',
})<{ disablePadding?: boolean; maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false }>(
  ({ theme, disablePadding, maxWidth }) => ({
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: disablePadding ? 0 : theme.spacing(2),
    
    [theme.breakpoints.up('xs')]: {
      maxWidth: maxWidth === 'xs' ? '100%' : undefined,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: maxWidth === 'xs' ? '600px' : 
               maxWidth === 'sm' ? '600px' : undefined,
      padding: disablePadding ? 0 : theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: maxWidth === 'xs' ? '600px' : 
               maxWidth === 'sm' ? '600px' : 
               maxWidth === 'md' ? '900px' : undefined,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: maxWidth === 'xs' ? '600px' : 
               maxWidth === 'sm' ? '600px' : 
               maxWidth === 'md' ? '900px' : 
               maxWidth === 'lg' ? '1200px' : undefined,
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: maxWidth === 'xs' ? '600px' : 
               maxWidth === 'sm' ? '600px' : 
               maxWidth === 'md' ? '900px' : 
               maxWidth === 'lg' ? '1200px' : 
               maxWidth === 'xl' ? '1400px' : undefined,
    },
  })
);

/**
 * ResponsiveContainer component provides a responsive container with appropriate
 * max-width and padding at different breakpoints.
 *
 * @component
 * @example
 * ```tsx
 * <ResponsiveContainer maxWidth="md">
 *   <Typography>Content goes here</Typography>
 * </ResponsiveContainer>
 * ```
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer maxWidth="lg" disablePadding>
 *   <Typography>Content with no padding</Typography>
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  maxWidth = 'lg',
  disablePadding = false,
  children,
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      disablePadding={disablePadding}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default ResponsiveContainer;