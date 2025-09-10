import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';

interface EnvironmentRecipesTabProps {
  containerId: number;
  containerName?: string;
  onExternalOpen?: () => void;
  onInitiateConnection?: () => void;
  environmentStatus?: any;
  iframeUrl?: string | null;
  isLoading?: boolean;
  error?: string | null;
  userRole?: 'admin' | 'technician' | 'viewer';
  refreshInterval?: number;
}

export const EnvironmentRecipesTab: React.FC<EnvironmentRecipesTabProps> = ({
  containerId,
  containerName,
  onExternalOpen,
  onInitiateConnection,
  environmentStatus,
  iframeUrl,
  isLoading = false,
  error = null,
  userRole = 'viewer',
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const isConnected = environmentStatus?.is_connected || false;

  if (!isConnected) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Environment Control System
        </Typography>
        <Typography color="text.secondary" paragraph>
          This container is not yet connected to an environment control system.
        </Typography>
        {userRole !== 'viewer' && onInitiateConnection && (
          <Button
            variant="contained"
            onClick={onInitiateConnection}
            sx={{ mt: 2 }}
          >
            Connect to FarmHand
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Environment & Recipes - {containerName || `Container ${containerId}`}
        </Typography>
        {onExternalOpen && (
          <Button
            variant="outlined"
            startIcon={<OpenInNew />}
            onClick={onExternalOpen}
          >
            Open in FarmHand
          </Button>
        )}
      </Box>

      {iframeUrl ? (
        <Box
          sx={{
            width: '100%',
            height: '600px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <iframe
            src={iframeUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="FarmHand Environment Control"
          />
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Loading FarmHand interface...
          </Typography>
        </Paper>
      )}
    </Box>
  );
};