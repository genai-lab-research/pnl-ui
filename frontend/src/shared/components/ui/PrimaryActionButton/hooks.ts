import { useCallback } from 'react';

interface UseActionButtonParams {
  disabled: boolean;
  loading: boolean;
  onClick?: () => void;
}

export const usePrimaryActionButton = ({ disabled, loading, onClick }: UseActionButtonParams) => {
  const handleClick = useCallback(() => {
    if (disabled || loading || !onClick) return;
    onClick();
  }, [disabled, loading, onClick]);

  const isInteractive = !disabled && !loading;

  return {
    handleClick,
    isInteractive,
  };
};