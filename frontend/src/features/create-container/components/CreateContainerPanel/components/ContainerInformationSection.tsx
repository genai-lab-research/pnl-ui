import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Autocomplete,
  Chip
} from '@mui/material';
import { ContainerFormData, ValidationError } from '../../../models/create-container.model';
import { SeedType, Tenant, Location } from '../../../../../types/containers';
import { SectionWrapper, SectionTitle, InputGroup, FieldSpacing, StyledSegmentedButton } from './SectionComponents.styles';

interface ContainerInformationSectionProps {
  formData: ContainerFormData;
  availableTenants: Tenant[];
  availableSeedTypes: SeedType[];
  showLocationFields: boolean;
  selectedSeedTypesDisplay: string;
  locationDisplay: string;
  onFieldUpdate: <K extends keyof ContainerFormData>(field: K, value: ContainerFormData[K]) => void;
  onLocationUpdate: (location: Partial<Location>) => void;
  onContainerTypeToggle: (type: 'physical' | 'virtual') => void;
  onSeedTypeAdd: (seedTypeId: number) => void;
  onSeedTypeRemove: (seedTypeId: number) => void;
  getFieldErrors: (field: string) => ValidationError[];
  hasFieldErrors: (field: string) => boolean;
  getSelectedSeedTypes: () => SeedType[];
  getTenantName: (tenantId: number | null) => string;
}

