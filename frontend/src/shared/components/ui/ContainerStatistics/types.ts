export interface ContainerStatisticsProps {
  /**
   * Title of the container statistics block
   */
  title: string;
  /**
   * Number of containers
   */
  containerCount: number;
  /**
   * Yield data
   */
  yieldData: {
    /**
     * Average yield in kg
     */
    average: number;
    /**
     * Total yield in kg
     */
    total: number;
    /**
     * Daily yield data
     */
    dailyData: number[];
  };
  /**
   * Space utilization data
   */
  spaceUtilization: {
    /**
     * Average space utilization percentage
     */
    average: number;
    /**
     * Daily space utilization data in percentage
     */
    dailyData: number[];
  };
  /**
   * Day labels for the x-axis
   */
  dayLabels?: string[];
}
