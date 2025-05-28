import React from 'react';

import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';

export interface SearchIconCustomProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  onClick?: () => void;
}

export const SearchIconCustom: React.FC<SearchIconCustomProps> = ({
  className,
  size = 'medium',
  color = '#717179', // Default gray color
  onClick,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        className,
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <SearchIcon style={{ color, width: '100%', height: '100%' }} />
    </span>
  );
};

export default SearchIconCustom;
