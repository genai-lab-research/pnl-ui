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

/**
 * Format timestamp to readable date string
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format date range to readable string
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const format = { month: 'short', day: 'numeric', year: 'numeric' } as const;
  return `${start.toLocaleDateString('en-US', format)} - ${end.toLocaleDateString('en-US', format)}`;
}

/**
 * Format date to "time ago" string (e.g., "2 hours ago", "3 days ago")
 */
export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'just now';
}