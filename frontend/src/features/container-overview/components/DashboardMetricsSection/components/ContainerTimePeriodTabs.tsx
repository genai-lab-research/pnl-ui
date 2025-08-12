/** @jsxImportSource @emotion/react */
import React from 'react';
import TimePeriodTabs from '../../../../../shared/components/ui/TimePeriodTabs/TimePeriodTabs';
import { containerTimePeriodTabsStyles } from './ContainerTimePeriodTabs.styles';

interface ContainerTimePeriodTabsProps {
  selectedTimeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Container Overview Time Period Tabs - Domain-specific wrapper around atomic TimePeriodTabs
 * 
 * This component demonstrates the atomic component pattern:
 * 1. Uses shared TimePeriodTabs as the base component
 * 2. Applies container-overview domain styling and behavior
 * 3. Maps container-specific time ranges to atomic component props
 * 4. Provides domain-specific theming and responsive behavior
 */
export const ContainerTimePeriodTabs: React.FC<ContainerTimePeriodTabsProps> = ({
  selectedTimeRange,
  onTimeRangeChange,
  isLoading = false,
  className = '',
}) => {
  // Domain-specific time period options for container metrics
  const containerTimeRanges = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' }
  ];

  return (
    <div css={containerTimePeriodTabsStyles.wrapper} className={className}>
      <TimePeriodTabs
        tabs={containerTimeRanges}
        selectedTabId={selectedTimeRange}
        onTabChange={onTimeRangeChange}
        variant="outlined"
        size="sm"
        loading={isLoading}
        primaryColor="#3545EE"
        textColor="#3545EE"
        mutedTextColor="#49454F"
        ariaLabel="Container metrics time period"
        className="container-overview-time-period-tabs"
      />
    </div>
  );
};
