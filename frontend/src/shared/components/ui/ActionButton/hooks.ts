import { useCallback } from 'react';
import { ActionButtonProps } from './types';

export const useActionButton = ({
  disabled,
  loading,
  onClick,
}: Pick<ActionButtonProps, 'disabled' | 'loading' | 'onClick'>) => {
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  }, [disabled, loading, onClick]);

  const isInteractive = !disabled && !loading;
  
  return {
    handleClick,
    isInteractive,
  };
};