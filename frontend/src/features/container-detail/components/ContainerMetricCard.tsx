import React from 'react';
import { KPIMonitorCard } from '../../../shared/components/ui';
import type { KPIMonitorCardProps } from '../../../shared/components/ui/KPIMonitorCard/types';

/**
 * Props interface for ContainerMetricCard domain component
 */
export interface ContainerMetricCardProps {
  /** Metric title */
  title?: string;
  
  /** Current value */
  value?: string | number;
  
  /** Target value */
  targetValue?: string | number;
  
  /** Unit of measurement */
  unit?: string;
  
  /** Icon name */
  iconName?: string;
  
  /** Custom icon component */
  iconSlot?: React.ReactNode;
  
  /** Status of the metric */
  status?: 'normal' | 'warning' | 'critical';
  
  /** Optional subtitle for additional context */
  subtitle?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Click handler for metric card interaction */
  onClick?: () => void;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * ContainerMetricCard - Domain component for displaying container air temperature metrics
 * 
 * This component wraps the KPIMonitorCard atomic component to display container-specific
 * air temperature data with current vs target values. It follows the design from Figma
 * component 2615:207745 and implements the temperature monitoring display pattern.
 * 
 * Features:
 * - Displays current and target air temperature values
 * - Shows thermostat icon for visual context
 * - Supports both Celsius and Fahrenheit units
 * - Handles loading and error states
 * - Responsive design with proper accessibility
 */
export const ContainerMetricCard: React.FC<ContainerMetricCardProps> = ({
  title = 'Metric',
  value = 'N/A',
  targetValue,
  unit = '',
  iconName = 'thermostat',
  iconSlot,
  status = 'normal',
  subtitle,
  loading = false,
  error,
  onClick,
  className,
  disabled = false,
}) => {
  // Transform container metric data to KPIMonitorCard props
  const kpiProps: KPIMonitorCardProps = {
    title,
    value,
    targetValue,
    unit,
    subtitle,
    iconName,
    iconSlot,
    size: 'md', // Default size matching Figma design (208px × 100px)
    variant: 'default',
    loading,
    error,
    onClick,
    className,
    disabled,
    ariaLabel: `${title}: ${value}${unit}${
      targetValue ? ` target ${targetValue}${unit}` : ''
    }`,
  };

  return <KPIMonitorCard {...kpiProps} />;
};

ContainerMetricCard.displayName = 'ContainerMetricCard';

export default ContainerMetricCard;
