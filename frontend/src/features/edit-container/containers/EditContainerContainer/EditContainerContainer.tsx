import React from 'react';
import { useEditContainer } from '../../hooks/useEditContainer';
import { EditContainerPanel } from '../../components/EditContainerPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingOverlay } from './components/LoadingOverlay';

export interface EditContainerContainerProps {
  containerId: number;
  open: boolean;
  onClose: () => void;
}

export const EditContainerContainer: React.FC<EditContainerContainerProps> = ({
  containerId,
  open,
  onClose
}) => {
  const editContainerHook = useEditContainer(containerId);

  return (
    <ErrorBoundary>
      <EditContainerPanel
        open={open}
        onClose={onClose}
        editContainerHook={editContainerHook}
      />
      {editContainerHook.state.isSubmitting && <LoadingOverlay />}
    </ErrorBoundary>
  );
};

export default EditContainerContainer;