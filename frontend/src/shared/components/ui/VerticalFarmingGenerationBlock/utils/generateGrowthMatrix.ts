import { CropStatus } from '../types';

/**
 * Generates a growth status matrix for the VerticalFarmingGenerationBlock
 * 
 * @param rows Number of rows in the matrix (default: 12)
 * @param columns Number of columns in the matrix (default: 21)
 * @param progressPercentage The growth progress percentage (0-100)
 * @returns A 2D array representing the growth status matrix
 */
export const generateGrowthMatrix = (
  rows: number = 12,
  columns: number = 21,
  progressPercentage: number
): CropStatus[][] => {
  // Create an empty matrix
  const matrix: CropStatus[][] = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(null).map(() => ({ status: 'empty' })));
  
  // Calculate how many rows should be filled based on progress
  const filledRows = Math.floor((progressPercentage / 100) * rows);
  
  // Fill rows with sprouts based on progress
  for (let i = 0; i < filledRows; i++) {
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = { status: 'sprout' };
    }
  }
  
  // Add some random not-ok cells to show some issues in the growth
  if (filledRows > 0) {
    const notOkRowStart = Math.max(0, filledRows - 2);
    const notOkRowEnd = filledRows;
    
    for (let i = notOkRowStart; i < notOkRowEnd; i++) {
      // Add not-ok status to some random cells (about 20% of the cells)
      for (let j = 0; j < columns; j++) {
        if (Math.random() < 0.2) {
          matrix[i][j] = { status: 'not-ok' };
        }
      }
    }
  }
  
  return matrix;
};