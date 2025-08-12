/**
 * Date formatting and manipulation utilities
 */

import type { TimePeriod } from '../types/container-detail';

// Format date for display
export function formatDate(date: Date | string | null, format: 'short' | 'long' | 'relative' = 'short'): string {
  if (!date) {
    return '-';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'relative':
      return formatRelativeTime(dateObj);
    
    default:
      return dateObj.toLocaleDateString();
  }
}

// Format time
export function formatTime(date: Date | string, includeSeconds: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
  });
}

// Format datetime
export function formatDateTime(date: Date | string, includeSeconds: boolean = false): string {
  const dateStr = formatDate(date, 'short');
  const timeStr = formatTime(date, includeSeconds);
  return `${dateStr} ${timeStr}`;
}

// Format relative time (e.g., "2 hours ago", "in 3 days")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    // Future date
    const futureDiffMs = Math.abs(diffMs);
    const futureDiffMinutes = Math.floor(futureDiffMs / (1000 * 60));
    const futureDiffHours = Math.floor(futureDiffMinutes / 60);
    const futureDiffDays = Math.floor(futureDiffHours / 24);

    if (futureDiffDays > 0) {
      return `in ${futureDiffDays} day${futureDiffDays > 1 ? 's' : ''}`;
    } else if (futureDiffHours > 0) {
      return `in ${futureDiffHours} hour${futureDiffHours > 1 ? 's' : ''}`;
    } else if (futureDiffMinutes > 0) {
      return `in ${futureDiffMinutes} minute${futureDiffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'in a moment';
    }
  }

  // Past date
  if (diffDays > 7) {
    return formatDate(dateObj, 'short');
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffSeconds > 0) {
    return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

// Get date range for time period
export function getDateRangeForPeriod(period: TimePeriod): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  return { startDate, endDate };
}

// Format date range
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = formatDate(startDate, 'short');
  const end = formatDate(endDate, 'short');
  return `${start} - ${end}`;
}

// Check if date is today
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
}

// Check if date is yesterday
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.toDateString() === yesterday.toDateString();
}

// Check if date is in current week
export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return dateObj >= weekStart && dateObj <= weekEnd;
}

// Get days between dates
export function daysBetween(date1: Date, date2: Date): number {
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Format duration
export function formatDuration(startDate: Date, endDate: Date): string {
  const days = daysBetween(startDate, endDate);
  
  if (days === 0) {
    const hours = Math.floor(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
}

// Get time period label
export function getTimePeriodLabel(period: TimePeriod): string {
  const labels: Record<TimePeriod, string> = {
    week: 'Last 7 Days',
    month: 'Last 30 Days',
    quarter: 'Last 3 Months',
    year: 'Last Year',
  };
  
  return labels[period];
}

// Parse ISO date string safely
export function parseISODate(dateString: string | null | undefined): Date | null {
  if (!dateString) {
    return null;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}