export type CellStatus = 'healthy' | 'alert' | 'empty';

export interface GrowthMatrix {
  rows: CellStatus[][];
}

/**
 * Generates a matrix representing the growth status of crops
 * 
 * @param rows - Number of rows in the grid
 * @param columns - Number of columns in the grid
 * @param totalCrops - Total number of crops in the tray
 * @param alertPercentage - Percentage of crops that should be in alert status
 * @returns A matrix of cell statuses
 */
export const generateGrowthMatrix = (
  rows: number,
  columns: number,
  totalCrops: number,
  alertPercentage: number = 15
): GrowthMatrix => {
  const matrix: CellStatus[][] = [];
  const totalCells = rows * columns;
  
  // Calculate the number of filled cells (healthy + alert)
  const filledCells = Math.min(totalCrops, totalCells);
  
  // Calculate the number of alert cells
  const alertCells = Math.floor((filledCells * alertPercentage) / 100);
  
  // Calculate the number of healthy cells
  const healthyCells = filledCells - alertCells;
  
  // Generate the matrix
  let healthyRemaining = healthyCells;
  let alertRemaining = alertCells;
  
  for (let i = 0; i < rows; i++) {
    const row: CellStatus[] = [];
    
    for (let j = 0; j < columns; j++) {
      const cellIndex = i * columns + j;
      
      if (cellIndex < healthyCells) {
        row.push('healthy');
        healthyRemaining--;
      } else if (cellIndex < filledCells) {
        row.push('alert');
        alertRemaining--;
      } else {
        row.push('empty');
      }
    }
    
    matrix.push(row);
  }
  
  return { rows: matrix };
};

export default generateGrowthMatrix;