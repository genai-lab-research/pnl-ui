import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export interface BaseInfoCardProps {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'outlined';
  elevation?: number;
  className?: string;
  sx?: SxProps<Theme>;
}