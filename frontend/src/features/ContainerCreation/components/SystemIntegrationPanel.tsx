import React, { useCallback, useEffect } from 'react';
import { 
  Box, 
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';
import { ContainerFormData, ContainerFormErrors } from '../types';
import { SegmentedToggle } from '../../../shared/components/ui/SegmentedToggle';
import { containerCreationService } from '../services';

interface SystemIntegrationPanelProps {
  formData: ContainerFormData;
  errors: ContainerFormErrors;
  onChange: (updates: Partial<ContainerFormData>) => void;
}

export const SystemIntegrationPanel: React.FC<SystemIntegrationPanelProps> = ({
  formData,
  errors,
  onChange
}) => {
  const handleEcosystemConnectedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const connected = event.target.checked;
    let ecosystemSettings = formData.ecosystem_settings;
    
    if (connected && formData.purpose) {
      // Auto-select environments based on purpose
      ecosystemSettings = containerCreationService.getEnvironmentSettingsForPurpose(formData.purpose);
    } else if (!connected) {
      // Reset to default when disconnected
      ecosystemSettings = {
        fa: null,
        pya: null,
        aws: null,
        mbai: 'prod'
      };
    }

    onChange({ 
      ecosystem_connected: connected,
      ecosystem_settings: ecosystemSettings
    });
  }, [formData.purpose, formData.ecosystem_settings, onChange]);

  const handleEnvironmentChange = useCallback((
    system: keyof ContainerFormData['ecosystem_settings'],
    value: string
  ) => {
    onChange({
      ecosystem_settings: {
        ...formData.ecosystem_settings,
        [system]: value as any
      }
    });
  }, [formData.ecosystem_settings, onChange]);

  // Auto-update environment settings when purpose changes
  useEffect(() => {
    if (formData.ecosystem_connected && formData.purpose) {
      const newSettings = containerCreationService.getEnvironmentSettingsForPurpose(formData.purpose);
      onChange({ ecosystem_settings: newSettings });
    }
  }, [formData.purpose, formData.ecosystem_connected, onChange]);

  const faOptions = [
    { id: 'alpha', value: 'alpha', label: 'Alpha' },
    { id: 'prod', value: 'prod', label: 'Prod' }
  ];

  const pyaOptions = [
    { id: 'dev', value: 'dev', label: 'Dev' },
    { id: 'test', value: 'test', label: 'Test' },
    { id: 'stage', value: 'stage', label: 'Stage' }
  ];

  const awsOptions = [
    { id: 'dev', value: 'dev', label: 'Dev' },
    { id: 'prod', value: 'prod', label: 'Prod' }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Ecosystem Connection Toggle */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.ecosystem_connected}
                  onChange={handleEcosystemConnectedChange}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Connect to other systems
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Enable integration with external systems and environments
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Grid>

        {/* Environment Configuration Panel */}
        {formData.ecosystem_connected && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#f8fafc' }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: '#1976d2'
                }}
              >
                Environment Configuration
              </Typography>

              <Grid container spacing={3}>
                {/* FA Environment */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      FA Environment
                    </Typography>
                    <SegmentedToggle
                      options={faOptions}
                      value={formData.ecosystem_settings.fa || 'alpha'}
                      onChange={(value) => handleEnvironmentChange('fa', value)}
                      ariaLabel="Select FA environment"
                    />
                  </Box>
                </Grid>

                {/* PYA Environment */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      PYA Environment
                    </Typography>
                    <SegmentedToggle
                      options={pyaOptions}
                      value={formData.ecosystem_settings.pya || 'dev'}
                      onChange={(value) => handleEnvironmentChange('pya', value)}
                      ariaLabel="Select PYA environment"
                    />
                  </Box>
                </Grid>

                {/* AWS Environment */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      AWS Environment
                    </Typography>
                    <SegmentedToggle
                      options={awsOptions}
                      value={formData.ecosystem_settings.aws || 'dev'}
                      onChange={(value) => handleEnvironmentChange('aws', value)}
                      ariaLabel="Select AWS environment"
                    />
                  </Box>
                </Grid>

                {/* MBAI Environment (Read-only) */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      MBAI Environment
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 1.5,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          fontWeight: 500
                        }}
                      >
                        Prod (Read-only)
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        mt: 0.5,
                        color: '#666'
                      }}
                    >
                      MBAI always uses production environment
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Environment Auto-Selection Info */}
              {formData.purpose && (
                <Box 
                  sx={{ 
                    mt: 3,
                    p: 2, 
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #1976d2',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#1565c0' }}>
                    <strong>Auto-selected for {formData.purpose}:</strong> Environments have been 
                    automatically configured based on your selected purpose. You can modify these 
                    settings as needed.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Information Panel */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" sx={{ color: '#856404' }}>
              <strong>System Integration:</strong> When enabled, your container will be connected 
              to external systems for data synchronization and advanced features. Environment 
              settings are automatically configured based on your container's purpose but can 
              be customized.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
