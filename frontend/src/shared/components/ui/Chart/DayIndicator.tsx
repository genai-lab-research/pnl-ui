import React from 'react';

import { Tooltip, Typography } from '@mui/material';

interface DayIndicatorProps {
  day: string;
  fullText?: string;
}

export const DayIndicator: React.FC<DayIndicatorProps> = ({ day, fullText }) => {
  // If the day is a number or very short, we don't need a tooltip
  const needsTooltip = fullText && fullText !== day;

  const label = (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        fontSize: '0.75rem',
        marginTop: '4px',
        textAlign: 'center',
        maxWidth: '32px', // Ensure long labels don't break layout
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {day}
    </Typography>
  );

  if (needsTooltip) {
    return (
      <Tooltip title={fullText} placement="top">
        {label}
      </Tooltip>
    );
  }

  return label;
};

export default DayIndicator;
