import { describe, it, expect } from 'vitest';
import { formatChartLabel } from '../dateFormatter';

describe('formatChartLabel', () => {
  describe('month time range', () => {
    it('should display day numbers for every second day (odd days)', () => {
      // Create dates for a full month (31 days) to test
      const testDates = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const date = new Date(2024, 6, day); // July 2024 (31 days)
        return date.toISOString().split('T')[0];
      });
      
      // Test each date
      testDates.forEach(dateString => {
        const date = new Date(dateString);
        const day = date.getDate();
        
        const expected = day % 2 === 1 ? day.toString() : '';
        const actual = formatChartLabel(dateString, 'month');
        
        expect(actual).toBe(expected);
      });
    });
    
    it('should show odd day numbers (1, 3, 5, ...) and hide even day numbers', () => {
      // Test a few specific days
      const testCases = [
        { date: '2024-07-01', expected: '1' },  // Odd - should show
        { date: '2024-07-02', expected: '' },   // Even - should hide
        { date: '2024-07-03', expected: '3' },  // Odd - should show
        { date: '2024-07-04', expected: '' },   // Even - should hide
        { date: '2024-07-15', expected: '15' }, // Odd - should show
        { date: '2024-07-30', expected: '' },   // Even - should hide
        { date: '2024-07-31', expected: '31' }, // Odd - should show
      ];
      
      testCases.forEach(({ date, expected }) => {
        expect(formatChartLabel(date, 'month')).toBe(expected);
      });
    });
  });
  
  // Also test other time ranges to ensure they still work correctly
  describe('week time range', () => {
    it('should return day abbreviations', () => {
      const testCases = [
        { date: '2024-07-01', expected: 'Mon' }, // Monday
        { date: '2024-07-02', expected: 'Tue' }, // Tuesday
        { date: '2024-07-03', expected: 'Wed' }, // Wednesday
        { date: '2024-07-04', expected: 'Thu' }, // Thursday
        { date: '2024-07-05', expected: 'Fri' }, // Friday
        { date: '2024-07-06', expected: 'Sat' }, // Saturday
        { date: '2024-07-07', expected: 'Sun' }, // Sunday
      ];
      
      testCases.forEach(({ date, expected }) => {
        expect(formatChartLabel(date, 'week')).toBe(expected);
      });
    });
  });
  
  describe('year time range', () => {
    it('should return month abbreviations', () => {
      const testCases = [
        { date: '2024-01-15', expected: 'Jan' },
        { date: '2024-02-15', expected: 'Feb' },
        { date: '2024-03-15', expected: 'Mar' },
        { date: '2024-04-15', expected: 'Apr' },
        { date: '2024-05-15', expected: 'May' },
        { date: '2024-06-15', expected: 'Jun' },
        { date: '2024-07-15', expected: 'Jul' },
        { date: '2024-08-15', expected: 'Aug' },
        { date: '2024-09-15', expected: 'Sep' },
        { date: '2024-10-15', expected: 'Oct' },
        { date: '2024-11-15', expected: 'Nov' },
        { date: '2024-12-15', expected: 'Dec' },
      ];
      
      testCases.forEach(({ date, expected }) => {
        expect(formatChartLabel(date, 'year')).toBe(expected);
      });
    });
  });
  
  describe('quarter time range', () => {
    it('should return month abbreviations', () => {
      const testCases = [
        { date: '2024-01-15', expected: 'Jan' },
        { date: '2024-04-15', expected: 'Apr' },
        { date: '2024-07-15', expected: 'Jul' },
        { date: '2024-10-15', expected: 'Oct' },
      ];
      
      testCases.forEach(({ date, expected }) => {
        expect(formatChartLabel(date, 'quarter')).toBe(expected);
      });
    });
  });
});