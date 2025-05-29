import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, GridProps } from '@mui/material';

export interface ResponsiveGridProps extends GridProps {
  /**
   * The spacing between grid items.
   * @default 2
   */
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  
  /**
   * The number of columns the grid should have at different breakpoints.
   * @default { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }
   */
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  
  /**
   * The content to be displayed in the grid.
   */
  children: React.ReactNode;
  
  /**
   * Additional CSS class for the grid.
   */
  className?: string;
}

const StyledGrid = styled(Grid)(() => ({
  width: '100%',
  margin: 0,
}));

/**
 * ResponsiveGrid component provides a responsive grid layout with configurable
 * spacing and column counts at different breakpoints.
 *
 * @component
 * @example
 * ```tsx
 * <ResponsiveGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
 *   <GridItem>Item 1</GridItem>
 *   <GridItem>Item 2</GridItem>
 *   <GridItem>Item 3</GridItem>
 * </ResponsiveGrid>
 * ```
 * 
 * @example
 * ```tsx
 * <ResponsiveGrid columns={2} spacing={{ xs: 1, sm: 2, md: 3 }}>
 *   <GridItem>Item 1</GridItem>
 *   <GridItem>Item 2</GridItem>
 * </ResponsiveGrid>
 * ```
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  spacing = 2,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  children,
  className,
  ...props
}) => {
  // Process spacing prop
  const spacingProps = typeof spacing === 'number'
    ? { xs: spacing }
    : spacing;
  
  // Process columns prop
  const columnsConfig = typeof columns === 'number'
    ? { xs: columns }
    : columns;
  
  return (
    <StyledGrid container spacing={spacingProps} className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        
        // Calculate grid sizes based on columns config
        const gridItemProps = {
          xs: columnsConfig.xs ? 12 / columnsConfig.xs : undefined,
          sm: columnsConfig.sm ? 12 / columnsConfig.sm : undefined,
          md: columnsConfig.md ? 12 / columnsConfig.md : undefined,
          lg: columnsConfig.lg ? 12 / columnsConfig.lg : undefined,
          xl: columnsConfig.xl ? 12 / columnsConfig.xl : undefined,
        };
        
        return (
          <Grid item {...gridItemProps}>
            {child}
          </Grid>
        );
      })}
    </StyledGrid>
  );
};

export default ResponsiveGrid;