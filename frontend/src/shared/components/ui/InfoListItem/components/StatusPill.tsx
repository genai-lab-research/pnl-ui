/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import { statusPillStyles } from '../styles';
import type { StatusPillProps } from '../types';

export const StatusPill: React.FC<StatusPillProps> = ({ 
  label, 
  variant = 'default', 
  size = 'md' 
}) => {
  const classNames = clsx(
    `status-${variant}`,
    `size-${size}`
  );

  return (
    <span 
      css={statusPillStyles}
      className={classNames}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
};