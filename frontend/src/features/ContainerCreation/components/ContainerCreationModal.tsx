import React, { useState, useCallback, useEffect } from 'react';
import { 
  Modal,
  Box, 
  Typography, 
  IconButton, 
  TextField,
  FormControlLabel,
  Switch,
  Checkbox,
  Divider,
  MenuItem,
  Chip,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ContainerFormData } from '../types';
import { SegmentedToggle } from '../../../shared/components/ui/SegmentedToggle';
import { CreateContainer } from '../../../shared/components/ui/CreateContainer';
import { useContainerCreation } from '../hooks/useContainerCreation';

interface ContainerCreationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContainerCreationModal: React.FC<ContainerCreationModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const {
    formState,
    updateFormData,
    updateContainerType,
    updateEcosystemSettings,
    copyEnvironmentFromContainer,
    submitForm,
    resetForm
  } = useContainerCreation();

  const [localFormData, setLocalFormData] = useState<ContainerFormData>(formState.data);

  useEffect(() => {
    setLocalFormData(formState.data);
  }, [formState.data]);

  const updateLocalFormData = useCallback((updates: Partial<ContainerFormData>) => {
    setLocalFormData(prev => ({ ...prev, ...updates }));
    updateFormData(updates);
  }, [updateFormData]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(async () => {
    try {
      await submitForm(localFormData);
      onSuccess();
      resetForm();
    } catch (error) {
      // Error handling is managed by the submitForm hook
      // which sets form errors in the UI state
      console.error('Container creation failed:', error);
    }
  }, [localFormData, submitForm, onSuccess, resetForm]);

  const handleContainerTypeChange = useCallback((type: string) => {
    const containerType = type as 'physical' | 'virtual';
    updateContainerType(containerType);
    setLocalFormData(prev => ({ ...prev, type: containerType }));
  }, [updateContainerType]);

  const handleEcosystemConnectedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const connected = event.target.checked;
    updateEcosystemSettings(connected, localFormData.purpose || undefined);
    setLocalFormData(prev => ({ ...prev, ecosystem_connected: connected }));
  }, [updateEcosystemSettings, localFormData.purpose]);

  // Auto-update environment settings when purpose changes
  useEffect(() => {
    if (localFormData.ecosystem_connected && localFormData.purpose) {
      updateEcosystemSettings(true, localFormData.purpose);
    }
  }, [localFormData.purpose, localFormData.ecosystem_connected, updateEcosystemSettings]);

  const handleSeedTypesChange = useCallback((_event: any, newValue: any[]) => {
    const seedTypeIds = newValue.map(option => option.id);
    updateLocalFormData({ seed_type_ids: seedTypeIds });
  }, [updateLocalFormData]);

  const selectedSeedTypes = localFormData.seed_type_ids.map(id => 
    formState.options.seedTypes.find(st => st.id === id)
  ).filter(Boolean);

  const containerTypeOptions = [
    { id: 'physical', value: 'physical', label: 'Physical' },
    { id: 'virtual', value: 'virtual', label: 'Virtual' }
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end'
      }}
    >
      <Box
        sx={{
          width: '400px',
          height: '100vh',
          bgcolor: '#ffffff',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
            borderBottom: '1px solid #e5e5e5',
            minHeight: '60px'
          }}
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              fontSize: '16px',
              color: '#000000',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Create New Container
          </Typography>
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: '#666666',
              p: 0.5,
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
          {formState.loading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px' 
              }}
            >
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Container Information */}
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
                  Container Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Container Name */}
                  <TextField
                    label="Container Name"
                    value={localFormData.name}
                    onChange={(e) => updateLocalFormData({ name: e.target.value })}
                    error={!!formState.errors.name}
                    helperText={formState.errors.name}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                      },
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '6px'
                      }
                    }}
                  />

                  {/* Tenant */}
                  <TextField
                    select
                    label="Tenant"
                    value={localFormData.tenant_id || ''}
                    onChange={(e) => updateLocalFormData({ tenant_id: parseInt(e.target.value) })}
                    error={!!formState.errors.tenant_id}
                    helperText={formState.errors.tenant_id}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                      },
                      '& .MuiOutlinedInput-root': {
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '6px'
                      }
                    }}
                  >
                    {formState.options.tenants.map((tenant) => (
                      <MenuItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Container Type */}
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1.5,
                        fontSize: '14px',
                        color: '#000000',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Container Type
                    </Typography>
                    <SegmentedToggle
                      options={containerTypeOptions}
                      value={localFormData.type}
                      onChange={handleContainerTypeChange}
                      size="md"
                      fullWidth
                    />
                  </Box>

                  {/* Purpose */}
                  <TextField
                    select
                    label="Purpose"
                    value={localFormData.purpose || ''}
                    onChange={(e) => updateLocalFormData({ purpose: e.target.value as any })}
                    error={!!formState.errors.purpose}
                    helperText={formState.errors.purpose}
                    fullWidth
                    size="small"
                  >
                    {formState.options.purposes.map((purpose) => (
                      <MenuItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Seed Type Variant(s) */}
                  <Autocomplete
                    multiple
                    options={formState.options.seedTypes}
                    getOptionLabel={(option) => `${option.name} (${option.variety})`}
                    value={selectedSeedTypes as any[]}
                    onChange={handleSeedTypesChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option.name}
                          size="small"
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seed Type Variant(s)"
                        error={!!formState.errors.seed_type_ids}
                        helperText={formState.errors.seed_type_ids}
                        size="small"
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    filterSelectedOptions
                    disableCloseOnSelect
                  />

                  {/* Location (Physical containers only) */}
                  {localFormData.type === 'physical' && (
                    <TextField
                      label="Location"
                      value={localFormData.location?.address || ''}
                      onChange={(e) => updateLocalFormData({
                        location: {
                          ...localFormData.location,
                          address: e.target.value,
                          city: e.target.value, // Simplified for demo
                          country: 'USA' // Default
                        }
                      })}
                      error={!!formState.errors.location}
                      helperText={formState.errors.location}
                      fullWidth
                      size="small"
                    />
                  )}

                  {/* Notes */}
                  <TextField
                    label="Notes (optional)"
                    value={localFormData.notes}
                    onChange={(e) => updateLocalFormData({ notes: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>

              <Divider />

              {/* Container Settings */}
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
                  Settings
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Enable Shadow Service */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localFormData.shadow_service_enabled}
                        onChange={(e) => updateLocalFormData({ shadow_service_enabled: e.target.checked })}
                        size="small"
                      />
                    }
                    label="Enable Shadow Service"
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        fontSize: '14px'
                      }
                    }}
                  />

                  {/* Virtual Container Settings */}
                  {localFormData.type === 'virtual' && (
                    <>
                      {/* Copy Environment from Container */}
                      <TextField
                        select
                        label="Copy Environment from Container"
                        value={localFormData.copied_environment_from || ''}
                        onChange={async (e) => {
                          const value = e.target.value;
                          const containerId = value ? parseInt(value) : null;
                          
                          updateLocalFormData({ 
                            copied_environment_from: containerId 
                          });
                          
                          // Copy environment settings from the selected container
                          if (containerId) {
                            try {
                              await copyEnvironmentFromContainer(containerId);
                            } catch (error) {
                              console.error('Failed to copy environment:', error);
                            }
                          }
                        }}
                        fullWidth
                        size="small"
                        helperText="Select a container to copy its environment settings"
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontSize: '14px',
                            fontFamily: 'Inter, sans-serif'
                          },
                          '& .MuiOutlinedInput-root': {
                            fontSize: '14px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '6px'
                          }
                        }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {formState.options.virtualContainers.map((container) => (
                          <MenuItem key={container.id} value={container.id}>
                            {container.name}
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* Run Robotics Simulation */}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={localFormData.robotics_simulation_enabled}
                            onChange={(e) => updateLocalFormData({ robotics_simulation_enabled: e.target.checked })}
                            size="small"
                          />
                        }
                        label="Run Robotics Simulation"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '14px'
                          }
                        }}
                      />
                    </>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Ecosystem Settings */}
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
                  Ecosystem Settings
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFormData.ecosystem_connected}
                      onChange={handleEcosystemConnectedChange}
                      size="small"
                    />
                  }
                  label="Connect to other systems after creation"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px'
                    }
                  }}
                />

                {/* Environment settings (if connected) */}
                {localFormData.ecosystem_connected && (
                  <Box sx={{ ml: 4, mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, fontSize: '14px' }}>
                      System Integration Settings:
                    </Typography>
                    
                    {/* FA Integration */}
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 500,
                          color: '#000000',
                          fontSize: '13px'
                        }}
                      >
                        FA Integration
                      </Typography>
                      <SegmentedToggle
                        options={[
                          { id: 'alpha', value: 'alpha', label: 'Alpha' },
                          { id: 'prod', value: 'prod', label: 'Prod' }
                        ]}
                        value={localFormData.ecosystem_settings.fa || 'alpha'}
                        onChange={(value) => updateLocalFormData({
                          ecosystem_settings: {
                            ...localFormData.ecosystem_settings,
                            fa: value as 'alpha' | 'prod'
                          }
                        })}
                        ariaLabel="Select FA environment"
                        size="sm"
                        fullWidth
                      />
                    </Box>

                    {/* FA Environment */}
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 500,
                          color: '#000000',
                          fontSize: '13px'
                        }}
                      >
                        FA Environment
                      </Typography>
                      <SegmentedToggle
                        options={[
                          { id: 'dev', value: 'dev', label: 'Dev' },
                          { id: 'test', value: 'test', label: 'Test' },
                          { id: 'stage', value: 'stage', label: 'Stage' }
                        ]}
                        value={localFormData.ecosystem_settings.pya || 'dev'}
                        onChange={(value) => updateLocalFormData({
                          ecosystem_settings: {
                            ...localFormData.ecosystem_settings,
                            pya: value as 'dev' | 'test' | 'stage'
                          }
                        })}
                        ariaLabel="Select FA environment"
                        size="sm"
                        fullWidth
                      />
                    </Box>

                    {/* AWS Environment */}
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 500,
                          color: '#000000',
                          fontSize: '13px'
                        }}
                      >
                        AWS Environment
                      </Typography>
                      <SegmentedToggle
                        options={[
                          { id: 'dev', value: 'dev', label: 'Dev' },
                          { id: 'prod', value: 'prod', label: 'Prod' }
                        ]}
                        value={localFormData.ecosystem_settings.aws || 'dev'}
                        onChange={(value) => updateLocalFormData({
                          ecosystem_settings: {
                            ...localFormData.ecosystem_settings,
                            aws: value as 'dev' | 'prod'
                          }
                        })}
                        ariaLabel="Select AWS environment"
                        size="sm"
                        fullWidth
                      />
                    </Box>

                    {/* MBAI Environment (Read-only) */}
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 500,
                          color: '#000000',
                          fontSize: '13px'
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

                    {/* Environment Auto-Selection Info */}
                    {localFormData.purpose && (
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
                          <strong>Auto-selected for {localFormData.purpose}:</strong> Environments have been 
                          automatically configured based on your selected purpose.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Information Panel */}
                <Box 
                  sx={{ 
                    mt: 3,
                    p: 2, 
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#856404', fontSize: '12px' }}>
                    <strong>System Integration:</strong> When enabled, your container will be connected 
                    to external systems for data synchronization and advanced features. Environment 
                    settings are automatically configured based on your container's purpose but can 
                    be customized.
                  </Typography>
                </Box>
              </Box>

            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            px: 3, 
            py: 2.5,
            borderTop: '1px solid #e5e5e5',
            display: 'flex',
            minHeight: '70px',
            alignItems: 'center'
          }}
        >
          <CreateContainer
            text="Create Container"
            onClick={handleSubmit}
            loading={formState.submitting}
            disabled={formState.submitting}
            type="button"
            aria-label="Create new container"
            className="full-width-button"
          />
        </Box>
      </Box>
    </Modal>
  );
};
