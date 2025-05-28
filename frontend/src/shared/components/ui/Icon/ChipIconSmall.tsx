import React from 'react';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import clsx from 'clsx';

export interface ChipIconSmallProps {
  className?: string;
  color?: string;
  onClick?: () => void;
}

export const ChipIconSmall: React.FC<ChipIconSmallProps> = ({
  className,
  color = '#655490', // Default purple color
  onClick,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex h-[18px] w-[18px] items-center justify-center',
        className,
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <FiberManualRecordIcon style={{ color, width: '75%', height: '75%' }} />
    </span>
  );
};

export default ChipIconSmall;
