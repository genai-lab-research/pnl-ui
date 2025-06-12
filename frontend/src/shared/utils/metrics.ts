import { TimeRangeOption } from '../../features/container-management/sections/TimeRangeSelector';

export function getPeakDay(data: { day: string; value: number }[]): string {
  if (!data || data.length === 0) return '';
  return data.reduce((max, item) => (item.value > max.value ? item : max), data[0]).day;
}

export function mapChartDataByRange(
  data: { date: string; value: number }[],
  range: TimeRangeOption
): { day: string; value: number }[] {
  return data.map(({ date, value }) => {
    let day = date;
    if (range === 'week') {
      day = date.substring(0, 3);
    } else if (range === 'month') {
      day = date.includes('Day')
        ? date.substring(4)
        : new Date(date).getDate().toString();
    } else if (range === 'quarter') {
      day = date.startsWith('Week') ? date.substring(5) : date.substring(0, 3);
    } else if (range === 'year') {
      day = date.length <= 3 ? date : date.substring(0, 3);
    } else {
      day = date.substring(0, 3);
    }
    return { day, value };
  });
}

export function formatMetricDay(date: string, timeRange: TimeRangeOption): string {
  if (timeRange === 'week') {
    return date.substring(0, 3);
  }
  if (timeRange === 'month') {
    return date.includes('Day')
      ? date.substring(4)
      : new Date(date).getDate().toString();
  }
  if (timeRange === 'quarter') {
    return date.startsWith('Week') ? date.substring(5) : date.substring(0, 3);
  }
  if (timeRange === 'year') {
    return date.length <= 3 ? date : date.substring(0, 3);
  }
  return date.substring(0, 3);
}


  