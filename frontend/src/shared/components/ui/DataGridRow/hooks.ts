import { useCallback } from 'react';

interface UseDataGridRowProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
}

export const useDataGridRow = ({
  onClick,
  disabled = false,
  loading = false,
  error,
}: UseDataGridRowProps) => {
  const isClickable = Boolean(onClick && !disabled && !loading && !error);

  const handleClick = useCallback(() => {
    if (isClickable && onClick) {
      onClick();
    }
  }, [isClickable, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  }, [isClickable, onClick]);

  return {
    isClickable,
    handleClick,
    handleKeyDown,
  };
};