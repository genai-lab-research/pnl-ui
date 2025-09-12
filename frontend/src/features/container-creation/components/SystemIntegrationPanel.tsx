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
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 2.5, 
          fontWeight: 600,
          fontSize: '14px',
          color: '#000000',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        System Integration
      </Typography>

      <Grid container spacing={3}>
        {/* Ecosystem Connection Toggle */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.ecosystem_connected}
                  onChange={handleEcosystemConnectedChange}
                  color="primary"
                  size="small"
                />
              }
              label="Connect to other systems after creation"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
          </Box>
        </Grid>

        {/* Environment Configuration Panel */}
        {formData.ecosystem_connected && (
          <Grid item xs={12}>
            <Box sx={{ ml: 2, mt: 1 }}>
              <Grid container spacing={2}>
                {/* FA Integration */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#000000',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      FA Integration
                    </Typography>
                    <SegmentedToggle
                      options={faOptions}
                      value={formData.ecosystem_settings.fa || 'alpha'}
                      onChange={(value) => handleEnvironmentChange('fa', value)}
                      ariaLabel="Select FA environment"
                      size="sm"
                      fullWidth
                    />
                  </Box>
                </Grid>

                {/* FA Environment */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#000000',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      FA Environment
                    </Typography>
                    <SegmentedToggle
                      options={pyaOptions}
                      value={formData.ecosystem_settings.pya || 'dev'}
                      onChange={(value) => handleEnvironmentChange('pya', value)}
                      ariaLabel="Select FA environment"
                      size="sm"
                      fullWidth
                    />
                  </Box>
                </Grid>

                {/* AWS Environment */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#000000',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      AWS Environment
                    </Typography>
                    <SegmentedToggle
                      options={awsOptions}
                      value={formData.ecosystem_settings.aws || 'dev'}
                      onChange={(value) => handleEnvironmentChange('aws', value)}
                      ariaLabel="Select AWS environment"
                      size="sm"
                      fullWidth
                    />
                  </Box>
                </Grid>

                {/* MBAI Environment (Read-only) */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 500,
                        color: '#000000',
                        fontSize: '13px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      MBAI Environment
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        background: 'transparent',
                        border: '1px solid rgba(109, 120, 141, 0.5)',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        width: 'fit-content'
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          backgroundColor: '#e0e0e0',
                          color: '#666',
                          fontWeight: 500,
                          fontSize: '12px',
                          minWidth: '80px',
                          height: '24px',
                          fontFamily: 'Roboto, sans-serif'
                        }}
                      >
                        Prod
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Environment Auto-Selection Info */}
              {formData.purpose && (
                <Box 
                  sx={{ 
                    mt: 2,
                    p: 1.5, 
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #1976d2',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#1565c0', fontSize: '12px' }}>
                    <strong>Auto-selected for {formData.purpose}:</strong> Environments have been 
                    automatically configured based on your selected purpose.
                  </Typography>
                </Box>
              )}
            </Box>
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
