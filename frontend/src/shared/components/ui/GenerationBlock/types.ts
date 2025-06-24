// import { Crop } from '../../../../types/inventory';

export interface GenerationBlockProps {
  /**
   * Slot number displayed in the badge
   */
  slotNumber?: number;
  
  /**
   * Tray ID shown in the header
   */
  trayId?: string;
  
  /**
   * Growth progress percentage (0-100)
   */
  progressPercentage?: number;
  
  /**
   * Number of rows in the growth grid
   */
  gridRows?: number;
  
  /**
   * Number of columns in the growth grid
   */
  gridColumns?: number;
  
  /**
   * Total number of crops to display
   */
  totalCrops?: number;
  
  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Optional handler for crop click
   */
  onCropClick?: (row: number, col: number) => void;

  /**
   * Growth status matrix data
   */
  growthStatusMatrix?: Array<Array<{ status: 'sprout' | 'empty' | 'not-ok' }>>;
}