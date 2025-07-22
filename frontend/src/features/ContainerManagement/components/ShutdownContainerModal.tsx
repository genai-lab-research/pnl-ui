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
  Alert,
  CircularProgress
} from '@mui/material';
import { Container } from '../../../shared/types/containers';

interface ShutdownContainerModalProps {
  open: boolean;
  container: Container | null;
  onClose: () => void;
  onConfirm: (reason?: string, force?: boolean) => Promise<void>;
}

export const ShutdownContainerModal: React.FC<ShutdownContainerModalProps> = ({
  open,
  container,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setForce(false);
      setError(null);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!container) return;

    setLoading(true);
    setError(null);

    try {
      await onConfirm(reason.trim() || undefined, force);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shutdown container');
    } finally {
      setLoading(false);
    }
  };

  if (!container) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Shutdown Container
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Are you sure you want to shutdown the following container?
          </Typography>
          
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200',
              my: 2
            }}
          >
            <Typography variant="subtitle2" color="text.primary">
              <strong>{container.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {container.type} • Status: {container.status}
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will deactivate the container and may interrupt any ongoing operations.
          </Alert>
        </Box>

        <TextField
          fullWidth
          label="Reason for shutdown (optional)"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter a reason for shutting down this container..."
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              disabled={loading}
            />
          }
          label={
            <Typography variant="body2">
              Force shutdown (bypass safety checks)
            </Typography>
          }
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Shutting down...' : 'Shutdown Container'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};