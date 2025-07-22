export interface AddTrayBlockProps {
  /**
   * The slot number displayed in the badge
   */
  slotNumber: number | string;
  
  /**
   * Optional handler for when the Add Tray button is clicked
   */
  onAddTrayClick?: () => void;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}