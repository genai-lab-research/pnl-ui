import React from 'react';
import { BaseMetricCard } from '../../../../shared/components/ui/BaseMetricCard';

interface AirTemperatureCardProps {
  /** Current air temperature value */
  currentTemperature: number;
  /** Target air temperature value */
  targetTemperature?: number;
  /** Temperature unit (default: °C) */
  unit?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

const ThermometerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.8954 2 10 2.89543 10 4V13.2676C8.80375 13.8831 8 15.1003 8 16.5C8 18.433 9.567 20 11.5 20C13.433 20 15 18.433 15 16.5C15 15.1003 14.1962 13.8831 13 13.2676V4C13 2.89543 12.1046 2 11 2H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * AirTemperatureCard - Domain-specific component for displaying air temperature metrics
 * 
 * Built on top of the BaseMetricCard, this component provides a specialized
 * interface for air temperature monitoring in vertical farming containers.
 */
export const AirTemperatureCard: React.FC<AirTemperatureCardProps> = ({
  currentTemperature,
  targetTemperature,
  unit = '°C',
  loading = false,
  error,
  onClick,
  className
}) => {
  return (
    <BaseMetricCard
      title="Air Temperature"
      icon={<ThermometerIcon />}
      value={`${currentTemperature}${unit}`}
      secondaryValue={targetTemperature ? `${targetTemperature}${unit}` : undefined}
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      ariaLabel={`Air temperature: ${currentTemperature}${unit}${targetTemperature ? ` target ${targetTemperature}${unit}` : ''}`}
    />
  );
};