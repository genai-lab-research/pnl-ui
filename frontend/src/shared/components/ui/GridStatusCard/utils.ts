import { GridItem, GridItemStatus } from './types';

/**
 * Generates a default grid data structure
 * @param rows - Number of rows in the grid
 * @param cols - Number of columns in the grid
 * @param fillRatio - Ratio of active items (0-1)
 * @returns 2D array of GridItem objects
 */
export const generateDefaultGrid = (
  rows: number,
  cols: number,
  fillRatio: number = 0.85
): GridItem[][] => {
  const grid: GridItem[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: GridItem[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        id: `${i}-${j}`,
        status: Math.random() > (1 - fillRatio) ? 'active' : 'inactive',
      });
    }
    grid.push(row);
  }
  
  return grid;
};

/**
 * Calculates the number of items with a specific status
 * @param gridData - 2D array of GridItem objects
 * @param status - Status to count
 * @returns Number of items with the specified status
 */
export const countItemsByStatus = (
  gridData: GridItem[][],
  status: GridItemStatus = 'active'
): number => {
  return gridData.flat().filter(item => item.status === status).length;
};

/**
 * Formats grid dimensions for display
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns Formatted string (e.g., "10 × 20 Grid")
 */
export const formatGridDimensions = (rows: number, cols: number): string => {
  return `${rows} × ${cols} Grid`;
};

/**
 * Gets the default color for a grid item status
 * @param status - Grid item status
 * @param customColors - Optional custom color map
 * @returns Color string
 */
export const getStatusColor = (
  status: GridItemStatus,
  customColors?: Record<string, string>
): string => {
  const defaultColors = {
    active: '#2FCA44',
    inactive: '#EAEDF4',
    pending: '#FFA500',
    warning: '#FFD700',
    error: '#FF4444',
    custom: '#49454F',
  };
  
  return customColors?.[status] || defaultColors[status] || defaultColors.inactive;
};