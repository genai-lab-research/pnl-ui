import React, { useCallback } from 'react';
import { 
  Box, 
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Chip
} from '@mui/material';
import { ContainerFormData, ContainerFormOptions, ContainerFormErrors } from '../types';
import { Select } from '../../../shared/components/ui/Select';
import { SegmentedToggle } from '../../../shared/components/ui/SegmentedToggle';
import { ContainerTypeToggle } from './ContainerTypeToggle';
import { useNameValidation } from '../hooks/useNameValidation';

interface ContainerInformationFormProps {
  formData: ContainerFormData;
  errors: ContainerFormErrors;
  options: ContainerFormOptions;
  onChange: (updates: Partial<ContainerFormData>) => void;
}

export const ContainerInformationForm: React.FC<ContainerInformationFormProps> = ({
  formData,
  errors,
  options,
  onChange
}) => {
  const {
    isValidating,
    isValid,
    suggestions,
    error: nameValidationError,
    validateNameDebounced
  } = useNameValidation();

  const handleNameChange = useCallback((value: string) => {
    onChange({ name: value });
    validateNameDebounced(value);
  }, [onChange, validateNameDebounced]);

  const handleTenantChange = useCallback((value: string) => {
    onChange({ tenant_id: parseInt(value) });
  }, [onChange]);

  const handlePurposeChange = useCallback((value: string) => {
    const newPurpose = value as 'development' | 'research' | 'production';
    onChange({ purpose: newPurpose });
  }, [onChange]);

  const handleSeedTypesChange = useCallback((event: any, newValue: any[]) => {
    const seedTypeIds = newValue.map(option => option.id);
    onChange({ seed_type_ids: seedTypeIds });
  }, [onChange]);

  const handleLocationChange = useCallback((field: keyof typeof formData.location, value: string) => {
    onChange({
      location: {
        ...formData.location,
        [field]: value
      }
    });
  }, [formData.location, onChange]);

  const handleNotesChange = useCallback((value: string) => {
    onChange({ notes: value });
  }, [onChange]);

  const selectedSeedTypes = formData.seed_type_ids.map(id => 
    options.seedTypes.find(st => st.id === id)
  ).filter(Boolean);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Container Name */}
        <Grid item xs={12}>
          <TextField
            label="Container Name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={!!(errors.name || nameValidationError)}
            helperText={
              errors.name || nameValidationError || 
              (isValidating ? 'Validating name...' : 
               isValid === false && suggestions.length > 0 ? 
               `Name not available. Suggestions: ${suggestions.join(', ')}` : '')
            }
            required
            fullWidth
            placeholder="Enter a unique container name"
            inputProps={{
              'aria-describedby': 'container-name-help'
            }}
          />
        </Grid>

        {/* Tenant Selection */}
        <Grid item xs={12} md={6}>
          <Select
            label="Tenant"
            placeholder="Select a tenant"
            value={formData.tenant_id?.toString() || ''}
            onChange={handleTenantChange}
            error={!!errors.tenant_id}
            errorMessage={errors.tenant_id}
            required
            options={options.tenants.map(tenant => ({
              value: tenant.id.toString(),
              label: tenant.name
            }))}
            ariaLabel="Select tenant for container"
          />
        </Grid>

        {/* Container Type Toggle */}
        <Grid item xs={12} md={6}>
          <ContainerTypeToggle
            value={formData.type}
            onChange={(type) => onChange({ type })}
          />
        </Grid>

        {/* Purpose Selection */}
        <Grid item xs={12} md={6}>
          <Select
            label="Purpose"
            placeholder="Select container purpose"
            value={formData.purpose || ''}
            onChange={handlePurposeChange}
            error={!!errors.purpose}
            errorMessage={errors.purpose}
            required
            options={options.purposes}
            ariaLabel="Select container purpose"
          />
        </Grid>

        {/* Seed Types Multi-Select */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={options.seedTypes}
            getOptionLabel={(option) => `${option.name} (${option.variety})`}
            value={selectedSeedTypes as any[]}
            onChange={handleSeedTypesChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seed Types"
                placeholder="Select seed types"
                error={!!errors.seed_type_ids}
                helperText={errors.seed_type_ids}
                required
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions
            disableCloseOnSelect
          />
        </Grid>

        {/* Location Fields (Physical containers only) */}
        {formData.type === 'physical' && (
          <>
            <Grid item xs={12}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: '#666'
                }}
              >
                Location Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                value={formData.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                error={!!errors.location}
                required
                fullWidth
                placeholder="Enter city"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Country"
                value={formData.location?.country || ''}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                error={!!errors.location}
                required
                fullWidth
                placeholder="Enter country"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Address"
                value={formData.location?.address || ''}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                required
                fullWidth
                placeholder="Enter address"
              />
            </Grid>
          </>
        )}

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Optional notes about this container"
            inputProps={{
              maxLength: 500
            }}
            helperText={`${formData.notes.length}/500 characters`}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
