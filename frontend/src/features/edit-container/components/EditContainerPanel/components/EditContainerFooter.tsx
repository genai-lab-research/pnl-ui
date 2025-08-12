import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { UseEditContainerReturn } from '../../../hooks/useEditContainer';
import { StyledFooter } from '../EditContainerPanel.styles';

export interface EditContainerFooterProps {
  editContainerHook: UseEditContainerReturn;
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export const EditContainerFooter: React.FC<EditContainerFooterProps> = ({
  editContainerHook,
  onCancel,
  onSave,
  disabled = false
}) => {
  const { state } = editContainerHook;

  const handleCancel = () => {
    if (state.hasChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmDiscard) return;
    }
    onCancel();
  };

  const handleSave = async () => {
    onSave();
  };

  const getSaveButtonText = () => {
    if (state.isSubmitting) return 'Saving...';
    if (!state.hasChanges) return 'No Changes';
    return 'Save Changes';
  };

  const isSaveDisabled = () => {
    return (
      disabled ||
      state.isSubmitting ||
      !state.hasChanges ||
      state.hasValidationErrors ||
      state.submitButtonDisabled
    );
  };

  return (
    <StyledFooter>
      <Button
        variant="outlined"
        onClick={handleCancel}
        disabled={state.isSubmitting}
        sx={{
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Cancel
      </Button>
      
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isSaveDisabled()}
        startIcon={state.isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        sx={{
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        {getSaveButtonText()}
      </Button>
    </StyledFooter>
  );
};

export default EditContainerFooter;