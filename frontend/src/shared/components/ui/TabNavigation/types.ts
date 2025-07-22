export interface TabItem {
  id: string;
  label: string;
}

export interface TabNavigationProps {
  /**
   * Array of tab items to be displayed
   */
  tabs: TabItem[];
  /**
   * The active tab id
   */
  activeTabId: string;
  /**
   * Callback function when a tab is clicked
   */
  onTabChange: (tabId: string) => void;
}
