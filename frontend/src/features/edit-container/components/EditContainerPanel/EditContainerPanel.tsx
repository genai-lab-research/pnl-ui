import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { UseEditContainerReturn } from '../../hooks/useEditContainer';
import { ContainerInformationSection } from './components/ContainerInformationSection';
import { SettingsSection } from './components/SettingsSection';
import { SystemIntegrationSection } from './components/SystemIntegrationSection';
import { EditContainerFooter } from './components/EditContainerFooter';
import { StyledDrawer, StyledDrawerHeader, StyledDrawerContent } from './EditContainerPanel.styles';

export interface EditContainerPanelProps {
  open: boolean;
  onClose: () => void;
  editContainerHook: UseEditContainerReturn;
}

export const EditContainerPanel: React.FC<EditContainerPanelProps> = ({
  open,
  onClose,
  editContainerHook
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, actions, canModifyContainer, getModificationReason } = editContainerHook;

  const handleClose = () => {
    if (state.hasChanges) {
      // TODO: Show unsaved changes confirmation dialog
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmDiscard) return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    actions.validateForm();
    if (!state.hasValidationErrors) {
      const result = await actions.submitForm();
      if (result.success) {
        onClose();
      }
    }
  };

  if (!state.isInitialized && state.isLoading) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <CircularProgress />
      </Drawer>
    );
  }

  if (state.loadError) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: isMobile ? '100%' : 420 }
        }}
      >
        <Box p={3}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.loadError}
          </Alert>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Drawer>
    );
  }

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: isMobile ? '100%' : 420 }
      }}
    >
      <StyledDrawerHeader>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600} sx={{ flexGrow: 1, textAlign: 'center' }}>
          Edit Container
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
        <Divider sx={{ mt: 2, borderColor: '#E0E0E0' }} />
      </StyledDrawerHeader>

      <StyledDrawerContent>
        {!canModifyContainer() && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {getModificationReason() || 'This container cannot be modified'}
          </Alert>
        )}

        <ContainerInformationSection 
          editContainerHook={editContainerHook}
          disabled={!canModifyContainer()}
        />
        
        <SettingsSection 
          editContainerHook={editContainerHook}
          disabled={!canModifyContainer()}
        />
        
        <SystemIntegrationSection 
          editContainerHook={editContainerHook}
          disabled={!canModifyContainer()}
        />
      </StyledDrawerContent>

      <EditContainerFooter
        editContainerHook={editContainerHook}
        onCancel={handleClose}
        onSave={handleSubmit}
        disabled={!canModifyContainer()}
      />
    </StyledDrawer>
  );
};

export default EditContainerPanel;