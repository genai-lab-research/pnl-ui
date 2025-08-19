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
    submitForm,
    resetForm
  } = useContainerEdit(containerId || undefined);

  const [localFormData, setLocalFormData] = useState<ContainerEditFormData>(formState.data);

  useEffect(() => {
    setLocalFormData(formState.data);
  }, [formState.data]);

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
    if (containerId) {
      resetForm(containerId);
    }
    onClose();
  }, [resetForm, onClose, containerId]);

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
                    value={localFormData.name}
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
                    value={localFormData.tenant_id || ''}
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

                  {/* Seed Type Variant(s) */}
                  <Autocomplete
                    multiple
                    options={formState.options.seedTypes}
                    groupBy={(option) => option.variety || 'Other'}
                    getOptionLabel={(option) => {
                      // Display format: "Name - Variety (Supplier)"
                      const label = option.name;
                      const details = [];
                      if (option.variety) details.push(option.variety);
                      if (option.supplier) details.push(`by ${option.supplier}`);
                      return details.length > 0 ? `${label} - ${details.join(' ')}` : label;
                    }}
                    value={selectedSeedTypes}
                    onChange={handleSeedTypesChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const label = option.variety ? `${option.name} (${option.variety})` : option.name;
                        return (
                          <Chip
                            variant="outlined"
                            label={label}
                            size="small"
                            {...getTagProps({ index })}
                            key={option.id}
                            sx={{
                              '& .MuiChip-label': {
                                fontSize: '12px',
                                fontFamily: 'Inter, sans-serif'
                              }
                            }}
                          />
                        );
                      })
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        {(option.variety || option.supplier) && (
                          <Typography variant="caption" color="text.secondary">
                            {option.variety && `Variety: ${option.variety}`}
                            {option.variety && option.supplier && ' • '}
                            {option.supplier && `Supplier: ${option.supplier}`}
                          </Typography>
                        )}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Seed Type Variant(s)"
                        error={!!formState.errors.seed_type_ids}
                        helperText={formState.errors.seed_type_ids || "Select one or more seed types with their variants"}
                        required
                        size="small"
                        placeholder={selectedSeedTypes.length === 0 ? "Search seed types..." : ""}
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
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    filterSelectedOptions
                    disableCloseOnSelect
                    loading={formState.loading}
                    noOptionsText="No seed types available"
                    sx={{
                      '& .MuiAutocomplete-tag': {
                        margin: '2px'
                      }
                    }}
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
                      required
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
                        onChange={(e) => updateLocalFormData({ 
                          copied_environment_from: e.target.value ? parseInt(e.target.value) : null 
                        })}
                        fullWidth
                        size="small"
                        helperText="Only for Virtual containers"
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

                {/* Environment toggles (if connected) */}
                {localFormData.ecosystem_connected && (
                  <Box sx={{ ml: 4, mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Environment Settings:
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      FA Environment: {typeof localFormData.ecosystem_settings.fa === 'string' ? localFormData.ecosystem_settings.fa : 'None'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PYA Environment: {typeof localFormData.ecosystem_settings.pya === 'string' ? localFormData.ecosystem_settings.pya : 'None'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      AWS Environment: {typeof localFormData.ecosystem_settings.aws === 'string' ? localFormData.ecosystem_settings.aws : 'None'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      MBAI Environment: Prod only (disabled)
                    </Typography>
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
