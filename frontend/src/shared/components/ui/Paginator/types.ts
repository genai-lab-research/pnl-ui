export interface PaginatorProps {
  /**
   * Current page number (starting from 1)
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Callback function when page is changed
   */
  onPageChange: (page: number) => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
}