export const ContainerInformationSection: React.FC<ContainerInformationSectionProps> = ({
  formData,
  availableTenants,
  availableSeedTypes,
  showLocationFields,
  selectedSeedTypesDisplay,
  locationDisplay,
  onFieldUpdate,
  onLocationUpdate,
  onContainerTypeToggle,
  onSeedTypeAdd,
  onSeedTypeRemove,
  getFieldErrors,
  hasFieldErrors,
  getSelectedSeedTypes,
  getTenantName
}) => {
  const nameErrors = getFieldErrors('name');
  const tenantErrors = getFieldErrors('tenantId');
  const purposeErrors = getFieldErrors('purpose');
  const seedTypeErrors = getFieldErrors('seedTypes');

  const handleSeedTypeChange = (_: any, value: SeedType[]) => {
    const currentIds = formData.seedTypes;
    const newIds = value.map(st => st.id);
    
    // Handle additions
    newIds.forEach(id => {
      if (!currentIds.includes(id)) {
        onSeedTypeAdd(id);
      }
    });
    
    // Handle removals
    currentIds.forEach(id => {
      if (!newIds.includes(id)) {
        onSeedTypeRemove(id);
      }
    });
  };

  const selectedSeedTypes = getSelectedSeedTypes();

  return (
    <SectionWrapper>
      <SectionTitle>Container Information</SectionTitle>
      
      <InputGroup>
        <TextField
          fullWidth
          label="Container Name"
          placeholder="Container Name"
          value={formData.name}
          onChange={(e) => onFieldUpdate('name', e.target.value)}
          error={hasFieldErrors('name')}
          helperText={nameErrors[0]?.message}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              '& fieldset': {
                borderColor: 'rgba(76, 78, 100, 0.22)',
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'rgba(76, 78, 100, 0.6)'
            }
          }}
        />
        
        <FieldSpacing />
        
        <FormControl fullWidth required error={hasFieldErrors('tenantId')}>
          <InputLabel sx={{ fontSize: '14px', color: 'rgba(76, 78, 100, 0.6)' }}>
            Tenant
          </InputLabel>
          <Select
            value={formData.tenantId || ''}
            label="Tenant"
            onChange={(e) => onFieldUpdate('tenantId', Number(e.target.value))}
            sx={{
              borderRadius: '6px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(76, 78, 100, 0.22)',
              }
            }}
          >
            {availableTenants.map((tenant) => (
              <MenuItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </MenuItem>
            ))}
          </Select>
          {tenantErrors[0] && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {tenantErrors[0].message}
            </Typography>
          )}
        </FormControl>

        <FieldSpacing />

        <Box>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '12px', 
              fontWeight: 400, 
              color: '#4C4E64',
              mb: 1 
            }}
          >
            Container Type
          </Typography>
          <StyledSegmentedButton>
            <button
              type="button"
              className={`segment ${formData.type === 'physical' ? 'active' : 'inactive'}`}
              onClick={() => onContainerTypeToggle('physical')}
            >
              Physical
            </button>
            <button
              type="button"
              className={`segment ${formData.type === 'virtual' ? 'active' : 'inactive'}`}
              onClick={() => onContainerTypeToggle('virtual')}
            >
              Virtual
            </button>
          </StyledSegmentedButton>
        </Box>

        <FieldSpacing />

        <FormControl fullWidth required error={hasFieldErrors('purpose')}>
          <InputLabel sx={{ fontSize: '14px', color: 'rgba(76, 78, 100, 0.6)' }}>
            Purpose
          </InputLabel>
          <Select
            value={formData.purpose}
            label="Purpose"
            onChange={(e) => onFieldUpdate('purpose', e.target.value as 'development' | 'research' | 'production')}
            sx={{
              borderRadius: '6px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(76, 78, 100, 0.22)',
              }
            }}
          >
            <MenuItem value="development">Development</MenuItem>
            <MenuItem value="research">Research</MenuItem>
            <MenuItem value="production">Production</MenuItem>
          </Select>
          {purposeErrors[0] && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {purposeErrors[0].message}
            </Typography>
          )}
        </FormControl>

        <FieldSpacing />

        <Autocomplete
          multiple
          options={availableSeedTypes}
          getOptionLabel={(option) => `${option.name} - ${option.variety}`}
          value={selectedSeedTypes}
          onChange={handleSeedTypeChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option.name}
                {...getTagProps({ index })}
                key={option.id}
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seed Type Variant(s)"
              placeholder="Select seed types"
              required
              error={hasFieldErrors('seedTypes')}
              helperText={seedTypeErrors[0]?.message}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'rgba(76, 78, 100, 0.22)',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: 'rgba(76, 78, 100, 0.6)'
                }
              }}
            />
          )}
          sx={{ width: '100%' }}
        />

        {showLocationFields && (
          <>
            <FieldSpacing />
            <TextField
              fullWidth
              label="City"
              placeholder="City"
              value={formData.location?.city || ''}
              onChange={(e) => onLocationUpdate({ city: e.target.value })}
              error={hasFieldErrors('location.city')}
              helperText={getFieldErrors('location.city')[0]?.message}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'rgba(76, 78, 100, 0.22)',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: 'rgba(76, 78, 100, 0.6)'
                }
              }}
            />
            
            <FieldSpacing />
            <TextField
              fullWidth
              label="Country"
              placeholder="Country"
              value={formData.location?.country || ''}
              onChange={(e) => onLocationUpdate({ country: e.target.value })}
              error={hasFieldErrors('location.country')}
              helperText={getFieldErrors('location.country')[0]?.message}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'rgba(76, 78, 100, 0.22)',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: 'rgba(76, 78, 100, 0.6)'
                }
              }}
            />
            
            <FieldSpacing />
            <TextField
              fullWidth
              label="Address"
              placeholder="Address"
              value={formData.location?.address || ''}
              onChange={(e) => onLocationUpdate({ address: e.target.value })}
              error={hasFieldErrors('location.address')}
              helperText={getFieldErrors('location.address')[0]?.message}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  '& fieldset': {
                    borderColor: 'rgba(76, 78, 100, 0.22)',
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: 'rgba(76, 78, 100, 0.6)'
                }
              }}
            />
          </>
        )}

        <FieldSpacing />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes (optional)"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => onFieldUpdate('notes', e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              '& fieldset': {
                borderColor: 'rgba(76, 78, 100, 0.22)',
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'rgba(76, 78, 100, 0.6)'
            }
          }}
        />
      </InputGroup>
    </SectionWrapper>
  );
};