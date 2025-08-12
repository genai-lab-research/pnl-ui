import React from 'react';
import { BaseMetricCard } from '../../../../shared/components/ui/BaseMetricCard';

interface SpaceUtilizationCardProps {
  /** Title of the space (e.g., "Nursery Station Utilization", "Cultivation Area Utilization") */
  title: string;
  /** Current utilization percentage */
  currentUtilization: number;
  /** Change in utilization */
  changeValue?: number;
  /** Type of space for icon selection */
  spaceType: 'nursery' | 'cultivation';
  /** Whether to use transparent background */
  transparent?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

const NurseryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CultivationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="10" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="16" width="18" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * SpaceUtilizationCard - Component for displaying space utilization metrics
 */
export const SpaceUtilizationCard: React.FC<SpaceUtilizationCardProps> = ({
  title,
  currentUtilization,
  changeValue,
  spaceType,
  transparent = false,
  loading = false,
  error,
  onClick,
  className
}) => {
  const formatChange = (value: number) => {
    return value >= 0 ? `+${value}%` : `${value}%`;
  };

  const icon = spaceType === 'nursery' ? <NurseryIcon /> : <CultivationIcon />;

  return (
    <BaseMetricCard
      title={title}
      icon={icon}
      value={`${currentUtilization}%`}
      changeValue={changeValue !== undefined ? formatChange(changeValue) : undefined}
      isPositiveChange={changeValue ? changeValue >= 0 : true}
      transparent={transparent}
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      ariaLabel={`${title}: ${currentUtilization}%${changeValue !== undefined ? ` change ${formatChange(changeValue)}` : ''}`}
    />
  );
};