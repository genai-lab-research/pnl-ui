import React from 'react';
import { GridStatusCard as SharedGridStatusCard } from '../../../../../../shared/components/ui/GridStatusCard';
import type { GridItem, GridItemStatus } from '../../../../../../shared/components/ui/GridStatusCard/types';

interface GridStatusCardProps {
  trayId: string;
  utilization: number;
  gridSize: string;
  cropCount: number;
  gridData?: boolean[][];
  status?: 'active' | 'warning' | 'inactive';
}

/**
 * Domain component for tray slot visualization (Component ID: 2637-245220)
 * Wraps the atomic GridStatusCard component with inventory-specific configuration
 */
export const GridStatusCard: React.FC<GridStatusCardProps> = ({
  trayId,
  utilization,
  gridSize,
  cropCount,
  gridData = [],
  status = 'active'
}) => {
  // Convert boolean grid data to GridItem format
  const convertGridData = (): GridItem[][] => {
    if (!gridData || gridData.length === 0) {
      // Generate default 10x14 grid
      const defaultGrid: GridItem[][] = [];
      for (let i = 0; i < 14; i++) {
        const row: GridItem[] = [];
        for (let j = 0; j < 10; j++) {
          row.push({ 
            status: Math.random() > 0.25 ? 'active' : 'inactive' as GridItemStatus 
          });
        }
        defaultGrid.push(row);
      }
      return defaultGrid;
    }

    // Convert provided boolean grid to GridItem format
    return gridData.map(row => 
      row.map(filled => ({
        status: filled ? 
          (status === 'warning' ? 'warning' : 'active') as GridItemStatus : 
          'inactive' as GridItemStatus
      }))
    );
  };

  // Extract slot number from trayId
  const slotNumber = trayId.split('-')[0]?.replace('TR', '') || '1';

  // Map status to color
  const getProgressColor = () => {
    switch (status) {
      case 'warning':
        return '#ff9800';
      case 'inactive':
        return '#9e9e9e';
      default:
        return '#4caf50';
    }
  };

  return (
    <SharedGridStatusCard
      slotLabel="SLOT"
      slotNumber={slotNumber}
      title={trayId}
      utilization={utilization}
      progressValue={utilization}
      progressColor={getProgressColor()}
      showProgress={true}
      gridRows={10}
      gridColumns={14}
      gridData={convertGridData()}
      gridLabel={gridSize}
      itemCount={cropCount}
      itemLabel="crops"
      variant="default"
      size="sm"
      statusColors={{
        active: '#4caf50',
        warning: '#ff9800',
        inactive: '#e0e0e0',
        pending: '#2196f3',
        error: '#f44336'
      }}
    />
  );
};