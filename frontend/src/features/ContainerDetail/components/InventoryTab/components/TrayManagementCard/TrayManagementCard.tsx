import React from 'react';
import { Add } from '@mui/icons-material';
import { GridStatusCard as SharedGridStatusCard } from '../../../../../../shared/components/ui/GridStatusCard';

interface TrayManagementCardProps {
  slotId: string;
  onAddTray: () => void;
  disabled?: boolean;
}

/**
 * Domain component for tray slot management (Component ID: 2637-245937)
 * Wraps GridStatusCard with additional action button for adding new trays
 * Display tray information with ability to add new trays
 */
export const TrayManagementCard: React.FC<TrayManagementCardProps> = ({
  slotId,
  onAddTray,
  disabled = false
}) => {
  // Generate empty grid data for empty slot
  const emptyGridData = Array(14).fill(null).map(() => 
    Array(10).fill(null).map(() => ({ status: 'inactive' as const }))
  );

  return (
    <SharedGridStatusCard
      slotLabel="SLOT"
      slotNumber={slotId}
      title="Empty Slot"
      utilization={0}
      progressValue={0}
      progressColor="#e0e0e0"
      showProgress={false}
      gridRows={10}
      gridColumns={14}
      gridData={emptyGridData}
      gridLabel="10 × 14 Grid"
      itemCount={0}
      itemLabel="crops"
      actionLabel="Add Tray"
      actionIcon={<Add />}
      onActionClick={disabled ? undefined : onAddTray}
      variant="outlined"
      size="sm"
      statusColors={{
        active: '#4caf50',
        warning: '#ff9800',
        inactive: '#f5f5f5',
        pending: '#2196f3',
        error: '#f44336'
      }}
    />
  );
};