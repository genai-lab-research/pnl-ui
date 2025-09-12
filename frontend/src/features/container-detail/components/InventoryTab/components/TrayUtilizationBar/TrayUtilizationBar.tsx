import React from 'react';
import { ProgressMetric } from '../../../../../../shared/components/ui/ProgressMetric';

interface TrayUtilizationBarProps {
  utilization: number;
  label?: string;
}

/**
 * Domain component for displaying tray utilization percentage
 * Wraps the atomic ProgressMetric component with inventory-specific styling
 */
export const TrayUtilizationBar: React.FC<TrayUtilizationBarProps> = ({
  utilization,
  label = 'UTILIZATION',
}) => {
  return (
    <ProgressMetric
      label={label}
      value={utilization}
      unit="%"
      showValue={true}
      showProgressBar={true}
      progressColor="#4caf50"
      variant="compact"
      size="sm"
      ariaLabel={`Tray utilization: ${utilization}%`}
    />
  );
};