import React from 'react';
import { BaseMetricCard } from '../../../../shared/components/ui/BaseMetricCard';

interface HumidityCardProps {
  /** Current humidity percentage */
  currentHumidity: number;
  /** Target humidity percentage */
  targetHumidity?: number;
  /** Change in humidity */
  changeValue?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

const HumidityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.69L17.66 8.35C19.13 9.82 20 11.71 20 13.72C20 18.08 16.42 21.64 12 21.64C7.58 21.64 4 18.08 4 13.72C4 11.71 4.87 9.82 6.34 8.35L12 2.69Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * HumidityCard - Component for displaying humidity metrics
 */
export const HumidityCard: React.FC<HumidityCardProps> = ({
  currentHumidity,
  targetHumidity,
  changeValue,
  loading = false,
  error,
  onClick,
  className
}) => {
  const formatChange = (value: number) => {
    return value >= 0 ? `+${value}%` : `${value}%`;
  };

  return (
    <BaseMetricCard
      title="Rel. Humidity"
      icon={<HumidityIcon />}
      value={`${currentHumidity}%`}
      secondaryValue={targetHumidity ? `${targetHumidity}%` : undefined}
      changeValue={changeValue !== undefined ? formatChange(changeValue) : undefined}
      isPositiveChange={changeValue ? changeValue >= 0 : true}
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      ariaLabel={`Relative humidity: ${currentHumidity}%${targetHumidity ? ` target ${targetHumidity}%` : ''}${changeValue !== undefined ? ` change ${formatChange(changeValue)}` : ''}`}
    />
  );
};