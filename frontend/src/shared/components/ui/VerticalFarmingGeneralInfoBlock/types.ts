export interface VerticalFarmingGeneralInfoBlockProps {
  /**
   * Title text to display in the block
   */
  title: string;

  /**
   * Whether the block is expanded or collapsed
   */
  isExpanded?: boolean;

  /**
   * Callback function triggered when the block is clicked
   */
  onClick?: () => void;

  /**
   * Optional className for additional styling
   */
  className?: string;
}
