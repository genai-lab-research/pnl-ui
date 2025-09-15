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
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ContainerEditFormData } from '../types';
import { SeedType } from '../../../types/containers';
import { SegmentedToggle } from '../../../shared/components/ui/SegmentedToggle';
import { useContainerEdit } from '../hooks/useContainerEdit';

interface EditContainerModalProps {
  open: boolean;
  containerId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditContainerModal: React.FC<EditContainerModalProps> = ({
  open,
  containerId,
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
  } = useContainerEdit(containerId || undefined);

  const [localFormData, setLocalFormData] = useState<ContainerEditFormData>(formState.data);

  useEffect(() => {
    setLocalFormData(formState.data);
  }, [formState.data]);

  // Clear sensitive fields on open while data is loading to avoid showing previous container data
  useEffect(() => {
    if (open) {
      setLocalFormData(prev => ({
        ...prev,
        purpose: undefined,
        seed_type_ids: [],
        location: { city: '', country: '', address: '' }
      }));
    }
  }, [open]);

  const updateLocalFormData = useCallback((updates: Partial<ContainerEditFormData>) => {
    console.log('📝 EditContainerModal: Form data updated:', updates);
    setLocalFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log('📝 EditContainerModal: New form data:', newData);
      return newData;
    });
    updateFormData(updates);
  }, [updateFormData]);

  const handleClose = useCallback(() => {
    // Fully clear hook state so next open starts clean
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(async () => {
    try {
      console.log('📝 EditContainerModal: Starting form submission...', localFormData);
      await submitForm(localFormData);
      console.log('✅ EditContainerModal: Form submission successful, calling onSuccess...');
      onSuccess();
      console.log('🚪 EditContainerModal: Closing modal...');
      handleClose();
    } catch (error) {
      console.error('❌ EditContainerModal: Container update failed:', error);
    }
  }, [localFormData, submitForm, onSuccess, handleClose]);

  const handleContainerTypeChange = useCallback((type: string) => {
    const containerType = type as 'physical' | 'virtual';
    updateContainerType(containerType);
    setLocalFormData(prev => ({ ...prev, type: containerType }));
  }, [updateContainerType]);

  const handleEcosystemConnectedChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const connected = event.target.checked;
    // Only allow changes if not already connected
    if (!localFormData.original_ecosystem_connected) {
      updateEcosystemSettings(connected, localFormData.purpose || undefined);
      setLocalFormData(prev => ({ ...prev, ecosystem_connected: connected }));
    }
  }, [updateEcosystemSettings, localFormData.purpose, localFormData.original_ecosystem_connected]);

  const handleSeedTypesChange = useCallback((event: React.SyntheticEvent, newValue: SeedType[]) => {
    const seedTypeIds = newValue.map(option => option.id);
    updateLocalFormData({ seed_type_ids: seedTypeIds });
  }, [updateLocalFormData]);

  const selectedSeedTypes = localFormData.seed_type_ids.map(id => 
    formState.options.seedTypes.find(st => st.id === id)
  ).filter(Boolean) as SeedType[];

  const containerTypeOptions = [
    { id: 'physical', value: 'physical', label: 'Physical' },
    { id: 'virtual', value: 'virtual', label: 'Virtual' }
  ];

  if (!open || !containerId) {
    return null;
  }

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
            Edit Container
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
              <Typography sx={{ ml: 2 }}>Loading container details...</Typography>
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
                  {/* Container Name - Read Only */}
                  <TextField
                    label="Container Name"
                    value={formState.loading ? '' : localFormData.name}
                    disabled
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
                        borderRadius: '6px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                    helperText="Container name cannot be changed"
                  />

                  {/* Tenant */}
                  <TextField
                    select
                    label="Tenant"
                    value={formState.loading ? '' : (localFormData.tenant_id || '')}
                    onChange={(e) => updateLocalFormData({ tenant_id: parseInt(e.target.value) })}
                    error={!!formState.errors.tenant_id}
                    helperText={formState.errors.tenant_id}
                    required
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
                      value={formState.loading ? 'physical' : localFormData.type}
                      onChange={handleContainerTypeChange}
                      size="md"
                      fullWidth
                    />
                  </Box>

                  {/* Purpose */}
                  <TextField
                    select
                    label="Purpose"
                    value={formState.loading ? '' : (localFormData.purpose || '')}
                    onChange={(e) => updateLocalFormData({ purpose: e.target.value as 'development' | 'research' | 'production' })}
                    error={!!formState.errors.purpose}
                    helperText={formState.errors.purpose}
                    required
                    fullWidth
                    size="small"
                  >
                    {formState.options.purposes.map((purpose) => (
                      <MenuItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Seed Type Variant(s) - match Create Container modal styling */}
                  <Autocomplete
                    multiple
                    options={formState.options.seedTypes}
                    getOptionLabel={(option) => `${option.name} (${option.variety})`}
                    value={formState.loading ? [] as any : selectedSeedTypes}
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
                      value={formState.loading ? '' : (localFormData.location?.address || '')}
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
                      required
                      fullWidth
                      size="small"
                    />
                  )}

                  {/* Notes */}
                  <TextField
                    label="Notes (optional)"
                    value={formState.loading ? '' : localFormData.notes}
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
                      disabled={localFormData.original_ecosystem_connected}
                      size="small"
                    />
                  }
                  label={
                    localFormData.original_ecosystem_connected 
                      ? "Connected to other systems (cannot be changed)"
                      : "Connect to other systems after creation"
                  }
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px'
                    }
                  }}
                />

                {localFormData.original_ecosystem_connected && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block' }}>
                    This container is already connected to the ecosystem and cannot be disconnected.
                  </Typography>
                )}

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
                  </Box>
                )}
              </Box>

              {/* Error Display */}
              {formState.errors.general && (
                <Alert severity="error">
                  {formState.errors.general}
                </Alert>
              )}
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
            gap: 2,
            minHeight: '70px',
            alignItems: 'center'
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={formState.submitting}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={formState.submitting || formState.loading}
            sx={{ flex: 1 }}
          >
            {formState.submitting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
