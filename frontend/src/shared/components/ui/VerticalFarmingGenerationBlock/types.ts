export interface CropStatus {
  status: 'sprout' | 'empty' | 'not-ok';
}

export interface VerticalFarmingGenerationBlockProps {
  /**
   * The slot number for the generation block
   */
  slotNumber: number;

  /**
   * The tray ID
   */
  trayId: string;

  /**
   * Growth progress percentage (0-100)
   */
  progressPercentage: number;

  /**
   * Grid size information (e.g., "10×20 Grid")
   */
  gridSize: string;

  /**
   * Number of crops in the tray
   */
  cropCount: number;

  /**
   * Growth status matrix (20 rows x 10 dots)
   * Each array represents a row of status dots
   */
  growthStatusMatrix: CropStatus[][];

  /**
   * Optional className for additional styling
   */
  className?: string;
}