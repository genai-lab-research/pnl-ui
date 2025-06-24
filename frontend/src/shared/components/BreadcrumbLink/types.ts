export interface BreadcrumbLinkProps {
  /**
   * The path to display in the breadcrumb link
   * Format: "Parent / Child"
   */
  path: string;
  
  /**
   * Optional className for additional styling
   */
  className?: string;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}