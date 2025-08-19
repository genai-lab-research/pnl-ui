import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';

interface ShutdownConfirmDialogProps {
  open: boolean;
  containerName: string;
  containerId: string;
  onConfirm: (reason: string, force: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ShutdownConfirmDialog: React.FC<ShutdownConfirmDialogProps> = ({
  open,
  containerName,
  containerId,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  const [reason, setReason] = useState('');
  const [force, setForce] = useState(false);

  const handleConfirm = () => {
    const finalReason = reason.trim() || 'User requested shutdown from dashboard';
    onConfirm(finalReason, force);
  };

  const handleClose = () => {
    setReason('');
    setForce(false);
    onCancel();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        Shutdown Container
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are about to shutdown container <strong>{containerName}</strong> (ID: {containerId}).
          This action will stop all processes running in the container.
        </Alert>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Reason for shutdown (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            placeholder="Enter a reason for shutting down this container..."
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={force} 
                onChange={(e) => setForce(e.target.checked)}
                disabled={isLoading}
              />
            }
            label={
              <Box>
                <Typography variant="body2">
                  Force shutdown
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Force shutdown even if container has active processes or connections
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="warning" 
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Shutting down...' : 'Shutdown'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShutdownConfirmDialog;