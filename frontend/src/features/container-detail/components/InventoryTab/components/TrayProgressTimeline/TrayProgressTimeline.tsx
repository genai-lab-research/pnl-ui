import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { TimelineProgress } from '../../../../../../shared/components/ui/TimelineProgress';
import type { DayBlock } from '../../../../../../shared/components/ui/TimelineProgress/types';

interface TrayProgressTimelineProps {
  currentDay: number;
  totalDays: number;
  startDate: string;
  endDate: string;
}

/**
 * Domain component for growth cycle timeline (Component ID: 2637-220578)
 * Wraps the atomic TimelineProgress component with inventory-specific configuration
 * Visualizes 60-day crop growth progress with current day indicator
 */
export const TrayProgressTimeline: React.FC<TrayProgressTimelineProps> = ({
  currentDay,
  totalDays,
  startDate,
  endDate
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentDay / totalDays) * 100;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Date labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ color: '#666' }}>
          {startDate}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 600,
            color: '#1976d2',
          }}
        >
          Day {currentDay} of {totalDays}
        </Typography>
        <Typography variant="caption" sx={{ color: '#666' }}>
          {endDate}
        </Typography>
      </Box>

      {/* Timeline progress */}
      <TimelineProgress
        startDate={startDate}
        endDate={endDate}
        currentDay={currentDay}
        totalDays={totalDays}
        accentColor="#1976d2"
        height={8}
        borderRadius={4}
        showTooltip={true}
        tooltipLabel={`Day ${currentDay} of ${totalDays}`}
      />

      {/* Visual progress bar */}
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            left: `${progressPercentage}%`,
            top: '-20px',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: '2px 6px',
            borderRadius: '12px',
            border: '1px solid #4caf50',
            fontWeight: 600,
            fontSize: '11px',
          }}
        >
          Today
        </Typography>
      </Box>
    </Box>
  );
};