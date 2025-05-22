import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SwitchMedium } from '../../shared/components/ui/Switch/SwitchMedium';
import { CheckboxStandard } from '../../shared/components/ui/Checkbox/CheckboxStandard';
import { ButtonPrimary } from '../../shared/components/ui/Button/ButtonPrimary';
import { DrawerContainer } from '../../shared/components/ui/Container/DrawerContainer';
import containerService, { ContainerFormData } from '../../services/containerService';
import tenantService, { Tenant } from '../../services/tenantService';
import seedTypeService, { SeedType } from '../../services/seedTypeService';

// Interface for component props
interface CreateContainerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Container purpose options
const PURPOSE_OPTIONS = ['Development', 'Research', 'Production'];

const CreateContainerModal: React.FC<CreateContainerModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  // Form state
  const [formData, setFormData] = useState<ContainerFormData>({
    name: '',
    tenant: '',
    type: 'physical',
    purpose: '',
    seed_types: [],
    location: '',
    notes: '',
    shadow_service_enabled: false,
    connect_to_other_systems: false
  });

  // Loading, success and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Options for dropdowns
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [seedTypes, setSeedTypes] = useState<SeedType[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState<boolean>(false);
  const [seedTypesLoading, setSeedTypesLoading] = useState<boolean>(false);

  // Selected seed types for display
  const [selectedSeedTypes, setSelectedSeedTypes] = useState<SeedType[]>([]);

  // Load tenants and seed types when modal opens
  useEffect(() => {
    if (open) {
      fetchTenants();
      fetchSeedTypes();
    }
  }, [open]);

  const fetchTenants = async () => {
    try {
      setTenantsLoading(true);
      const response = await tenantService.getTenants();
      setTenants(response.results);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setError('Failed to load tenants. Please try again.');
    } finally {
      setTenantsLoading(false);
    }
  };

  const fetchSeedTypes = async () => {
    try {
      setSeedTypesLoading(true);
      const response = await seedTypeService.getSeedTypes();
      setSeedTypes(response);
    } catch (error) {
      console.error('Error fetching seed types:', error);
      setError('Failed to load seed types. Please try again.');
    } finally {
      setSeedTypesLoading(false);
    }
  };

  // Handle changes to form fields
  const handleChange = (
    field: keyof ContainerFormData,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle selection of seed types
  const handleSeedTypeChange = (_: any, values: SeedType[]) => {
    setSelectedSeedTypes(values);
    setFormData((prev) => ({
      ...prev,
      seed_types: values.map((seedType) => seedType.id)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.tenant || !formData.purpose) {
        throw new Error('Please fill in all required fields.');
      }

      // For physical containers, location is required
      if (formData.type === 'physical' && !formData.location) {
        throw new Error('Location is required for physical containers.');
      }

      const response = await containerService.createContainer(formData);
      
      if (response) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create container. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerContainer open={open} width={420}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Create New Container
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Form */}
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            p: 3,
            gap: 3
          }}
        >
          {/* Container Information Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Container Information
            </Typography>
            
            <TextField
              fullWidth
              label="Container Name *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="farm-container-04"
              margin="normal"
              sx={{
                mt: 0,
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputLabel-asterisk': {
                  color: '#d32f2f', 
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                '& .MuiInputLabel-asterisk': {
                  color: '#d32f2f',
                }
              }}>Tenant</InputLabel>
              <Select
                value={formData.tenant}
                onChange={(e) => handleChange('tenant', e.target.value)}
                label="Tenant"
                required
                disabled={tenantsLoading}
                sx={{
                  borderRadius: 1,
                  height: '56px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '& .MuiSelect-select': { 
                    display: 'flex',
                    alignItems: 'center',
                    color: formData.tenant ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)'
                  }
                }}
              >
                {tenantsLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  tenants.map((tenant) => (
                    <MenuItem key={tenant.id} value={tenant.name}>
                      {tenant.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Container Type
              </Typography>
              <ToggleButtonGroup
                color="primary"
                value={formData.type}
                exclusive
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    handleChange('type', newValue);
                  }
                }}
                fullWidth
                sx={{
                  '& .MuiToggleButtonGroup-grouped': {
                    borderRadius: 1,
                    border: '1px solid #E0E0E0',
                    height: '52px',
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#EBF3FF !important',
                    color: 'var(--tw-color-primary) !important',
                  },
                }}
              >
                <ToggleButton 
                  value="physical" 
                  sx={{ 
                    textTransform: 'none',
                    color: formData.type === 'physical' ? 'var(--tw-color-primary)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: formData.type === 'physical' ? 500 : 400,
                  }}
                >
                  Physical
                </ToggleButton>
                <ToggleButton 
                  value="virtual" 
                  sx={{ 
                    textTransform: 'none',
                    color: formData.type === 'virtual' ? 'var(--tw-color-primary)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: formData.type === 'virtual' ? 500 : 400,
                  }}
                >
                  Virtual
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ 
                color: 'rgba(0, 0, 0, 0.6)',
                '& .MuiInputLabel-asterisk': {
                  color: '#d32f2f',
                }
              }}>Purpose</InputLabel>
              <Select
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                label="Purpose"
                required
                sx={{
                  borderRadius: 1,
                  height: '56px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '& .MuiSelect-select': { 
                    display: 'flex',
                    alignItems: 'center',
                    color: formData.purpose ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)'
                  }
                }}
              >
                {PURPOSE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Autocomplete
                multiple
                id="seed-types-select"
                options={seedTypes}
                loading={seedTypesLoading}
                getOptionLabel={(option) => option.name}
                value={selectedSeedTypes}
                onChange={handleSeedTypeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seed Type Variant(s)"
                    placeholder="Select seed types"
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.6)',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        minHeight: '56px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& .MuiInputBase-input': {
                        color: selectedSeedTypes.length > 0 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)',
                      }
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.id}
                      label={option.name}
                      {...getTagProps({ index })}
                      size="small"
                      sx={{
                        backgroundColor: '#EBF3FF',
                        color: 'var(--tw-color-primary)',
                        borderRadius: '16px',
                        '& .MuiChip-deleteIcon': {
                          color: 'var(--tw-color-primary)',
                          '&:hover': {
                            color: '#2563EB'
                          }
                        }
                      }}
                    />
                  ))
                }
              />
            </FormControl>

            <TextField
              fullWidth
              label={formData.type === 'physical' ? 'Location *' : 'Location'}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              margin="normal"
              required={formData.type === 'physical'}
              helperText={formData.type === 'physical' && !formData.location ? 'Location is required for physical containers' : ''}
              error={formData.type === 'physical' && !formData.location}
              sx={{
                '& .MuiInputLabel-root': {
                  color: formData.type === 'physical' && !formData.location ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputLabel-asterisk': {
                  color: '#d32f2f',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: formData.type === 'physical' && !formData.location ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)',
                  }
                },
                '& .MuiFormHelperText-root': {
                  color: '#d32f2f',
                  marginLeft: 0,
                  marginTop: '4px'
                },
                ...(formData.type === 'physical' && !formData.location && {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: '1px solid #d32f2f',
                    },
                    '&:hover fieldset': {
                      border: '1px solid #d32f2f',
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid #d32f2f',
                    },
                  }
                })
              }}
            />

            <TextField
              fullWidth
              label="Notes (optional)"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              margin="normal"
              multiline
              rows={4}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.38)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--tw-color-primary)',
                  }
                },
                '& .MuiInputBase-input': {
                  color: formData.notes ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)',
                }
              }}
              placeholder="Add any additional notes here..."
            />
          </Box>

          {/* Settings Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Settings
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SwitchMedium
                checked={formData.shadow_service_enabled}
                onChange={(e) => handleChange('shadow_service_enabled', e.target.checked)}
                label="Enable Shadow Service"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'var(--tw-color-primary)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'var(--tw-color-primary)',
                    opacity: 0.5,
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  },
                }}
              />
            </Box>
          </Box>

          {/* System Integration Section */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              System Integration
            </Typography>
            
            <CheckboxStandard
              checked={formData.connect_to_other_systems}
              onChange={(e) => handleChange('connect_to_other_systems', e.target.checked)}
              label="Connect to other systems after creation"
              sx={{
                '& .MuiCheckbox-root': {
                  color: 'rgba(0, 0, 0, 0.54)',
                  padding: '9px',
                },
                '& .MuiFormControlLabel-label': {
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.87)',
                },
                '& .Mui-checked': {
                  color: 'var(--tw-color-primary)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px',
                }
              }}
            />
          </Box>

          {/* Error message */}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {/* Submit button */}
          <ButtonPrimary
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 2,
              backgroundColor: 'var(--tw-color-primary)', // Using Tailwind primary color
              borderRadius: '8px',
              height: '48px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '16px',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
              '&:active': {
                backgroundColor: '#1D4ED8',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                color: '#FFFFFF',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Container'}
          </ButtonPrimary>
        </Box>
      </Box>
    </DrawerContainer>
  );
};

export default CreateContainerModal;