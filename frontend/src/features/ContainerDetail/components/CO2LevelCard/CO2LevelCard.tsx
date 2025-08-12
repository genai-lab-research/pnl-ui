import React from 'react';
import { BaseMetricCard } from '../../../../shared/components/ui/BaseMetricCard';

interface CO2LevelCardProps {
  /** Current CO2 level in ppm */
  currentLevel: number;
  /** Target CO2 range */
  targetRange?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

const CO2Icon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
    <text x="12" y="17" fontSize="10" textAnchor="middle" fill="currentColor" fontFamily="Inter" fontWeight="600">CO₂</text>
  </svg>
);

/**
 * CO2LevelCard - Component for displaying CO2 level metrics
 */
export const CO2LevelCard: React.FC<CO2LevelCardProps> = ({
  currentLevel,
  targetRange = '800-900ppm',
  loading = false,
  error,
  onClick,
  className
}) => {
  return (
    <BaseMetricCard
      title="CO₂ Level"
      icon={<CO2Icon />}
      value={currentLevel}
      secondaryValue={targetRange}
      loading={loading}
      error={error}
      onClick={onClick}
      className={className}
      ariaLabel={`CO2 level: ${currentLevel} ppm, target range ${targetRange}`}
    />
  );
};