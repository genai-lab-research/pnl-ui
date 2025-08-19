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
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ContainerFormData, ContainerFormOptions, ContainerFormErrors } from '../types';
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

  const handleSeedTypesChange = useCallback((event: any, newValue: any[]) => {
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

              {/* Settings */}
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
              </Box>

              <Divider />

              {/* System Integration */}
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
