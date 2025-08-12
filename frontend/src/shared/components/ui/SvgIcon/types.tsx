export interface IconProps {
  path: string;
  width?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  onClick?: () => void;
}

export interface IconButtonProps extends Omit<IconProps, 'color' | 'style' | 'alt'> {
  children?: React.ReactNode;
  disabled?: boolean;
}

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export const iconSizes: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};
