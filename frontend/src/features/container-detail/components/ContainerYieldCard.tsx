import React from 'react';
import { KPIMonitorCard } from '../../../shared/components/ui';
import { LocalGroceryStore } from '@mui/icons-material';

/**
 * Yield data structure for the container yield display
 */
export interface YieldData {
  /** Current yield value */
  current: number;
  /** Change from previous measurement (optional) */
  delta?: number;
  /** Unit of measurement (e.g., 'KG', 'LBS') */
  unit: string;
  /** Status indicator for the yield */
  status: 'normal' | 'warning' | 'critical';
}

/**
 * Props for the ContainerYieldCard component
 */
export interface ContainerYieldCardProps {
  /** Card title */
  title?: string;
  /** Current value */
  value?: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Change from previous measurement */
  delta?: string | number;
  /** Delta direction */
  deltaDirection?: 'up' | 'down' | 'flat';
  /** Optional subtitle text */
  subtitle?: string;
  /** Loading state */
  loading?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Click handler for the card */
  onClick?: () => void;
  /** Custom CSS class */
  className?: string;
}

/**
 * ContainerYieldCard - Domain component for displaying container yield metrics
 * 
 * This component wraps the KPIMonitorCard atomic component to display yield data
 * specifically for containers in the vertical farming control panel.
 * 
 * Features:
 * - Displays current yield with delta indicators
 * - Shows cart icon for visual context
 * - Supports various yield units (KG, LBS, etc.)
 * - Handles loading, error, and disabled states
 * - Clickable for navigation to detailed yield views
 * 
 * Based on Figma component 2615:207747 - Generation Block
 */
export const ContainerYieldCard: React.FC<ContainerYieldCardProps> = ({
  title = 'Yield',
  value = 'N/A',
  unit = '',
  delta,
  deltaDirection = 'flat',
  subtitle,
  loading = false,
  error,
  disabled = false,
  onClick,
  className,
}) => {
  // Generate accessible aria label
  const getAriaLabel = (): string => {
    let label = `${title}: ${value} ${unit}`;
    
    if (delta !== undefined && delta !== 0) {
      const change = deltaDirection === 'up' ? 'increase' : 'decrease';
      label += `, ${Math.abs(Number(delta))} ${unit} ${change} from previous measurement`;
    }
    
    if (subtitle) {
      label += `, ${subtitle}`;
    }
    
    return label;
  };

  return (
    <KPIMonitorCard
      title={title}
      value={value}
      unit={unit}
      delta={delta}
      deltaDirection={deltaDirection}
      subtitle={subtitle}
      iconSlot={<LocalGroceryStore />}
      variant="default"
      size="md"
      loading={loading}
      error={error}
      disabled={disabled}
      onClick={onClick}
      className={className}
      ariaLabel={getAriaLabel()}
    />
  );
};

export default ContainerYieldCard;
