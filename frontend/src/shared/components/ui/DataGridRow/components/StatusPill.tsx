/** @jsxImportSource @emotion/react */
import React from 'react';
import clsx from 'clsx';
import { statusPillStyles } from '../styles';
import type { StatusPillProps } from '../types';

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant = 'default',
  size = 'md',
}) => {
  return (
    <div
      css={statusPillStyles}
      className={clsx(
        `status-${variant}`,
        `size-${size}`
      )}
    >
      {label}
    </div>
  );
};