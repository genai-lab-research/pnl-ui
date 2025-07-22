import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { TrayGridProps } from '../types';

interface CropIndicatorProps {
  crop: {
    age_days: number;
    overdue_days: number;
    health_check: string;
    seed_type: string;
    row: number;
    column: number;
    id: number;
  };
  compact?: boolean;
  onClick?: () => void;
}

const CropIndicator: React.FC<CropIndicatorProps> = ({ 
  crop, 
  compact = false, 
  onClick 
}) => {
  // Determine size based on age (example thresholds)
  const getSize = () => {
    if (crop.age_days < 7) return compact ? 'w-1 h-1' : 'w-2 h-2';
    if (crop.age_days < 21) return compact ? 'w-1.5 h-1.5' : 'w-3 h-3';
    return compact ? 'w-2 h-2' : 'w-4 h-4';
  };

  // Determine color based on health and overdue status
  const getColor = () => {
    if (crop.overdue_days > 0) return 'bg-orange-500';
    if (crop.health_check === 'healthy') return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const tooltipContent = `
    ${crop.seed_type} (Row ${crop.row}, Col ${crop.column})
    Age: ${crop.age_days} days
    Health: ${crop.health_check}
    ${crop.overdue_days > 0 ? `Overdue: ${crop.overdue_days} days` : ''}
  `.trim();

  return (
    <Tooltip title={tooltipContent} arrow>
      <Box
        className={`${getSize()} ${getColor()} rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={onClick}
      />
    </Tooltip>
  );
};

/**
 * Grid visualization of crops within a tray (10x20 grid = 200 cells)
 */
export const TrayGrid: React.FC<TrayGridProps & { compact?: boolean }> = ({
  tray,
  compact = false,
  onCropClick
}) => {
  const gridRows = 10;
  const gridCols = 20;
  
  // Create a map of crop positions
  const cropMap = new Map();
  const trayData = tray as { crops?: CropIndicatorProps['crop'][] };
  if (trayData.crops) {
    trayData.crops.forEach((crop) => {
      const key = `${crop.row}-${crop.column}`;
      cropMap.set(key, crop);
    });
  }

  const cellSize = compact ? 'w-2 h-2' : 'w-4 h-4';
  const gapSize = compact ? 'gap-0.5' : 'gap-1';

  return (
    <Box 
      className={`grid grid-cols-20 ${gapSize} overflow-hidden`}
      style={{ 
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        height: compact ? '100%' : 'auto'
      }}
    >
      {Array.from({ length: gridRows * gridCols }, (_, index) => {
        const row = Math.floor(index / gridCols) + 1;
        const col = (index % gridCols) + 1;
        const cropKey = `${row}-${col}`;
        const crop = cropMap.get(cropKey);

        return (
          <Box
            key={index}
            className={`${cellSize} border border-whispering-cloud flex items-center justify-center bg-snow-white`}
          >
            {crop && (
              <CropIndicator
                crop={crop}
                compact={compact}
                onClick={() => onCropClick?.(crop.id)}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};