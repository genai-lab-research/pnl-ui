export interface SearchFiltersProps {
  /**
   * Callback function triggered when search value changes
   */
  onSearchChange?: (value: string) => void;
  
  /**
   * Callback function triggered when type filter changes
   */
  onTypeChange?: (value: string) => void;
  
  /**
   * Callback function triggered when tenant filter changes
   */
  onTenantChange?: (value: string) => void;
  
  /**
   * Callback function triggered when purpose filter changes
   */
  onPurposeChange?: (value: string) => void;
  
  /**
   * Callback function triggered when status filter changes
   */
  onStatusChange?: (value: string) => void;
  
  /**
   * Callback function triggered when the alerts filter changes
   */
  onAlertsChange?: (hasAlerts: boolean) => void;
  
  /**
   * Callback function triggered when clear filters button is clicked
   */
  onClearFilters?: () => void;
  
  /**
   * Initial search value
   */
  searchValue?: string;
  
  /**
   * Array of available types for the type filter
   */
  types?: string[];
  
  /**
   * Selected type value
   */
  selectedType?: string;
  
  /**
   * Array of available tenants for the tenant filter
   */
  tenants?: string[];
  
  /**
   * Selected tenant value
   */
  selectedTenant?: string;
  
  /**
   * Array of available purposes for the purpose filter
   */
  purposes?: string[];
  
  /**
   * Selected purpose value
   */
  selectedPurpose?: string;
  
  /**
   * Array of available statuses for the status filter
   */
  statuses?: string[];
  
  /**
   * Selected status value
   */
  selectedStatus?: string;
  
  /**
   * Flag indicating if alerts filter is enabled
   */
  hasAlerts?: boolean;
}