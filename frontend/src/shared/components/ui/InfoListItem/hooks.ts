import { useCallback } from 'react';
import type { InfoListItemProps } from './types';

export const useInfoListItem = (props: Pick<InfoListItemProps, 'onClick' | 'loading' | 'error'>) => {
  const { onClick, loading, error } = props;

  const handleClick = useCallback(() => {
    if (!loading && !error && onClick) {
      onClick();
    }
  }, [loading, error, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const isClickable = Boolean(onClick && !loading && !error);

  return {
    handleClick,
    handleKeyDown,
    isClickable,
  };
};