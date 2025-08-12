/**
 * Utility functions for InfoDisplayCard component
 */

/**
 * Announces message to screen readers
 * @param message - Message to announce
 * @param priority - Announcement priority ('polite' or 'assertive')
 */
export const announceToScreenReader = (
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

/**
 * Creates a safe ID from a string by removing special characters
 * @param text - Text to convert to ID
 * @returns Safe HTML ID string
 */
export const createSafeId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Formats a field value for display, handling empty/null values
 * @param value - Raw field value
 * @returns Formatted display value
 */
export const formatFieldValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '—'; // Em dash for empty values
  }
  
  if (typeof value === 'string') {
    return value.trim() || '—';
  }
  
  if (typeof value === 'number') {
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return String(value);
};