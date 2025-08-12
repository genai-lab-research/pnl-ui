/** @jsxImportSource @emotion/react */
import React from 'react';
import { StatusPillProps } from '../types';
import { useStatusPillClasses } from '../hooks';
import { statusPillStyles } from '../styles';

/**
 * StatusPill - A reusable status indicator component
 */
const StatusPill: React.FC<StatusPillProps> = ({
  label,
  variant,
  size = 'md'
}) => {
  const classes = useStatusPillClasses({ variant, size });

  return (
    <span css={statusPillStyles} className={classes}>
      {label}
    </span>
  );
};

export default StatusPill;