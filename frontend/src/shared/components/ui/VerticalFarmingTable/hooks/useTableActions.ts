import { useCallback } from 'react';

export interface UseTableActionsProps {
  onRowAction?: (rowId: string, action: string) => void;
}

export const useTableActions = ({ onRowAction }: UseTableActionsProps) => {
  const handleRowAction = useCallback((rowId: string, action: string) => {
    if (onRowAction) {
      onRowAction(rowId, action);
    }
  }, [onRowAction]);

  return {
    handleRowAction,
  };
};