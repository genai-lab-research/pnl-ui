/**
 * Types for the ContainerGenerationBlock component
 */

export type StatusType = 'active' | 'inactive' | 'error' | 'warning';

export interface ContainerGenerationBlockProps {
  /**
   * The icon to display at the beginning of the block
   */
  icon?: React.ReactNode;
  
  /**
   * The label text to display
   */
  label: string;
  
  /**
   * The status of the generation block
   */
  status: {
    label: string;
    type: StatusType;
  };
  
  /**
   * Optional className for additional styling
   */
  className?: string;
}