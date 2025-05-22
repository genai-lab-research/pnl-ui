import React from 'react';
import clsx from 'clsx';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

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
        'inline-flex items-center justify-center w-[18px] h-[18px]',
        className,
        onClick && 'cursor-pointer'
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