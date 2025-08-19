// Date formatting utilities for charts based on time range

export type TimeRangeType = 'week' | 'month' | 'quarter' | 'year';

/**
 * Format date string for chart X-axis based on time range
 */
export function formatChartLabel(dateString: string, timeRange: TimeRangeType): string {
  const date = new Date(dateString);
  
  switch (timeRange) {
    case 'week':
      // Return day abbreviation (Mon, Tue, Wed, etc.)
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    
    case 'month': {
      // Return day of month for every 2nd day (1, 3, 5, 7, etc.)
      const day = date.getDate();
      return day % 2 === 1 ? day.toString() : '';
    }
    
    case 'quarter':
      // Return month abbreviation (Jan, Feb, Mar)
      return date.toLocaleDateString('en-US', { month: 'short' });
    
    case 'year':
      // Return month name for yearly view
      return date.toLocaleDateString('en-US', { month: 'short' });
    
    default:
      return dateString;
  }
}

/**
 * Format chart data with proper labels based on time range
 */
export function formatChartData(
  chartData: Array<{ date: string; value: number; is_current_period: boolean }>,
  timeRange: TimeRangeType
): Array<{ day: string; value: number; isCurrent?: boolean }> {
  return chartData.map((item) => ({
    day: formatChartLabel(item.date, timeRange),
    value: item.value,
    isCurrent: item.is_current_period,
  }));
}