import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Typography,
  FormHelperText
} from '@mui/material';
import { UseEditContainerReturn } from '../../../hooks/useEditContainer';
import { StyledSection, StyledFieldRow } from '../EditContainerPanel.styles';
import { SegmentedButton } from '../../../../../shared/components/ui/SegmentedButton';

export interface ContainerInformationSectionProps {
  editContainerHook: UseEditContainerReturn;
  disabled?: boolean;
}

export const ContainerInformationSection: React.FC<ContainerInformationSectionProps> = ({
  editContainerHook,
  disabled = false
}) => {
  const {
    formData,
    availableTenants,
    actions,
    getValidationErrorsForField,
    hasValidationErrorsForField,
    getSeedTypeOptions,
    getSelectedSeedTypes
  } = editContainerHook;

  const handleContainerTypeChange = (type: 'physical' | 'virtual') => {
    actions.toggleContainerType(type);
  };

  const handleTenantChange = (tenantId: number | null) => {
    actions.updateFormField('tenantId', tenantId);
  };

  const handlePurposeChange = (purpose: 'development' | 'research' | 'production') => {
    actions.updateFormField('purpose', purpose);
    actions.handlePurposeChange(purpose);
  };

  const handleSeedTypeChange = (seedTypeIds: number[]) => {
    actions.updateFormField('seedTypes', seedTypeIds);
  };

  const handleLocationChange = (field: string, value: string) => {
    actions.updateLocation({ [field]: value });
  };

  const handleNotesChange = (notes: string) => {
    actions.updateFormField('notes', notes);
  };

  return (
    <StyledSection>
      <Typography className="section-header">Container Information</Typography>
      
      <Box className="field-stack">
        {/* Container Name (Read-only) */}
        <StyledFieldRow>
          <TextField
            label="Container Name"
            value={formData.name}
            disabled={true}
            fullWidth
            variant="outlined"
            size="small"
            helperText="Container name cannot be changed"
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />
        </StyledFieldRow>

        {/* Tenant Selection */}
        <StyledFieldRow>
          <FormControl 
            fullWidth 
            size="small" 
            error={hasValidationErrorsForField('tenantId')}
            disabled={disabled}
          >
            <InputLabel>Tenant *</InputLabel>
            <Select
              value={formData.tenantId || ''}
              onChange={(e) => handleTenantChange(e.target.value as number)}
              label="Tenant *"
              sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              {availableTenants.map((tenant) => (
                <MenuItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </MenuItem>
              ))}
            </Select>
            {hasValidationErrorsForField('tenantId') && (
              <FormHelperText>
                {getValidationErrorsForField('tenantId')[0]?.message}
              </FormHelperText>
            )}
          </FormControl>
        </StyledFieldRow>

        {/* Container Type */}
        <StyledFieldRow>
          <SegmentedButton
            label="Container Type"
            options={[
              { value: 'physical', label: 'Physical' },
              { value: 'virtual', label: 'Virtual' }
            ]}
            value={formData.type}
            onChange={(value) => handleContainerTypeChange(value as 'physical' | 'virtual')}
            disabled={disabled}
          />
        </StyledFieldRow>

        {/* Purpose */}
        <StyledFieldRow>
          <FormControl 
            fullWidth 
            size="small" 
            error={hasValidationErrorsForField('purpose')}
            disabled={disabled}
          >
            <InputLabel>Purpose *</InputLabel>
            <Select
              value={formData.purpose}
              onChange={(e) => handlePurposeChange(e.target.value as 'development' | 'research' | 'production')}
              label="Purpose *"
              sx={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="research">Research</MenuItem>
              <MenuItem value="production">Production</MenuItem>
            </Select>
            {hasValidationErrorsForField('purpose') && (
              <FormHelperText>
                {getValidationErrorsForField('purpose')[0]?.message}
              </FormHelperText>
            )}
          </FormControl>
        </StyledFieldRow>

        {/* Seed Types */}
        <StyledFieldRow>
          <Autocomplete
            multiple
            options={getSeedTypeOptions()}
            getOptionLabel={(option) => option.name}
            value={getSelectedSeedTypes()}
            onChange={(_, newValue) => {
              handleSeedTypeChange(newValue.map(st => st.id));
            }}
            onInputChange={(_, newValue) => {
              actions.searchSeedTypes(newValue);
            }}
            disabled={disabled}
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
                label="Seed Type Variants *"
                placeholder="Search and select seed types"
                error={hasValidationErrorsForField('seedTypes')}
                helperText={
                  hasValidationErrorsForField('seedTypes')
                    ? getValidationErrorsForField('seedTypes')[0]?.message
                    : undefined
                }
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }
                }}
              />
            )}
            size="small"
          />
        </StyledFieldRow>

        {/* Location (Physical containers only) */}
        {formData.type === 'physical' && (
          <>
            <StyledFieldRow>
              <TextField
                label="Location - City *"
                value={formData.location?.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                disabled={disabled}
                fullWidth
                variant="outlined"
                size="small"
                error={hasValidationErrorsForField('location.city')}
                helperText={
                  hasValidationErrorsForField('location.city')
                    ? getValidationErrorsForField('location.city')[0]?.message
                    : undefined
                }
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }
                }}
              />
            </StyledFieldRow>
            
            <StyledFieldRow>
              <TextField
                label="Location - Country *"
                value={formData.location?.country || ''}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                disabled={disabled}
                fullWidth
                variant="outlined"
                size="small"
                error={hasValidationErrorsForField('location.country')}
                helperText={
                  hasValidationErrorsForField('location.country')
                    ? getValidationErrorsForField('location.country')[0]?.message
                    : undefined
                }
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }
                }}
              />
            </StyledFieldRow>
            
            <StyledFieldRow>
              <TextField
                label="Address *"
                value={formData.location?.address || ''}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                disabled={disabled}
                fullWidth
                variant="outlined"
                size="small"
                error={hasValidationErrorsForField('location.address')}
                helperText={
                  hasValidationErrorsForField('location.address')
                    ? getValidationErrorsForField('location.address')[0]?.message
                    : undefined
                }
                sx={{ 
                  '& .MuiInputBase-input': { 
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }
                }}
              />
            </StyledFieldRow>
          </>
        )}

        {/* Notes */}
        <StyledFieldRow>
          <TextField
            label="Description"
            value={formData.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={disabled}
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            size="small"
            placeholder="Primary production container for Farm A."
            sx={{ 
              '& .MuiInputBase-input': { 
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif'
              }
            }}
          />
        </StyledFieldRow>
      </Box>
    </StyledSection>
  );
};

export default ContainerInformationSection;